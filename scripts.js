// Adjustment to take into account sticky header
const headerHeight = document.querySelector("#main_header").offsetHeight;
document.documentElement.style.setProperty("--header-height", headerHeight + "px");

// Update the year displaying as the copyright year in the footer
const copyrightyear = new Date().getFullYear();
document.querySelector("#copyrightyear").innerHTML = copyrightyear;

// Submit contact form
document.querySelector("#contact_form").addEventListener("submit", function (e) {
  e.preventDefault();

  const btnSubmit = document.querySelector('input[name="contact_submit"]');
  btnSubmit.disabled = true;
  btnSubmit.value = "Processing...";

  grecaptcha.ready(function () {
    grecaptcha
      .execute("6LcSRTgkAAAAAAaSbbw9CcZpVmQYEEKRugPlqNen", {
        action: "contact",
      })
      .then(function (token) {
        document.getElementById("recaptchaResp").value = token;

        // Make the Ajax call here
        var request = new XMLHttpRequest();
        request.open("POST", "mail.php", true);
        request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
            // parse json response
            var response = JSON.parse(request.response);

            // For updating the resulting response message to the user
            const cfm = document.querySelector(".contact_form_message");
            cfm.classList.remove("error");
            cfm.classList.remove("success");
            var resClass = response.success ? "success" : "error";
            cfm.classList.add(resClass);
            cfm.innerHTML = response.message;

            // reenable the submit button and change its name back
            btnSubmit.disabled = false;
            btnSubmit.value = "Submit";

            // if the email was successfully sent, clear/reset the form
            if (response.success) {
              document.querySelector('form[name="contact_form"]').reset();
            }

            // Clear out the message after 5 seconds
            //setTimeout(() => {
            //cfm.classList.remove(resClass);
            //cfm.innerHTML = "";
            //}, "5000");
          }
        };

        var theForm = document.querySelector('form[name="contact_form"]');
        var data = new FormData(theForm);
        request.send(data);
      });
  });
});

// Disable enter button presses from input text fields so the form doesn't submit early
const enterNoSubmit = (e) => {
  if (e.keyCode == 13) {
    e.preventDefault();
  }
};
document.querySelectorAll('input[type="text"]').forEach((field) => {
  field.addEventListener("keyup", enterNoSubmit);
  field.addEventListener("keydown", enterNoSubmit);
  field.addEventListener("keypress", enterNoSubmit);
});
