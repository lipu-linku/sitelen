function Get(yourUrl) {
    var Httpreq = new XMLHttpRequest()
    Httpreq.open("GET", yourUrl, false)
    Httpreq.send(null)
    return Httpreq.responseText
}

function build_text(text) {
	return document.createTextNode(text)
}

function build_element(tag, text, classname=null) {
	var div = document.createElement(tag)
	if (classname) {
		div.className = classname
	}
	div.appendChild(build_text(text))
	return div
}

function fill_dictionary() {
	dictionary = document.getElementById("dictionary")
	for (var id in data) {
		if (localStorage.getItem(books_to_checkboxes[data[id]["book"]]) === "true") {
			if (data[id]["sitelen_pona"]) {
				dictionary.appendChild(build_word(id, data[id]))
			}
		}
	}
}
function clear_dictionary() {
	dictionary = document.getElementById("dictionary")
	while (dictionary.firstChild) {
		dictionary.removeChild(dictionary.lastChild)
	}
}

function build_word(id, word) {
	var word_container = document.createElement("div")
	word_container.id = id
	word_container.className = "entry"
	
	word_container.appendChild(build_element("div", word["sitelen_pona"].split(" ")[0], "sitelenpona"))
	word_container.appendChild(build_element("div", word["word"], "word"))

	definition = word["def"][localStorage.getItem("selected_language")]
	if (!definition) {
		word_container.className += " shaded"
		definition = "(en) " + word["def"]["en"]
	}
	definition = definition.split("|")[0].trim()
	word_container.appendChild(build_element("div", definition, "definition"))
	
	
	return word_container
}

function main() {
	// Select language
	language_select_default()
	// Select book
	book_select_default()
	// Generate words
	fill_dictionary()
}

function build_select_option(option_value, text) {
	option_node = document.createElement("option")
	option_node.value = option_value
	option_node.appendChild(build_text(text))
	return option_node
}
function language_select_default() {
	if (!localStorage.getItem("selected_language")) {
		localStorage.setItem("selected_language", "en")
	}
	
	language_selector = document.getElementById("language_selector")
	for (var id in languages) {
		option = build_select_option(id, languages[id]["name_endonym"])
		if (id == localStorage.getItem("selected_language")) {
			option.selected = true
		}
		language_selector.appendChild(option)
	}
}
function language_select_changed(select_node) {
	selected_option = select_node.options[select_node.selectedIndex]
	localStorage.setItem("selected_language", selected_option.value)
	clear_dictionary()
	fill_dictionary()
}

function book_select_default() {
	if (!localStorage.getItem("checkbox_pu")) {
		localStorage.setItem("checkbox_pu", true)
	}
	if (!localStorage.getItem("checkbox_kusuli")) {
		localStorage.setItem("checkbox_kusuli", true)
	}
	if (!localStorage.getItem("checkbox_kulili")) {
		localStorage.setItem("checkbox_kulili", false)
	}
	if (!localStorage.getItem("checkbox_none")) {
		localStorage.setItem("checkbox_none", false)
	}
	book_selector = document.getElementById("book_selector")
	for (var i = 0; i < checkbox_names.length; i++) {
		book_selector.appendChild(build_checkbox_option(checkbox_names[i], localStorage.getItem(checkbox_names[i]) === "true"))
	}
}
function build_checkbox_option(name, value) {
	container = document.createElement("label")
	container.className = "container"
	container.appendChild(build_text(checkbox_labels[name]))
	
	checkbox = document.createElement("input")
	checkbox.type = "checkbox"
	checkbox.id = name
	checkbox.checked = value
	checkbox.onchange = book_select_changed
	
	container.appendChild(checkbox)
	
	checkmark = document.createElement("span")
	checkmark.className = "checkmark"
	container.appendChild(checkmark)
	return container
	/*checkbox = document.createElement("input")
	checkbox.type = "checkbox"
	checkbox.id = name
	checkbox.checked = value
	checkbox.onchange = book_select_changed
	return checkbox*/
}
function book_select_changed() {
	for (var i = 0; i < checkbox_names.length; i++) {
		if ((localStorage.getItem(checkbox_names[i]) === "true") != document.getElementById(checkbox_names[i]).checked) {
			if (localStorage.getItem(checkbox_names[i]) === "true") {
				localStorage.setItem(checkbox_names[i], false)
			} else {
				localStorage.setItem(checkbox_names[i], true)
			}
		}
	}
	clear_dictionary()
	fill_dictionary()
}

const bundle_url = "https://lipu-linku.github.io/jasima/data.json"
const bundle = JSON.parse(Get(bundle_url))
const data = bundle["data"]
const languages = bundle["languages"]

const checkbox_names = ["checkbox_pu", "checkbox_kusuli", "checkbox_kulili", "checkbox_none"]
const books_to_checkboxes = {"pu": "checkbox_pu", "ku suli": "checkbox_kusuli", "ku lili": "checkbox_kulili", "none": "checkbox_none"}
const checkbox_labels = {"checkbox_pu": "show pu words", "checkbox_kusuli": "show ku suli words", "checkbox_kulili": "show ku lili words", "checkbox_none": "show other words"}
const urlParams = new URLSearchParams(window.location.search)
var show_word = null