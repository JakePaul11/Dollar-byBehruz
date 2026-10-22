const navigationButtons =
    document.querySelectorAll(".nav-btn");

const pages =
    document.querySelectorAll(".page");


navigationButtons.forEach(button => {

    button.addEventListener("click", () => {

        navigationButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        pages.forEach(page =>
            page.classList.remove("active")
        );


        button.classList.add("active");


        document
            .getElementById(button.dataset.page)
            .classList.add("active");

    });

});