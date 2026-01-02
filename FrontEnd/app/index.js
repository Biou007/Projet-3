const works = [
  {
    id: "1",
    title: "Une oeuvre A",
    imageUrl: "https://picsum.photos/200/300",
    categoryId: 1,
    userId: 1,
    category: {
      id: 1,
      name: "Nature",
    },
  },
  {
    id: "3",
    title: "Une oeuvre B",
    imageUrl: "https://picsum.photos/200/300",
    categoryId: 1,
    userId: 1,
    category: {
      id: 1,
      name: "Nature",
    },
  },
  {
    id: "3",
    title: "Une oeuvre C",
    imageUrl: "https://picsum.photos/200/300",
    categoryId: 2,
    userId: 1,
    category: {
      id: 2,
      name: "Animal",
    },
  },
];

// Pour stocker les travaux
let travaux = [];

// Récupérer les travaux depuis l'API
async function recupererOeuvres() {
  const reponse = await fetch("http://localhost:5678/api/works");
  travaux = await reponse.json();
}

// Fonction pour afficher les œuvres
function afficherOeuvres(oeuvres) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  oeuvres.forEach((oeuvre) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = oeuvre.imageUrl;
    img.alt = oeuvre.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = oeuvre.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Fonction pour afficher les filtres
async function afficherFiltres() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  const categories = await reponse.json();

  const sectionFiltres = document.querySelector(".filtres");
  sectionFiltres.innerHTML = "";

  // Bouton "Tous"
  const btnTous = document.createElement("button");
  btnTous.textContent = "Tous";
  btnTous.classList.add("active");
  btnTous.addEventListener("click", () => {
    afficherOeuvres(travaux);
    activerBouton(btnTous);
  });
  sectionFiltres.appendChild(btnTous);

  // Boutons par catégorie
  categories.forEach((categorie) => {
    const bouton = document.createElement("button");
    bouton.textContent = categorie.name;

    bouton.addEventListener("click", () => {
      const travauxFiltres = travaux.filter(
        (oeuvre) => oeuvre.categoryId === categorie.id
      );
      afficherOeuvres(travauxFiltres);
      activerBouton(bouton);
    });

    sectionFiltres.appendChild(bouton);
  });
}

// Fonction pour gérer le bouton actif
function activerBouton(boutonActif) {
  const boutons = document.querySelectorAll(".filtres button");
  boutons.forEach((btn) => btn.classList.remove("active"));
  boutonActif.classList.add("active");
}

// Initialisation de l'application
async function init() {
  await recupererOeuvres();
  afficherOeuvres(travaux);
  afficherFiltres();
}

init();

// TODO : ecrire une fonction qui prend en paramètre, une liste d'oeuvres, et met à jour le DOM pour construire chaque élément HTML représentant une oeuvre
// Et ajouter cette liste dans l'élement HTML qui contient cette liste d'oeuvre
// - le container de la gallerie d'oeuvre sera la classe .gallery
// - La structure html d'une oeuvre commence par l'élément html <figure>
// Avec javascript, trouver un moyen de boucler sur le tableau de données des oeuvres, pour créer l'élément html figure et tous les sous-éléments, puis ajouter cet élément à la gallerie
//
// Voir du côté de la boucle for ou alors du Array.forEach
// Voir également createElement ou utiliser un templateHTML
// Voir querySelector pour récupérer des éléments du DOM
// Voir appendChild pour ajouter un élément dans un autre élément HTML
// Voir comment modifier les attributs d'un élément HTML
//
// J'ai une liste de données => Briques HTML
