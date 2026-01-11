document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent = `
        .navbar ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #333;
            font-family: Arial, sans-serif;
        }

        .navbar li {
            float: left;
        }

        .navbar li a {
            display: block;
            color: white;
            text-align: center;
            padding: 14px 16px;
            text-decoration: none;
        }

        .navbar li a:hover:not(.active) {
            background-color: #111;
        }

        .navbar li.right {
            float: right;
        }

        .navbar li a.active {
            background-color: #04AA6D;
            color: white;
        }
    `;
    document.head.appendChild(style);

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
