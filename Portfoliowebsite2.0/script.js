document.addEventListener("DOMContentLoaded", () => {
    
    // 1. TYPEWRITER EFFEKT (Hero Banner)
    const words = ["Minecraft Mods.", "Web Apps.", "Tools & Scripts."];
    let i = 0;
    let timer;
    const typewriterElement = document.getElementById("typewriter");

    function typingEffect() {
        let word = words[i].split("");
        var loopTyping = function() {
            if (word.length > 0) {
                typewriterElement.innerHTML += word.shift();
            } else {
                setTimeout(deletingEffect, 2000); // 2 Sekunden warten nach dem Schreiben
                return false;
            }
            timer = setTimeout(loopTyping, 100); // Tippgeschwindigkeit
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = typewriterElement.innerHTML;
        var loopDeleting = function() {
            if (word.length > 0) {
                word = word.slice(0, -1);
                typewriterElement.innerHTML = word;
            } else {
                i = (i + 1) % words.length; // Nächstes Wort
                typingEffect();
                return false;
            }
            timer = setTimeout(loopDeleting, 50); // Löschgeschwindigkeit
        };
        loopDeleting();
    }

    // Start Typewriter
    typingEffect();

    // 2. PROJEKT-FILTER
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Aktiven Button hervorheben
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Projekte filtern
            const filterValue = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});