
 // NextGen IT Solutions
// WEDE5020 - Part 3
// JavaScript Features

// 1. Automatic Copyright Year

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// 2. Live Service Search

const serviceSearch = document.getElementById("service-search");
const serviceCards = document.querySelectorAll(".service-card");

if (serviceSearch) {

    serviceSearch.addEventListener("input", function () {

        let searchText = serviceSearch.value.toLowerCase().trim();

        serviceCards.forEach(function (card) {

            let serviceText = card.textContent.toLowerCase();

            if (serviceText.includes(searchText)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });

}
