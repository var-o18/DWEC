document.addEventListener("DOMContentLoaded", () => {
    fetch("nav.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Nav no disponible");
            }
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);

            const currentPath = window.location.pathname.split("/").pop() || "index.html";
            const navLinks = document.querySelectorAll(".navbar ul li a");

            navLinks.forEach(link => {
                const linkPath = link.getAttribute("href");
                if (linkPath === currentPath) {
                    link.classList.add("active");
                }
            });
        })
        .catch(error => console.error("Error loading navbar:", error));
});
