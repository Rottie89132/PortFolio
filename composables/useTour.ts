export default () => {

    return [
        {
            target: "#Volgende",
            title: "Volgende pagina",
            subText: "Navigeer naar de volgende pagina",
            body: "Gebruik deze knop om naar de volgende pagina te gaan. Als er geen volgende pagina is, wordt de knop verborgen.",
            popperConfig: { placement: "bottom" },
        },
        {
            target: "#LastVolgende",
            title: "Laatste pagina",
            subText: "Navigeer naar de laatste pagina",
            body: "Gebruik deze knop om naar de laatste pagina te gaan. Als je op laatste pagina bent, krijgt de knop de omgekeerde functie.",
            popperConfig: { placement: "bottom" },
        },
        {
            target: "#Search",
            title: "Zoeken",
            subText: "Navigeer naar een specifieke pagina",
            body: "Gebruik dit zoekveld om naar een specifieke pagina te navigeren. Als de pagina niet bestaat, wordt je naar de corecte pagina genavigeerd. op basis van de huidige pagina.",
            popperConfig: { mplacement: "bottom" },
        },
        {
            target: ".websitelink",
            title: "Website bezoeken",
            subText: "Bezoek de website van het project",
            body: "Klik hier om naar de website van het project te gaan. Als de website niet beschikbaar is, wordt de knop uitgeschakeld.",
            popperConfig: { placement: "bottom" },
        },
        {
            target: ".githubLink",
            title: "GitHub-pagina bezoeken",
            subText: "Bezoek de GitHub-pagina van het project",
            body: "Klik hier om naar de GitHub-pagina van het project te gaan. ls het project privé is, wordt de knop uitgeschakeld.",
            popperConfig: { placement: "bottom" },
        },
        {
            target: ".liked",
            title: "Opslaan",
            subText: "Project opslaan",
            body: "Gebruik deze knop om het project op te slaan. Zodat je het later gemakkelijk terug kunt vinden.",
            popperConfig: { placement: "bottom" },
        },
    ];

}