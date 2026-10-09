(() => {
    const translations = {
        '← Back to projects': '← Zurück zu den Projekten',
        'Projects': 'Projekte',
        'Profile': 'Profil',
        'Skills': 'Kenntnisse',
        'Network': 'Netzwerk',
        'Contact': 'Kontakt',
        'Education & experience': 'Bildung und Erfahrung',
        'Since 5th grade': 'Seit der 5. Klasse',
        'MINT profile · Andreas-Gymnasium, Berlin': 'MINT-Profil · Andreas-Gymnasium, Berlin',
        'Long-term enrollment in the Mathematics, Informatics, Natural Sciences, and Technology profile. Currently in the Oberstufe / Abitur track.': 'Langjährige Teilnahme am Profil für Mathematik, Informatik, Naturwissenschaften und Technik. Derzeit in der Oberstufe auf dem Weg zum Abitur.',
        'Participant at the Digital Education & Creative Technologies Center, exploring software design, digital workflows, and modern technology applications.': 'Teilnahme am Zentrum für digitale Bildung und kreative Technologien mit Einblicken in Softwaredesign, digitale Workflows und moderne Technologieanwendungen.',
        'Specialized high school internship (Schülerpraktikum) with exposure to enterprise hardware, banking and retail systems software, and infrastructure design.': 'Schülerpraktikum mit Einblicken in Unternehmenshardware, Software für Bank- und Handelssysteme sowie Infrastrukturdesign.',
        'December 2026': 'Dezember 2026',
        'Physics and science excursion exploring particle physics and large-scale scientific infrastructure at the European Organization for Nuclear Research.': 'Physik- und Wissenschaftsexkursion mit Einblicken in Teilchenphysik und große wissenschaftliche Infrastruktur am Europäischen Kernforschungszentrum.',
        'Expected 2028': 'Voraussichtlich 2028',
        '— Specialized / Advanced Mathematics Track.': '— Spezialisierter / fortgeschrittener Mathematik-Schwerpunkt.',
        '— Advanced Computer Science Major for Abitur.': '— Fortgeschrittener Informatik-Leistungskurs für das Abitur.',
        'Languages': 'Sprachen',
        'Native': 'Muttersprache',
        'Advanced · C1–C2. Targeting Cambridge Certification.': 'Fortgeschritten · C1–C2. Cambridge-Zertifikat angestrebt.',
        'Intermediate · B1.': 'Mittelstufe · B1.',
        'Conversational / Native Proficiency.': 'Gute Umgangssprache / muttersprachliches Niveau.',
        'Technical stack': 'Technologie-Stack',
        'Programming languages': 'Programmiersprachen',
        '— primary backend language; advanced OOP, systems architecture, and low-level bytecode manipulation.': '— primäre Backend-Sprache; fortgeschrittene OOP, Systemarchitektur und Low-Level-Bytecode-Manipulation.',
        '— modern JVM-based backend development.': '— moderne JVM-basierte Backend-Entwicklung.',
        '— DOM manipulation and responsive web development.': '— DOM-Manipulation und responsives Webdesign.',
        '— precision input automation, desktop macros, and sequence triggering.': '— präzise Eingabeautomatisierung, Desktop-Makros und Sequenzsteuerung.',
        'Backend & web': 'Backend und Web',
        'Modding & game engineering': 'Modding und Spieleentwicklung',
        'Systems & developer tools': 'Systeme und Entwicklertools',
        'Spring Boot, REST APIs, React, and Tailwind CSS.': 'Spring Boot, REST-APIs, React und Tailwind CSS.',
        'Minecraft Fabric API (1.21+), Mixins (bytecode injection), Mojang Mappings, and IntelliJ IDEA.': 'Minecraft Fabric API (1.21+), Mixins (Bytecode-Injektion), Mojang Mappings und IntelliJ IDEA.',
        'Git, GitHub, Linux, Raspberry Pi, self-hosted Dashy dashboards, and network / REST integration.': 'Git, GitHub, Linux, Raspberry Pi, selbst gehostete Dashy-Dashboards und Netzwerk-/REST-Integration.',
        'Developer network': 'Entwicklernetzwerk',
        'Developer / Collaborator': 'Entwickler / Mitarbeiter',
        'Let’s talk.': 'Lass uns sprechen.',
        'Email': 'E-Mail',
        'Berlin, Germany (CET)': 'Berlin, Deutschland (MEZ)',
        'Profiles': 'Profile',
        'Impressum': 'Legal notice',
        'AI-assisted German translation may contain inaccuracies.': 'Die KI-gestützte deutsche Übersetzung kann Ungenauigkeiten enthalten.'
    };
    const originalTextNodes = new WeakMap();
    const languageButtons = document.querySelectorAll('[data-language]');
    const languageSwitch = document.querySelector('.language-switch');
    const toast = document.querySelector('.translation-toast');
    let toastTimer;
    document.querySelectorAll('[data-year]').forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

    function showTranslationToast() {
        window.clearTimeout(toastTimer);
        toast.hidden = false;
        requestAnimationFrame(() => toast.classList.add('is-visible'));
        toastTimer = window.setTimeout(() => {
            toast.classList.remove('is-visible');
            window.setTimeout(() => { toast.hidden = true; }, 350);
        }, 3200);
    }

    function setLanguage(language, notify = false) {
        const selectedLanguage = language === 'de' ? 'de' : 'en';
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                return node.parentElement?.tagName === 'SCRIPT' || node.parentElement?.tagName === 'STYLE'
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT;
            }
        });
        let node;
        while ((node = walker.nextNode())) {
            if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
            const original = originalTextNodes.get(node);
            const translation = selectedLanguage === 'de' ? translations[original.trim()] : null;
            const leading = original.match(/^\s*/)[0];
            const trailing = original.match(/\s*$/)[0];
            node.nodeValue = translation ? `${leading}${translation}${trailing}` : original;
        }

        document.documentElement.lang = selectedLanguage;
        document.title = `${document.querySelector('h1').textContent.trim()} — Filip Roessner`;
        document.querySelector('.page-nav').setAttribute('aria-label', selectedLanguage === 'de' ? 'Seitennavigation' : 'Section pages');
        languageSwitch.setAttribute('aria-label', selectedLanguage === 'de' ? 'Sprache' : 'Language');
        languageButtons.forEach((button) => {
            button.setAttribute('aria-pressed', String(button.dataset.language === selectedLanguage));
        });
        try {
            localStorage.setItem('site-language', selectedLanguage);
        } catch {}
        if (notify && selectedLanguage === 'de') showTranslationToast();
    }

    languageSwitch.addEventListener('click', () => {
        setLanguage(document.documentElement.lang === 'de' ? 'en' : 'de', document.documentElement.lang !== 'de');
    });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.page-nav a, .back-link, .site-footer a').forEach((link) => {
            link.addEventListener('click', (event) => {
                const destination = new URL(link.href, window.location.href);
                if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
                event.preventDefault();
                document.body.classList.add('is-leaving');
                window.setTimeout(() => window.location.assign(destination.href), 180);
            });
        });
    }

    let savedLanguage = 'en';
    try {
        savedLanguage = localStorage.getItem('site-language') || 'en';
    } catch {}
    setLanguage(savedLanguage);
})();
