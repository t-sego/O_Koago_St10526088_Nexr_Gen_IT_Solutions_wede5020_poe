
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

// 3. FAQ Accordion

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (question) {

  question.setAttribute("aria-expanded", "false");

  question.addEventListener("click", function () {

    const answer = question.nextElementSibling;

    // Open or close the answer
    answer.hidden = !answer.hidden;

    question.setAttribute(
      "aria-expanded",
      String(!answer.hidden)
    );

  });

});

// 4. Gallery Lightbox

const galleryImages = document.querySelectorAll(".gallery-image");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeLightbox = document.getElementById("close-lightbox");

if (lightbox && lightboxImage && closeLightbox) {

  galleryImages.forEach(function (image) {

    image.addEventListener("click", function () {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.hidden = false;
    });

  });

  closeLightbox.addEventListener("click", function () {
    lightbox.hidden = true;
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      lightbox.hidden = true;
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      lightbox.hidden = true;
    }
  });

}

// 5. Enquiry Form Validation

const enquiryForm = document.getElementById("enquiry-form");

if (enquiryForm) {

  enquiryForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("Name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const serviceDropdown = document.getElementById("service");

    const selectedService =
      serviceDropdown.options[serviceDropdown.selectedIndex].text.trim();
    const message = document.getElementById("message").value.trim();

    const feedback = document.getElementById("enquiry-feedback");

    feedback.style.color = "red";

    // Check the customer's name
    if (name.length < 2) {
      feedback.textContent = "Please enter your full name.";
      return;
    }

    // Check the email address
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      feedback.textContent = "Please enter a valid email address.";
      return;
    }
    // Check the phone number
    const phonePattern = /^0[0-9]{9}$/;

    if (!phonePattern.test(phone)) {
      feedback.textContent =
        "Please enter a valid 10-digit South African phone number.";
      return;
    }

    // Check whether a service was selected
    if (service === "") {
      feedback.textContent = "Please select an IT service.";
      return;
    }

    // Check the enquiry message
    if (message === "") {
      feedback.textContent = "Please describe your IT problem.";
      return;
    }

    // All fields are valid

    // 6. Enquiry Response

    let responseMessage = " We will get back to you shortly regarding your enquiry about " + service + ".";

    /* if (service === "Computer  and Laptop Maintenance ") {
       responseMessage =
         "We can assist you with computer problems and troubleshooting.";
     } else if (service === "Software Installation and Setup") {
       responseMessage =
         "We can help you install and set up software.";
     } else if (service === "Basic Website Development") {
       responseMessage =
         "We can assist you with developing a basic website.";
     } else if (service === "IT Technical Support") {
       responseMessage =
         "Our team can assist with your technical support needs.";
     } else if (service === "Data Backup and Recovery") {
       responseMessage =
         "We can help you with data backup and recovery.";
     } else {
       responseMessage =
         "Thank you for your interest in our IT services.";
     }8*/


    // 7. Prepare Enquiry Email

    const businessEmail = "nextgenitsolutions@gmail.com";

    const subject = "New IT Service Enquiry - " + selectedService;

    const emailBody =
      "New Enquiry - NextGen IT Solutions\n\n" +
      "Customer Name: " + name + "\n" +
      "Email: " + email + "\n" +
      "Phone Number: " + phone + "\n" +
      "Selected Service: " + selectedService + "\n\n" +
      "Customer Message:\n" + message + "\n\n" +
      "Service Response: " + responseMessage;

    const mailtoLink =
      "mailto:" + businessEmail +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(emailBody);

    // Display feedback
    feedback.style.color = "green";

    feedback.textContent =
      "Thank you, " + name + "! " +
      responseMessage +
      " Your email application will open. Please press Send to submit your enquiry.";

    // Open the customer's email application
    window.location.href = mailtoLink;



  });

}

// 8. Contact Form Validation

const contactForm = document.getElementById("contact-form");

if (contactForm) {

  contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // Get information entered by the visitor
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    const feedback = document.getElementById("contact-feedback");

    feedback.style.color = "red";

    // Check full name
    if (name.length < 2) {
      feedback.textContent = "Please enter your full name.";
      return;
    }

    // Check email address
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      feedback.textContent = "Please enter a valid email address.";
      return;
    }

    // Check subject
    if (subject === "") {
      feedback.textContent = "Please enter a subject.";
      return;
    }

    // Check message
    if (message === "") {
      feedback.textContent = "Please enter your message.";
      return;
    }

    // All fields are valid

    // 9. Contact Form Response

    let contactResponse = "";

    if (subject.toLowerCase().includes("support")) {
      contactResponse =
        "Our support team can assist you with your question.";

    } else if (subject.toLowerCase().includes("website")) {
      contactResponse =
        "Thank you for your interest in our website services.";

    } else if (subject.toLowerCase().includes("feedback")) {
      contactResponse =
        "We appreciate your feedback.";

    } else {
      contactResponse =
        "We appreciate you contacting NextGen IT Solutions.";
    }

    // Display personalised response
    feedback.style.color = "green";

    feedback.textContent =
      "Thank you, " + name + "! " +
      contactResponse ;


  });

}



