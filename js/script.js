
/* =====================================================================
   WEDE5020 - script.js
   One JavaScript file shared by all six pages. Every feature first
   checks that the element it needs exists on the current page, so the
   same file can be linked everywhere without causing errors.

   Sections:
     1.  Copyright year                    (all pages)
     2.  Greeting                          (index.html)
     3.  Scroll reveal animation           (all pages)
     4.  Count-up numbers                  (about_us.html)
     5.  Tabs                              (about_us.html)
     6.  Accordion (FAQ)                   (enquiries.html)
     7.  Modal (service details)           (services.html)
     8.  Gallery with lightbox             (about_us.html)
     9.  Products: load, search, sort      (products.html)
     10. Interactive map (Leaflet)         (contact.html)
     11. Form validation                   (enquiries.html, contact.html)
     12. Enquiry form: AJAX + reply        (enquiries.html)
     13. Contact form: build an email      (contact.html)
   ===================================================================== */

// ---------------------------------------------------------------------
// 1. Automatic copyright year
// ---------------------------------------------------------------------
var yearSpan = document.getElementById("year");

if (yearSpan) {
  yearSpan.innerHTML = new Date().getFullYear();
}

// ---------------------------------------------------------------------
// 2. Time-of-day greeting
//    The hero heading (h1) keeps its real text for search engines. The
//    greeting goes in the small line above it.
// ---------------------------------------------------------------------
var greeting = document.getElementById("greeting");

if (greeting) {
  var hour = new Date().getHours();

  if (hour < 12) {
    greeting.innerHTML = "Good morning";
  } else if (hour < 18) {
    greeting.innerHTML = "Good afternoon";
  } else {
    greeting.innerHTML = "Good evening";
  }
}

// ---------------------------------------------------------------------
// 3. Scroll reveal animation
//    Cards and sections fade in as they scroll into view.
//    The CSS for .reveal and .visible is in style.css (section 10).
// ---------------------------------------------------------------------
var revealItems = document.querySelectorAll(
  ".card, .split, .stat-box, .gallery-item, .form-card, .info-card",
);

// IntersectionObserver tells us when an element enters the screen
var observer = new IntersectionObserver(function (entries) {
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
      entries[i].target.classList.add("visible");
      observer.unobserve(entries[i].target); // only animate once
    }
  }
});

for (var r = 0; r < revealItems.length; r++) {
  revealItems[r].classList.add("reveal");
  observer.observe(revealItems[r]);
}

// ---------------------------------------------------------------------
// 4. Count-up numbers
//    <div class="stat-number" data-count="50" data-suffix="+"> counts
//    from 0 up to 50.
// ---------------------------------------------------------------------
function countUp(element) {
  var target = Number(element.dataset.count);
  var suffix = element.dataset.suffix || "";
  var current = 0;
  var step = Math.max(1, Math.round(target / 40));

  var timer = setInterval(function () {
    current = current + step;

    if (current >= target) {
      current = target;
      clearInterval(timer); // stop the timer
    }

    element.textContent = current + suffix;
  }, 40);
}

var counters = document.querySelectorAll("[data-count]");

var counterObserver = new IntersectionObserver(function (entries) {
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
      countUp(entries[i].target);
      counterObserver.unobserve(entries[i].target);
    }
  }
});

for (var c = 0; c < counters.length; c++) {
  counterObserver.observe(counters[c]);
}

// ---------------------------------------------------------------------
// 5. Tabs
//    Each button has aria-controls="id-of-its-panel".
// ---------------------------------------------------------------------
var tabButtons = document.querySelectorAll(".tab-button");
var tabPanels = document.querySelectorAll(".tab-panel");

function showTab(event) {
  var clicked = event.currentTarget;

  // 1. Reset every button and hide every panel
  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
    tabButtons[i].setAttribute("aria-selected", "false");
  }
  for (var j = 0; j < tabPanels.length; j++) {
    tabPanels[j].classList.add("is-hidden");
  }

  // 2. Switch on the clicked button and its panel
  clicked.classList.add("active");
  clicked.setAttribute("aria-selected", "true");
  document
    .getElementById(clicked.getAttribute("aria-controls"))
    .classList.remove("is-hidden");
}

for (var t = 0; t < tabButtons.length; t++) {
  tabButtons[t].addEventListener("click", showTab);

  // Start with only the first panel showing
  if (t > 0) {
    tabPanels[t].classList.add("is-hidden");
  }
}

// ---------------------------------------------------------------------
// 6. Accordion (FAQ)
//    Click a question to open its answer. Only one is open at a time.
// ---------------------------------------------------------------------
var faqItems = document.querySelectorAll(".faq-item");

function toggleFaq(event) {
  var item = event.currentTarget.closest(".faq-item"); // the whole item
  var wasClosed = item.classList.contains("closed");

  // Close every item first
  for (var i = 0; i < faqItems.length; i++) {
    faqItems[i].classList.add("closed");
    faqItems[i].classList.remove("open");
    faqItems[i]
      .querySelector(".faq-question")
      .setAttribute("aria-expanded", "false");
  }

  // Then open the clicked one (unless it was already open)
  if (wasClosed) {
    item.classList.remove("closed");
    item.classList.add("open");
    event.currentTarget.setAttribute("aria-expanded", "true");
  }
}

for (var q = 0; q < faqItems.length; q++) {
  faqItems[q].classList.add("closed"); // start closed
  faqItems[q]
    .querySelector(".faq-question")
    .addEventListener("click", toggleFaq);
}

// ---------------------------------------------------------------------
// 7. Modal: service details
//    The buttons carry the text in data-title and data-details.
//    <dialog> is a built-in HTML element: showModal() opens it with a
//    dark backdrop and close() closes it. Esc works automatically.
// ---------------------------------------------------------------------
var serviceModal = document.getElementById("service-modal");
var detailButtons = document.querySelectorAll(".open-modal");

function openServiceModal(event) {
  var button = event.currentTarget;

  document.getElementById("modal-title").textContent = button.dataset.title;
  document.getElementById("modal-text").textContent = button.dataset.details;
  // The link carries the service name to the enquiry form
  document.getElementById("modal-enquire").href =
    "enquiries.html?service=" + encodeURIComponent(button.dataset.title);

  serviceModal.showModal();
}

function closeServiceModal() {
  serviceModal.close();
}

if (serviceModal) {
  for (var m = 0; m < detailButtons.length; m++) {
    detailButtons[m].addEventListener("click", openServiceModal);
  }

  // Close buttons: anything with the class "close-modal"
  var closeButtons = serviceModal.querySelectorAll(".close-modal");
  for (var x = 0; x < closeButtons.length; x++) {
    closeButtons[x].addEventListener("click", closeServiceModal);
  }

  // Clicking the dark area outside the box also closes it
  serviceModal.addEventListener("click", function (event) {
    if (event.target === serviceModal) {
      closeServiceModal();
    }
  });
}

// ---------------------------------------------------------------------
// 8. Gallery with lightbox
//    Every gallery link points to the big picture, so the gallery still
//    works if JavaScript is off. JavaScript shows it in a lightbox.
// ---------------------------------------------------------------------
var lightbox = document.getElementById("lightbox");
var galleryLinks = document.querySelectorAll(".gallery-item");
var currentPicture = 0; // which picture is showing

function showPicture(number) {
  // Wrap around: after the last picture comes the first
  if (number < 0) {
    number = galleryLinks.length - 1;
  }
  if (number >= galleryLinks.length) {
    number = 0;
  }
  currentPicture = number;

  var link = galleryLinks[number];
  var smallImage = link.querySelector("img");

  document.getElementById("lightbox-img").src = link.href;
  document.getElementById("lightbox-img").alt = smallImage.alt;
  document.getElementById("lightbox-caption").textContent = smallImage.alt;
}

if (lightbox && galleryLinks.length > 0) {
  for (var g = 0; g < galleryLinks.length; g++) {
    galleryLinks[g].addEventListener("click", function (event) {
      event.preventDefault(); // do not follow the link
      showPicture(
        Array.prototype.indexOf.call(galleryLinks, event.currentTarget),
      );
      lightbox.showModal();
    });
  }

  document
    .getElementById("lightbox-prev")
    .addEventListener("click", function () {
      showPicture(currentPicture - 1);
    });
  document
    .getElementById("lightbox-next")
    .addEventListener("click", function () {
      showPicture(currentPicture + 1);
    });
  document
    .getElementById("lightbox-close")
    .addEventListener("click", function () {
      lightbox.close();
    });

  // Keyboard: left and right arrows change the picture
  lightbox.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      showPicture(currentPicture - 1);
    }
    if (event.key === "ArrowRight") {
      showPicture(currentPicture + 1);
    }
  });

  // Clicking outside the picture closes the lightbox
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
}

// ---------------------------------------------------------------------
// 9. Products: load from JSON, then search, filter and sort
//    The product data lives in data/products.json. fetch() loads it
//    and JavaScript builds one card for every product.
//    NOTE: fetch() needs a web server, so open the site with the Live
//    Server extension in VS Code. Double-clicking the file will not work.
// ---------------------------------------------------------------------
var productList = document.getElementById("product-list");
var allProducts = []; // all the products, once loaded

// Build ONE product card with DOM methods (createElement + appendChild)
function makeProductCard(product) {
  var card = document.createElement("article");
  card.className = "product-card";

  var imageBox = document.createElement("div");
  imageBox.className = "product-image";

  var image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name + " product photo";
  image.loading = "lazy";

  var cartLink = document.createElement("a");
  cartLink.className = "add-cart";
  cartLink.href = "enquiries.html?product=" + encodeURIComponent(product.name);
  cartLink.innerHTML =
    '<i class="fa fa-shopping-cart" aria-hidden="true"></i>Enquire';

  imageBox.appendChild(image);
  imageBox.appendChild(cartLink);

  var body = document.createElement("div");
  body.className = "product-card-body";

  var title = document.createElement("h3");
  title.textContent = product.name;

  var meta = document.createElement("div");
  meta.className = "product-meta";
  meta.innerHTML =
    "<span>Size: " +
    product.size +
    "</span><span>R " +
    product.price.toFixed(2) +
    "</span>";

  body.appendChild(title);
  body.appendChild(meta);

  card.appendChild(imageBox);
  card.appendChild(body);

  return card;
}

// Show the products that match the search box, the category and the sort
function showProducts() {
  var searchText = document
    .getElementById("product-search")
    .value.toLowerCase();
  var category = document.getElementById("product-category").value;
  var sortBy = document.getElementById("product-sort").value;

  // 1. Filter: keep only the products that match
  var matches = [];
  for (var i = 0; i < allProducts.length; i++) {
    var product = allProducts[i];
    var nameMatches = product.name.toLowerCase().indexOf(searchText) > -1;
    var categoryMatches = category === "all" || product.category === category;

    if (nameMatches && categoryMatches) {
      matches.push(product);
    }
  }

  // 2. Sort: the function returns a negative number, zero or a positive
  //    number to say which of two products comes first
  matches.sort(function (a, b) {
    if (sortBy === "price-low") {
      return a.price - b.price;
    }
    if (sortBy === "price-high") {
      return b.price - a.price;
    }
    return a.name.localeCompare(b.name); // name A-Z
  });

  // 3. Show: empty the list, then add one card per product
  productList.innerHTML = "";

  for (var j = 0; j < matches.length; j++) {
    productList.appendChild(makeProductCard(matches[j]));
  }

  if (matches.length === 0) {
    productList.innerHTML =
      '<p class="loading">No products match your search.</p>';
  }

  document.getElementById("result-count").textContent =
    "Showing " + matches.length + " of " + allProducts.length + " products";
}

// Load the JSON file. "async" and "await" let us wait for the answer.
async function loadProducts() {
  try {
    var response = await fetch("data/products.json");
    allProducts = await response.json();
    showProducts();
  } catch (error) {
    productList.innerHTML =
      '<p class="load-error">Sorry, the products could not be loaded. ' +
      "Open the site with the Live Server extension or a web server.</p>";
  }
}

if (productList) {
  document
    .getElementById("product-search")
    .addEventListener("input", showProducts);
  document
    .getElementById("product-category")
    .addEventListener("change", showProducts);
  document
    .getElementById("product-sort")
    .addEventListener("change", showProducts);
  loadProducts();
}

// ---------------------------------------------------------------------
// 10. Interactive map (Leaflet + OpenStreetMap)
//     The Leaflet library is loaded in contact.html. It gives us "L".
// ---------------------------------------------------------------------
var mapBox = document.getElementById("map");

if (mapBox && typeof L !== "undefined") {
  var shopPosition = [-26.145933151245117, 28.041826248168945]; // Rosebank Mall

  // Create the map and centre it on the shop (zoom level 13)
  var map = L.map("map").setView(shopPosition, 13);

  // The picture tiles come from OpenStreetMap
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // A marker with a popup
  L.marker(shopPosition)
    .addTo(map)
    .bindPopup("<strong>Logo.</strong><br>Rosebank Mall")
    .openPopup();

  // "Show my location" button: a location-based feature
  var locateButton = document.getElementById("locate-me");
  var mapStatus = document.getElementById("map-status");

  locateButton.addEventListener("click", function () {
    if (!navigator.geolocation) {
      mapStatus.textContent = "Your browser cannot share your location.";
      return;
    }

    mapStatus.textContent = "Finding you...";

    navigator.geolocation.getCurrentPosition(
      function (position) {
        var you = [position.coords.latitude, position.coords.longitude];
        var km = (map.distance(shopPosition, you) / 1000).toFixed(1);

        L.marker(you).addTo(map).bindPopup("You are here");
        map.fitBounds([shopPosition, you]); // zoom to show both markers
        mapStatus.textContent = "You are about " + km + " km from us.";
      },
      function () {
        mapStatus.textContent =
          "We could not get your location. You may have said no.";
      },
    );
  });
} else if (mapBox) {
  mapBox.textContent =
    "The map could not be loaded. Please check your internet connection.";
}

// ---------------------------------------------------------------------
// 11. Form validation (client side)
//     The rules live in the HTML (required, type, pattern, minlength).
//     This code reads them and writes the error messages.
// ---------------------------------------------------------------------

// Work out the error message for ONE field. "" means the field is fine.
function getError(field) {
  var form = field.form;
  var value = field.value.trim();

  // Radio buttons: one in the group must be chosen
  if (field.type === "radio") {
    var chosen = form.querySelector('input[name="' + field.name + '"]:checked');
    if (field.required && chosen === null) {
      return "Please choose an option.";
    }
    return "";
  }

  // Tick box: it must be ticked
  if (field.type === "checkbox") {
    if (field.required && !field.checked) {
      return "Please tick the box to continue.";
    }
    return "";
  }

  // Everything else: use the label's words in the message
  var label = field.labels[0].textContent;

  if (value === "") {
    if (field.required) {
      return label + " is required.";
    }
    return ""; // an empty optional field is fine
  }

  // Email must look like name@site.com
  if (field.type === "email") {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return "Email must look like you@email.com";
    }
  }

  // Name and phone: the pattern attribute decides. Its title is the message.
  if (field.validity.patternMismatch) {
    return field.title;
  }

  // Too short?
  if (value.length < field.minLength) {
    return label + " must be at least " + field.minLength + " characters.";
  }

  // A date must not be in the past
  if (field.type === "date" && value < field.min) {
    return "Please choose today or a later date.";
  }

  return "";
}

// Show the message under the field, or remove it when message is ""
function showError(field, message) {
  // Radio buttons share one message inside their <fieldset>
  var box = field.closest("fieldset") || field.closest(".form-group");
  var error = box.querySelector(".error-message");

  if (message === "") {
    if (error !== null) {
      error.remove();
    }
    field.removeAttribute("aria-invalid");
    return;
  }

  // Create the <span> the first time, then reuse it
  if (error === null) {
    error = document.createElement("span");
    error.className = "error-message";
    box.appendChild(error);
  }
  error.textContent = message;
  field.setAttribute("aria-invalid", "true"); // red border + screen readers
}

// Check one field. Returns true when it is fine.
function checkField(field) {
  var message = getError(field);
  showError(field, message);
  return message === "";
}

// Check every field in a form. Returns the first wrong field (or null).
function checkForm(form) {
  var fields = form.querySelectorAll("input, textarea, select");
  var firstBadField = null;

  for (var i = 0; i < fields.length; i++) {
    var fieldIsFine = checkField(fields[i]);

    if (!fieldIsFine && firstBadField === null) {
      firstBadField = fields[i];
    }
  }
  return firstBadField;
}

// Set up each form on the page
function setUpForm(form) {
  var fields = form.querySelectorAll("input, textarea, select");

  // Dates: the earliest allowed date is today (written yyyy-mm-dd)
  var today = new Date().toISOString().slice(0, 10);
  var dateFields = form.querySelectorAll('input[type="date"]');
  for (var d = 0; d < dateFields.length; d++) {
    dateFields[d].min = today;
  }

  // Check a field when the visitor finishes with it, and re-check
  // while they fix a mistake
  for (var i = 0; i < fields.length; i++) {
    fields[i].addEventListener("change", function (event) {
      checkField(event.target);
    });
    fields[i].addEventListener("input", function (event) {
      if (event.target.getAttribute("aria-invalid") === "true") {
        checkField(event.target);
      }
    });
  }

  // Pressing Send
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page reloading

    var firstBadField = checkForm(form);

    if (firstBadField !== null) {
      firstBadField.focus(); // jump to the first mistake
      return; // do not send
    }

    if (form.id === "enquiry-form") {
      handleEnquiry(form);
    } else if (form.id === "contact-form") {
      handleContact(form);
    }
  });
}

var forms = document.getElementsByTagName("form");

for (var f = 0; f < forms.length; f++) {
  setUpForm(forms[f]);
}

// ---------------------------------------------------------------------
// 12. Enquiry form: send with AJAX, then show a reply
//     AJAX = sending data in the background, without reloading the page.
// ---------------------------------------------------------------------

// The replies. The prices and times are examples: change them to
// match your own storyline.
var enquiryReplies = {
  "General enquiry": {
    cost: "General enquiries are free.",
    availability: "We reply within 2 working days.",
  },
  "Enquiry about a service": {
    cost: "Services start from R 450 per session.",
    availability: "Available Monday to Friday, 08:00 to 17:00.",
  },
  "Enquiry about a product": {
    cost: "Products cost between R 100 and R 450 each.",
    availability: "All items are in stock. Delivery takes 3 to 5 working days.",
  },
  "I want to volunteer": {
    cost: "Volunteering is free.",
    availability: "Volunteers are needed on Saturdays, 09:00 to 13:00.",
  },
  "I want to sponsor": {
    cost: "Sponsorship packages start from R 1 000.",
    availability:
      "We will phone you within 2 working days to discuss the options.",
  },
};

// Send the form to its action address with fetch()
async function sendForm(form) {
  // Demo mode: no real address yet, so pretend to send for a moment
  if (form.action.indexOf("YOUR_FORM_ID") > -1) {
    await new Promise(function (resolve) {
      setTimeout(resolve, 800);
    });
    return { ok: true, demo: true };
  }

  try {
    var response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form), // every field that has a name
      headers: { Accept: "application/json" },
    });
    return { ok: response.ok, demo: false };
  } catch (error) {
    return { ok: false, demo: false }; // no internet, wrong address...
  }
}

async function handleEnquiry(form) {
  var button = form.querySelector('button[type="submit"]');
  var errorMessage = form.querySelector(".form-error");
  var responseBox = document.getElementById("enquiry-response");

  errorMessage.classList.add("is-hidden");
  responseBox.classList.add("is-hidden");

  // Read the values BEFORE the form is cleared
  var firstName = form.elements["name"].value.trim();
  var email = form.elements["email"].value.trim();
  var reason = form.elements["type"].value;

  button.disabled = true;
  button.classList.add("is-loading");
  var result = await sendForm(form);
  button.disabled = false;
  button.classList.remove("is-loading");

  // Error handling: keep what they typed so they can try again
  if (!result.ok) {
    errorMessage.textContent =
      "Sorry, your enquiry could not be sent. Please check your internet connection and try again.";
    errorMessage.classList.remove("is-hidden");
    return;
  }

  // Success: show the reply that matches the reason for contact
  var reply = enquiryReplies[reason];

  document.getElementById("reply-title").textContent =
    "Thank you, " + firstName + "!";
  document.getElementById("reply-reason").textContent =
    "Your enquiry: " + reason;
  document.getElementById("reply-cost").textContent = "Cost: " + reply.cost;
  document.getElementById("reply-availability").textContent =
    "Availability: " + reply.availability;

  if (result.demo) {
    document.getElementById("reply-note").textContent =
      "Demo mode: nothing was sent yet. Add your Formspree address to the form to send for real.";
  } else {
    document.getElementById("reply-note").textContent =
      "We will also email you at " + email + ".";
  }

  form.reset();
  var fields = form.querySelectorAll("input, textarea, select");
  for (var i = 0; i < fields.length; i++) {
    showError(fields[i], ""); // remove any old error messages
  }

  responseBox.classList.remove("is-hidden");
  responseBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Fill the form from the web address, for example
// enquiries.html?product=Zip%20Jacket (used by the Products and
// Services pages)
var enquiryForm = document.getElementById("enquiry-form");

if (enquiryForm) {
  var params = new URLSearchParams(window.location.search);

  if (params.get("product")) {
    enquiryForm.elements["type"].value = "Enquiry about a product";
    enquiryForm.elements["message"].value =
      "I would like to know more about: " + params.get("product");
  }

  if (params.get("service")) {
    enquiryForm.elements["type"].value = "Enquiry about a service";
    enquiryForm.elements["message"].value =
      "I would like to know more about: " + params.get("service");
  }
}

// ---------------------------------------------------------------------
// 13. Contact form: build an email
//     The recipient is the address in the form's action:
//     <form action="mailto:someone@example.com">
// ---------------------------------------------------------------------
function handleContact(form) {
  var recipient = form.getAttribute("action").replace("mailto:", "");

  var name = form.elements["name"].value.trim();
  var surname = form.elements["surname"].value.trim();
  var email = form.elements["email"].value.trim();
  var phone = form.elements["tel"].value.trim();
  var type = form.elements["type"].value;
  var message = form.elements["message"].value.trim();

  // Put the email together
  var subject = type + " from " + name + " " + surname;
  var body =
    "Name: " +
    name +
    " " +
    surname +
    "\n" +
    "Email: " +
    email +
    "\n" +
    "Phone: " +
    phone +
    "\n" +
    "Type of message: " +
    type +
    "\n\n" +
    message;

  // A mailto link opens the visitor's own email app, filled in.
  // encodeURIComponent makes the text safe to use inside a link.
  var mailtoLink =
    "mailto:" +
    recipient +
    "?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body);

  // Show the email so the visitor can check it before sending
  document.getElementById("preview-to").textContent = recipient;
  document.getElementById("preview-subject").textContent = subject;
  document.getElementById("preview-body").textContent = body;
  document.getElementById("send-email").href = mailtoLink;

  var preview = document.getElementById("email-preview");
  preview.classList.remove("is-hidden");
  preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
