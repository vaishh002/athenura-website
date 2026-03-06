document.addEventListener("DOMContentLoaded", function () {

    const internshipForm = document.getElementById("internship-form")
    const applyButton = document.querySelector(".btn-submit")
    const messageBox = document.getElementById("form-response")

    const allFields = internshipForm.querySelectorAll("input, select, textarea")
    allFields.forEach(function(field) {
        field.addEventListener("invalid", function () {
            field.style.borderColor = "red";
        })
        field.addEventListener("input", function () {
            if (field.checkValidity()) {
                field.style.borderColor = "#00b8d4";
            }
    })
    } )
    internshipForm.addEventListener("submit", function (event) {
    event.preventDefault()
     if (!internshipForm.checkValidity()) {
            internshipForm.reportValidity()
            return
}
        applyButton.disabled = true
        applyButton.innerText = "Please wait..."
        const formData = new FormData(internshipForm)
        fetch("/api/apply", {
            method: "POST",
            body: formData
        })
        .then(function(response) {

            if (response.status === 200) {
                messageBox.innerHTML =
                    "<p style='color:green; text-align:center;'>Thanks for applying! We'll contact you soon.</p>";
                internshipForm.reset()
            } else {
                messageBox.innerHTML =
                    "<p style='color:red; text-align:center;'>Something went wrong. Try again.</p>"
            }
        })
        .catch(function() {
            messageBox.innerHTML =
                "<p style='color:red; text-align:center;'>Server not responding.</p>"
})
        .finally(function() {
            applyButton.disabled = false;
            applyButton.innerText = "Submit Application"
        })
      })
})