// Load banner.html into #banner element
function loadBanner() {
    const bannerContainer = document.getElementById("banner");
    if (!bannerContainer) return;

    fetch("banner.html")
        .then((res) => res.text())
        .then((html) => {
            bannerContainer.innerHTML = html;
        })
        .catch((err) => {
            console.error("Failed to load banner:", err);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadBanner();

});


const petGrid = document.querySelector(".switch-pet-grid");
const cycleBtn = document.getElementById("cycle-pet-btn");

if (petGrid && cycleBtn) {
    let pets = [];
    let currentIndex = 0;

    fetch("data/petnames.txt")
        .then(response => response.text())
        .then(text => {
            pets = text
                .split("\n")
                .map(line => line.trim())
                .filter(Boolean);

            pets.forEach((petName, index) => {
                const a = document.createElement("a");
                a.href = `https://www.neopets.com/process_changepet.phtml?new_active_pet=${petName}`;
                a.target = "_blank";

                const figure = document.createElement("figure");

                const img = document.createElement("img");
                img.src = "res/placeholder.png";
                img.dataset.actualSrc = `https://pets.neopets.com/cpn/${petName}/1/7.png`;
                img.classList.add("delayed-load");
                img.alt = petName;

                const caption = document.createElement("figcaption");
                caption.textContent = petName;

                figure.appendChild(img);
                figure.appendChild(caption);
                a.appendChild(figure);
                petGrid.appendChild(a);

                a.addEventListener("click", () => {
                    currentIndex = (index + 1) % pets.length;
                    cycleBtn.textContent = `Switch to ${pets[currentIndex]}`;
                });
            });

            // ✅ THIS is what you were missing
            setTimeout(() => {
                document
                    .querySelectorAll("img.delayed-load")
                    .forEach(img => {
                        img.src = img.dataset.actualSrc;
                        img.classList.remove("delayed-load");
                    });
            }, 200);

            if (pets.length > 0) {
                cycleBtn.textContent = `Switch to ${pets[0]}`;
            }
        });
}


fetch("data/dailies.json")
    .then(response => response.json())
    .then(dailies => {
        const grid = document.getElementById("grid");

        dailies.forEach(item => {
            const card = document.createElement("div");
            card.className = "grid-item";

            card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <p>${item.name}</p>
      `;

            card.addEventListener("click", () => {
                window.open(item.url, "_blank");
            });

            grid.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error loading JSON:", error);
    });
