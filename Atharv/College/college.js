const form = document.getElementById("partnershipForm")

form.addEventListener("submit", function(e){

    e.preventDefault()

    const inputs = form.querySelectorAll("input")
    const select = form.querySelector("select")

    let isValid = true

    inputs.forEach(input => {

        if(input.value.trim() === ""){
            input.style.border = "2px solid red"
            isValid = false
        } else {
            input.style.border = "1px solid #d1d5db"
        }

    })

    if(select.value === "Select Student Count"){
        select.style.border = "2px solid red"
        isValid = false
    } else {
        select.style.border = "1px solid #d1d5db"
    }

    const email = form.querySelector('input[type="email"]').value

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/

    if(!email.match(emailPattern)){
        alert("Please enter a valid email")
        isValid = false
    }

    if(isValid){
        alert("Partnership Request Submitted Successfully!")

        form.reset()
    }

})
