var applyChange = function(e) {
    document.body.className = location.hash == "" ? "empty" : "";
};
window.onhashchange = applyChange;
window.onload = applyChange;

