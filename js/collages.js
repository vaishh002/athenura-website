(function () {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const navAnchors = document.querySelectorAll("#navLinks a");
    const form = document.getElementById("partnershipForm");
    function toggleMenu(e) {
        e.stopPropagation();
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("open");
    }
    function closeMenu() {
        hamburger.classList.remove("active");
        navLinks.classList.remove("open");
    }
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", toggleMenu);
        navAnchors.forEach(link => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });
        document.addEventListener("click", (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                closeMenu();
            }
        });
    }
    navAnchors.forEach(link => {
        link.addEventListener("click", function () {
            navAnchors.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
        if (link.getAttribute("href") === "#") {
            link.addEventListener("click", e => e.preventDefault());
        }
    });
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            let isValid = true;
            const inputs = form.querySelectorAll("input[required], input[type='text'], input[type='email']");
            const select = form.querySelector("select[required]");
            inputs.forEach(el => el.style.border = "1px solid #d1d5db");
            if (select) select.style.border = "1px solid #d1d5db";
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.border = "2px solid red";
                    isValid = false;
                }
            });
            if (select && (!select.value || select.value === "")) {
                select.style.border = "2px solid red";
                isValid = false;
            }
            const emailInput = form.querySelector("input[type='email']");
            if (emailInput && emailInput.value.trim()) {
                const email = emailInput.value.trim();
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (!emailPattern.test(email)) {
                    emailInput.style.border = "2px solid red";
                    alert("Please enter a valid email address");
                    isValid = false;
                }
            }
            if (isValid) {
                alert("Partnership Request Submitted Successfully!");
                form.reset();
                closeMenu();
            }
        });
    }
})();
