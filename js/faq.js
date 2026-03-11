(function () {
    const faqItems = document.querySelectorAll('.faq-item');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('search');
    let activeCategory = 'general';
    function filterFAQs() {
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
        faqItems.forEach(item => {
            const category = item.dataset.category;
            const categoryMatch = (category === activeCategory);
            if (!categoryMatch) {
                item.hidden = true;
                item.classList.remove('active');
                return;
            }
            if (searchTerm === '') {
                item.hidden = false;
            } 
            else {
                const questionEl = item.querySelector('.faq-question');
                const answerEl = item.querySelector('.faq-answer');
                const questionText = questionEl ? questionEl.innerText.toLowerCase() : '';
                const answerText = answerEl ? answerEl.innerText.toLowerCase() : '';
                const matchesSearch =
                    questionText.includes(searchTerm) ||
                    answerText.includes(searchTerm);
                item.hidden = !matchesSearch;
            }
            if (item.hidden) {
                item.classList.remove('active');
            }
        });
    }
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            filterFAQs();
        });
    });
    if (searchInput) {
        searchInput.addEventListener('input', filterFAQs);
    }
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            if (item.hidden) return;
            const isOpen = item.classList.contains('active');
            faqItems.forEach(el => el.classList.remove('active'));
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });
    filterFAQs();
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fullname')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const message = document.getElementById('message')?.value.trim();
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            setTimeout(() => {
                alert(`Thank you, ${name.split(' ')[0]}!\nYour message has been sent.`);
                contactForm.reset();
            }, 600);
        });
    }
    const directionsBtn = document.getElementById('directionsBtn');

    if (directionsBtn) {
        directionsBtn.addEventListener('click', () => {
            window.open(
                'https://www.google.com/maps/place/Athenura',
                '_blank'
            );
        });
    }
})();
window.addEventListener("load", () => {
  const elements = document.querySelectorAll(".fade-up");

  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("show");
    }, index * 120);
  });
});