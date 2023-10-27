document.addEventListener("DOMContentLoaded", function() {
    var menuButton = document.querySelector(".menu-button");
    var navMenu = document.querySelector(".nav-menu");

    menuButton.addEventListener("click", function() {
        if (navMenu.style.display === "none" || navMenu.style.display === "") {
            navMenu.style.display = "block";
        } else {
            navMenu.style.display = "none";
        }
    });
});