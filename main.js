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

let pets = [];
let currentIndex = 0;

// Fetch pet names from the text file
fetch("petnames.txt")
    .then(response => response.text())
    .then(text => {
        pets = text
            .split('\n')
            .map(line => line.trim())
            .filter(name => name.length > 0);

        // Populate the grid
        pets.forEach((petName, index) => {
            const a = document.createElement("a");
            a.href = `https://www.neopets.com/process_changepet.phtml?new_active_pet=${petName}`;
            a.target = "_blank";
            a.rel = "noreferrer";

            const figure = document.createElement("figure");

            const img = document.createElement("img");
            img.src = "placeholder.png";
            img.dataset.actualSrc = `https://pets.neopets.com/cpn/${petName}/1/7.png`;
            img.classList.add("delayed-load");            
            img.alt = petName;

            const caption = document.createElement("figcaption");
            caption.textContent = petName;

            figure.appendChild(img);
            figure.appendChild(caption);
            a.appendChild(figure);
            petGrid.appendChild(a);

            // Add click listener to sync the "Next Pet" button
            a.addEventListener("click", () => {
                currentIndex = (index + 1) % pets.length;
                const nextName = pets[currentIndex];
                cycleBtn.textContent = `Switch to ${nextName}`;
            });
        });
        setTimeout(() => {
            document.querySelectorAll("img.delayed-load").forEach(img => {
                img.src = img.dataset.actualSrc;
                img.classList.remove("delayed-load");
            });
        }, 200); // Adjust delay as needed
        
        

        // Initialize button text if pets exist
        if (pets.length > 0) {
            cycleBtn.textContent = `Switch to ${pets[0]}`;
        }
    })
    .catch(error => {
        console.error("Failed to load pet names:", error);
    });

// Handle button clicks
cycleBtn.addEventListener("click", () => {
    if (pets.length === 0) return;

    const petName = pets[currentIndex];
    currentIndex = (currentIndex + 1) % pets.length;

    const nextName = pets[currentIndex];
    cycleBtn.textContent = `Switch to ${nextName}`;

    // Open the pet URL in a new tab
    window.open(
        `https://www.neopets.com/process_changepet.phtml?new_active_pet=${petName}`,
        "_blank",
        "noreferrer"
    );
    
});

