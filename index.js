document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const voteForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");
    let selectedCharacter = null; // Track selected character

    // Fetch characters from JSON Server
    fetch("http://localhost:3000/characters")
        .then(response => response.json())
        .then(characters => {
            // Populate character bar
            characters.forEach(character => {
                const span = document.createElement("span");
                span.textContent = character.name;
                span.style.cursor = "pointer";
                span.addEventListener("click", () => displayCharacterDetails(character));
                characterBar.appendChild(span);
            });

            // Display "Mr. Cute" by default
            const mrCute = characters.find(c => c.name === "Mr. Cute");
            if (mrCute) {
                displayCharacterDetails(mrCute);
            }
        })
        .catch(error => console.error("Fetching error:", error));

    function displayCharacterDetails(character) {
        const nameElement = document.getElementById("name");
        const imageElement = document.getElementById("image");
        const voteCountElement = document.getElementById("vote-count");
        const voteInput = document.getElementById("votes");

        nameElement.textContent = character.name;
        imageElement.src = character.image;
        imageElement.alt = character.name;
        voteCountElement.textContent = character.votes;

        selectedCharacter = character; // Update global reference

        // Ensure only one event listener is added
        voteForm.onsubmit = (event) => {
            event.preventDefault();
            const votes = parseInt(voteInput.value) || 0;
            selectedCharacter.votes += votes;
            voteCountElement.textContent = selectedCharacter.votes;
            voteInput.value = "";

            // Update votes in database
            fetch(`http://localhost:3000/characters/${selectedCharacter.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ votes: selectedCharacter.votes }),
            });
        };
    }

    // Reset votes to 0
    resetButton.onclick = () => {
        if (!selectedCharacter) return;
        selectedCharacter.votes = 0;
        document.getElementById("vote-count").textContent = 0;

        // Update votes in database
        fetch(`http://localhost:3000/characters/${selectedCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: 0 }),
        });
    };
});
