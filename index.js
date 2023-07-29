const calendrier = document.querySelector(".calendrier"),
    date = document.querySelector(".dateCourante"),
    dates = document.querySelector(".dates"),
    precedant = document.querySelector(".precedant"),
    suivant = document.querySelector(".suivant"),
    aujourdhuiBtn = document.querySelector(".aujourdhui-btn"),
    rechercheBtn = document.querySelector(".recherche-btn"),
    moisInput = document.querySelector(".mois-input"),
    evenementJour = document.querySelector(".evenement-jour"),
    evenementDate = document.querySelector(".evenement-date"),
    listeEvenements = document.querySelector(".evenements"),
    ajoutEvenementSubmit = document.querySelector(".ajout-evenement-btn");
   

let aujourdhui = new Date();
let jourSelectionnee;
let mois = aujourdhui.getMonth();
let annee = aujourdhui.getFullYear();

const listeMois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
];

const tableauEvenement = [];

// Fonction pour ajouter les jours 
function initCalendrier() {
    const premierJour= new Date(annee, mois, 1);
    const dernierJour= new Date(annee, mois+1, 0);
    const avantDernierJour= new Date(annee, mois, 0);
    const joursPrecedants= avantDernierJour.getDate();
    const dernieredate = dernierJour.getDate();
    const jour = (premierJour.getDay() + 6) % 7;
    const joursSuivants = 7 - dernierJour.getDay();

    // Mettre à jour la date (le mois) du calendrier (en haut)
    date.innerHTML = listeMois[mois] + " " + annee;

    // Ajout des jours 
    let jours = "";

    // Jours avant le debut du mois courant
    for (let x = jour; x > 0; x--) {
        jours += `<div class="date mois-avant">${joursPrecedants - x + 1}</div>`;
    }

    // Jours du mois courant 
    for (let i = 1; i <= dernieredate; i++) {
        // Vérifier si le jour contient un événement 
        let event = false;
        tableauEvenement.forEach((eventObj) => {
            if (eventObj.jour == i && eventObj.mois == mois + 1 && eventObj.annee == annee) {
                event = true;
            }
        });
        // Si le jour est aujourd'hui
        // Ajouter la class "selectionnee" au jour d'aujourd'hui par défaut
        if (i === new Date().getDate() && annee === new Date().getFullYear() && mois === new Date().getMonth()) {
            jourSelectionnee = i;
            getJourSelectionnee(i);
            mettreAJourEvenements(i);
            if (event) {
                jours += `<div class="date aujourdhui selectionnee evenement">${i}</div>`;
            }
            else {
                jours += `<div class="date aujourdhui selectionnee">${i}</div>`;
            }
        }
        else {
            if (event) {
                jours += `<div class="date evenement">${i}</div>`;
            }
            else {
                jours += `<div class="date">${i}</div>`;
            }
        }
    }

    // Jours mois suivant
    for(let y = 1; y <= joursSuivants; y++) {
        jours += `<div class= "date mois-apres">${y}</div>`;
    }

    dates.innerHTML = jours;
    addListner();
}

initCalendrier();

function moisPrecedant() {
    mois--;
    if (mois < 0) {
        mois = 11;
        annee--;
    }
    initCalendrier();
}

function moisSuivant() {
    mois++;
    if (mois > 11) {
        mois = 0;
        annee++;
    }
    initCalendrier();
}

precedant.addEventListener("click", moisPrecedant);
suivant.addEventListener("click", moisSuivant);

aujourdhuiBtn.addEventListener("click", () => {
        aujourdhui = new Date();
        mois = aujourdhui.getMonth();
        annee = aujourdhui.getFullYear();
        initCalendrier();
    }
);

moisInput.addEventListener("keyup", (e) => {
        // N'accepter que des nombres 
        moisInput.value = moisInput.value.replace(/[^0-9/]/g, "");
        if (moisInput.value.length === 2) {
            // Ajouter un "/" après les 2 chiffres entrés 
            moisInput.value += "/";
        }
        if (moisInput.value.length > 7) {
            // N'est pas valide 
            moisInput.value = moisInput.value.slice(0, 7);
        }

        if (e.inputType === "deleteContentBackward") {
            if (moisInput.value.length === 3) {
                moisInput.value = moisInput.value.slice(0, 2);
            }
        }
    }
);

//Fonction pour trouver le mois recherché
function rechercherMois() {
    const dateEcrite = moisInput.value.split("/");
    console.log(dateEcrite);
    if (dateEcrite.length == 2) {
        if (dateEcrite[0] > 0 && dateEcrite[0] < 13 && dateEcrite[1].length == 4) {
            mois = dateEcrite[0] - 1;
            annee = dateEcrite[1];
            initCalendrier();
            return;
        }
    }
    alert("Date invalide. Veuillez entrez une nouvelle date valide.");
}

rechercheBtn.addEventListener("click", rechercherMois);

const ajoutEvenementBtn = document.querySelector(".ajout-evenement"),
    ajoutEvenementTab = document.querySelector(".ajout-evenement-tab"),
    ajoutEvenementBtnFermeture = document.querySelector(".fermer"),
    ajoutEvenementTitre = document.querySelector(".nom-evenement"),
    ajoutEvenementDebut = document.querySelector(".heure-evenement-debut"),
    ajoutEvenementFin = document.querySelector(".heure-evenement-fin");

ajoutEvenementBtn.addEventListener ("click", () => {
        ajoutEvenementTab.classList.toggle("active");
    }
)

ajoutEvenementBtnFermeture.addEventListener ("click", () => {
        ajoutEvenementTab.classList.remove("active");
    }
)

document.addEventListener("click", (e) => {
        if (e.target != ajoutEvenementBtn && !ajoutEvenementTab.contains(e.target)) {
            ajoutEvenementTab.classList.remove("active");
        }
    }
);

// Titre de l'événement contient max 60 characters 
ajoutEvenementTitre.addEventListener("input", (e) => {
        ajoutEvenementTitre.value = ajoutEvenementTitre.value.slice(0, 60);
    }
);

// Temps formatté "Début à Fin"
ajoutEvenementDebut.addEventListener("input", (e) => {
        // N'accepter que les chiffres 
        ajoutEvenementDebut.value = ajoutEvenementDebut.value.replace(/[^0-9:]/g, "");
        if (ajoutEvenementDebut.value.length === 2) {
            ajoutEvenementDebut.value += ":";
        }
        // Plus de 5 characters non accéptés 
        if (ajoutEvenementDebut.value.length > 5) {
            ajoutEvenementDebut.value = ajoutEvenementDebut.value.slice(0, 5);
        }
    }
);

ajoutEvenementFin.addEventListener("input", (e) => {
        // N'accepter que les chiffres 
        ajoutEvenementFin.value = ajoutEvenementFin.value.replace(/[^0-9:]/g, "");
        // Ajouter un ":" automatiquement 
        if (ajoutEvenementFin.value.length == 2) {
            ajoutEvenementFin.value += ":";
        }
        // Plus de 5 characters non accéptés 
        if (ajoutEvenementFin.value.length > 5) {
            ajoutEvenementFin.value = ajoutEvenementFin.value.slice(0, 5);
    }
    }
);

function addListner() {
    const jours = document.querySelectorAll(".date");
    jours.forEach((jour) => {
        jour.addEventListener("click", (e) => {

            getJourSelectionnee(e.target.innerHTML);
            mettreAJourEvenements(e.target.innerHTML);

            // Enlever class selectionnee de tout les jours
            jours.forEach((jour) => {
                jour.classList.remove("selectionnee"); // Supprimez le point devant 'selectionnee' pour utiliser correctement la classe
            });

            // Ajouter classe selectionnee au jour cliqué
            e.target.classList.add("selectionnee");

            // Si une date du mois précedant est séléctionnée
            // aller au mois d'avant et ajouter la class selectionnee a la date 
            if (e.target.classList.contains("mois-avant")) {
                moisPrecedant();

                selectionMoisPrecedant(() => {
                    const jours = document.querySelector(".date");
                    // Ajouter "selectionnee" ai jour cliqué après etre allé au mois precedant
                    jours.forEach((jour) => {
                        if ( !(jour.classList.contains("mois-avant")) && jour.innerHTML == e.target.innerHTML) {
                            jour.classList.add("selectionnee");
                        }
                    });
                }, 100);
            }

            if (e.target.classList.contains("mois-apres")) {
                moisSuivant();

                selectionMoisPrecedant(() => {
                    const jours = document.querySelector(".date");
                    // Ajouter "selectionnee" ai jour cliqué après etre allé au mois precedant
                    jours.forEach((jour) => {
                        if ( !(jour.classList.contains("mois-apres")) && jour.innerHTML == e.target.innerHTML) {
                            jour.classList.add("selectionnee");
                        }
                    });
                }, 100);
            }
            
        })
    })
}

function getJourSelectionnee(date) {
    const jour = new Date(annee, mois, date);
    const nomJour = jour.toString().split(" ")[0];
    evenementJour.innerHTML = nomJour;
    evenementDate.innerHTML = date + " " + listeMois[mois] + " " + annee;
}

// Afficher les événements du jour selectionné
function mettreAJourEvenements(date) {
    let events = "";
    tableauEvenement.forEach((event) => {
        // N'avoir que les événements du jour selectionné
        if (date == event.jour && mois + 1 == event.mois && annee == event.annee) {
            // Afficher les evenements 
            event.evenements.forEach((event) => {
                events += `
                    <div class= "evenement">
                        <div class= "titre">
                            <i class= "fas fa-circle"></i>
                            <h3 class= "evenement-titre">${event.titre}</h3>
                        </div>
                        <div class= "evenement-horaire">
                            <span class= "evenement-horaire">${event.horaire}</span>
                        </div>
                    </div>
                `;
            });
        }
    });

    // Si in n'y a aucun événement 
    if ((events == "")) {
        events += `
            <div class= "sans-evenement">
                <h3>Pas d'événements</h3>
            </div>`;
    }
    listeEvenements.innerHTML = events;
}

// Ajouter des événements 
ajoutEvenementSubmit.addEventListener("click", () => {
    const titreEvenement = ajoutEvenementTitre.value;
    const heureDebutEvenement = ajoutEvenementDebut.value;
    const heureFinEvenement = ajoutEvenementFin.value;
    // S'assurer que l'utilisateur a rentré toutes les infos 
    if (titreEvenement == "" || heureDebutEvenement == "" || heureFinEvenement == "") {
        alert("Remplissez les champs nécéssaires SVP.");
        return;
    }

    const heureDebutArr = heureDebutEvenement.split(":");
    const heureFinArr = heureFinEvenement.split(":");

    // S'assurer que le format des infos rentrées sont correct
    if (heureDebutArr.length != 2 || heureFinArr.length != 2 || heureDebutArr[0] > 23 || heureDebutArr[1] > 59 || heureFinArr[0] > 23 || heureFinArr[1] > 59) {
        alert("Format invalid. Veuillez réessayez.");
    }

    const heureDebut = convertirHeure(heureDebutEvenement);
    const heureFin = convertirHeure(heureFinEvenement);
    let evenementAjoute = false;

    const nouvelEvenement =  {
        titre : titreEvenement,
        horaire : heureDebut + " - " + heureFin
    };

    // Si le tableau d'événenements n'est pas vide 
    if (tableauEvenement.length > 0) {
        tableauEvenement.forEach((item) => {
            if (item.jour == jourSelectionnee && item.mois == mois + 1 && item.annee == annee) {
                item.evenements.push(nouvelEvenement);
                evenementAjoute = true;
            }
        })
    }

    // Si le tableau est vide ou le jour n'a pas d'événements creer un nouvel evenement (avec date complete)
    if (!evenementAjoute) {
        tableauEvenement.push( {
            jour: jourSelectionnee,
            mois : mois + 1,
            annee : annee,
            evenements : [nouvelEvenement]
        }); 
    }

    // Réinitialiser le tab d'ajout d'événements 
    ajoutEvenementTab.classList.remove("active");
    ajoutEvenementTitre.value = "";
    ajoutEvenementDebut.value = "";
    ajoutEvenementFin.value = "";

    // Afficher les événements ajoutés 
    mettreAJourEvenements(jourSelectionnee);

    const jourSelectionneElem = document.querySelector(".date.selectionnee");
    if (!jourSelectionneElem.classList.contains("evenement")) {
        jourSelectionneElem.classList.add("evenement");
    }

});

function convertirHeure(horaire) {
    let horaireArr = horaire.split(":");
    let horaireHeure = horaireArr[0];
    let horaireMin = horaireArr[1];
    let horaireFormat = horaireHeure >= 12 ? "PM" : "AM";
    horaireHeure = horaireHeure % 12 || 12;
    horaire = horaireHeure + ":" + horaireMin + " " + horaireFormat;
    return horaire;
}

listeEvenements.addEventListener("click", (e) => {
    if (e.target.classList.contains("evenement")) {
        if (confirm("Etes-vous sur de vouloir supprimer cet événement ?")) {
            const titreEvenement = e.target.children[0].children[1].innerHTML;
            tableauEvenement.forEach((event) => {
                if (event.jour == jourSelectionnee && event.mois == mois + 1 && event.annee == annee) {
                    event.evenements.forEach((item, index) => {
                        if (item.titre == titreEvenement) {
                            event.evenements.splice(index, 1);
                        }
                    })
                }
            })
        }
    }
})
