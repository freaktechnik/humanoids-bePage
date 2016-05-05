var DEFAULT_SECTION = "profile";

// Hides an element witht the help of css
function hide(element) {
    element.setAttribute("hidden", true);
}

// Shows an element hidden with the hide method
function show(element) {
    element.removeAttribute("hidden");
}

// Make sure a content section is visible
function openSection(section) {
    var sections = document.getElementsByTagName("section");
    for(var i = 0; i < sections.length; ++i) {
        if(sections[i].id === section) {
            show(sections[i]);
            sections[i].scrollIntoView(true);
        }
        else
            hide(sections[i]);
    }

    document.getElementsByTagName("main")[0].className = section;
}

// Change the current content section to the one specified by the page hash
function adaptToHash() {
    var section = DEFAULT_SECTION;
    if(document.location.hash.length > 1) {
        section = document.location.hash.substr(1);
    }
    openSection(section);
}

// Parse the location hash on page load and when it changes
window.onload = adaptToHash;
window.onhashchange = adaptToHash;
