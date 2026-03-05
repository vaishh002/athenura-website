 const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        const filterValue = button.getAttribute("data-filter");
        projectCards.forEach(card => {
          const category = card.getAttribute("data-category");
          card.style.display = filterValue === "all" || category === filterValue ? "flex" : "none";
        });
      });
    });

    const floats = document.querySelectorAll(".floating");
    floats.forEach((el, i) => {
      let angle = 0;
      setInterval(() => {
        angle += 0.02;
        el.style.transform = `translateY(${Math.sin(angle + i) * 15}px)`;
      }, 20);
    });