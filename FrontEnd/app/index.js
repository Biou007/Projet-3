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

async function afficherOeuvres() {
  // Récupération des œuvres depuis l'API
  const reponse = await fetch("http://localhost:5678/api/works");
  const travaux = await reponse.json();

  // Sélection du container galerie
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // vider la galerie avant ajout

  // Parcours et affichage de chaque œuvre
  travaux.forEach((oeuvre) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = oeuvre.imageUrl;
    img.alt = oeuvre.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = oeuvre.title;

    // Assemblage
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Appel de la fonction
afficherOeuvres();

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
