/*
humanoids bePage
Copyright (C) 2016 Martin Giger

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
