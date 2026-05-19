const sports = [
  {
    name: "ski alpin",
    image: "assets/illustrations/ski.jpg",
    alt: "person skiing",
    personage: "assets/personnages/ski.png",
    badge: "assets/badges/badge_ski.svg",
    emplacement: "assets/badges/emplacement_badge_ski.svg",
    description: "Découvre le ski : glisse sur des pistes enneigées en pleine nature.<br><br>Prêt à essayer le mini-jeu slalom ?",
    infos: {
      resume: "Le <b>ski alpin</b> est un sport d’hiver qui consiste à descendre des pistes <b>damées</b> avec des skis au pieds.<br> Il est pratiqué en station. Les remontées mécaniques sont utilisées pour rejoindre le haut des pistes, qui présentent plusieurs niveaux de difficultés. Les pistes les plus faciles sont celles de couleur <b>verte</b>, puis les <b>bleues</b>, les <b>rouges</b> et les pistes les plus compliquées sont celles de couleur <b>noire</b>.",
      conseilsDebutant: "Commence sur des pistes <b>vertes ou bleues</b>, prends quelques cours avec un<b> moniteur </b>et équipe-toi correctement avec un <b>casque</b> et des <b>vêtements chauds</b>.",
      lienClub: ["https://www.esf.net/","https://ffs.fr/"],
      materiel: "Skis, bâtons, chaussures de ski, casque, masque, gants, pantalon et manteau de ski.",
      cout: "Le coût moyen dépend de plusieurs facteurs comme la taille de la station mais un forfait pour la saison hivernale coûte en moyenne entre <b>700€</b> et <b>1300€</b>. Pour faire des compétitions, le prix d'une licence est souvent compris entre <b>100€</b> et <b>200€</b> pour l'année.",
      bienfaits: "Améliore <b>l’équilibre</b>, renforce les <b>jambes</b> et procure des supers <b>sensations de glisse</b>.",
      saisonIdeale: "Le ski se pratique principalement <b>l'hiver</b>, une fois que la neige fait son apparition."
    },
    miniJeu: "./games/ski_game.jsx"
  },

  {
    name: "trail",
    image: "assets/illustrations/trail.jpg",
    alt: "person running in the mountains",
    personage: "assets/personnages/trail.png",
    badge: "assets/badges/badge_trail.svg",
    emplacement: "assets/badges/emplacement_badge_trail.svg",
    description: "Découvre le trail : cours sur des chemins en pleine nature et dépasse tes limites.<br><br>Prêt à essayer le mini-jeu de trail ?",
    infos: {
      resume: "Le <b>trail</b>, c'est une course à pied pratiquée sur des sentiers, en <b>forêt</b> ou en <b>montagne</b>. Ce sport combine <b>endurance</b>, <b>aventure</b> et <b>découverte de la nature</b> sur des parcours de quelques kilomètres à plusieurs centaines pour les plus grandes courses.",
      conseilsDebutant: "Commence par de <b>petites distances</b> sur terrain <b>facile</b>, porte des chaussures <b>adaptées</b> et pense à bien <b>t’hydrater</b>.",
      lienClub: ["https://www.athle.fr/contenu/pratique-running-presentation/6047"],
      materiel: "Chaussures de trail, tenue respirante, gourde ou sac d’hydratation.",
      cout: "Pratiqué le trail est <b>gratuit</b> mais s'inscrire à des courses coûte de <b>quelques dizaines</b> à plusieurs centaines d'euros en fonction de la distance parcourus et de la réputation de la course. Le prix d'une licence pour l'année est souvent compris entre <b>100€</b> et <b>150€</b>.",
      bienfaits: "Améliore <b>l’endurance</b>, renforce le <b>cœur</b> et les muscles des <b>jambes</b>.",
      saisonIdeale: "Le <b>trail</b> est une activité qui peut s'effectuer <b>toute l'année</b> mais l'hiver, la neige peut compliquer la pratique en montagne."
    },
    miniJeu: "js/games/trail.js"
  },

  {
    name: "escalade",
    image: "assets/illustrations/escalade.jpg",
    alt: "person climbing outside",
    personage: "assets/personnages/escalade.png",
    badge: "assets/badges/badge_escalade.svg",
    emplacement: "assets/badges/emplacement_badge_escalade.svg",
    description: "Découvre l’escalade : grimpe des parois et développe ta force.<br><br>Prêt à essayer le mini-jeu d’escalade ?",
    infos: {
      resume: "<b> L’escalade</b>  consiste à grimper sur des <b> murs artificiels</b>  ou des <b> falaises naturelles</b>  à l’aide de prises, sur des parcours appelés <b> voies</b> .<br> <br>Il existe <b> plusieurs disciplines</b>  en escalade : <br><ul><li>La <b>voie</b> où le grimpeur monte <b>le plus haut possible</b> sur une grande paroi, avec une <b>corde</b> pour assurer sa sécurité</li> <br> <li>Le <b>bloc</b> qui se pratique sur des murs <b>plus bas</b>, sans corde, avec des tapis de protection au sol. Les mouvements sont souvent <b>plus physiques et techniques</b>.</li><br> <li>La <b>vitesse</b> où deux grimpeurs <b>s’affrontent</b> sur une <b>même voie</b> pour atteindre le sommet le plus <b>rapidement</b> possible.</li> </ul><br> Chaque voie possède une <b>cotation</b> qui permet d’indiquer son <b>niveau de difficulté</b>. En France, les niveaux vont généralement de <b>4</b> (facile) à <b>9</b> (très difficile).<br>Chaque niveau est ensuite <b>divisé en trois sous-niveaux</b> : a, b et c, où <b>a</b> est le plus accessible et <b>c</b> le plus difficile. Par exemple, une voie cotée 6a sera plus simple qu’une voie en 6c.<br>",
      conseilsDebutant: "Commence en salle avec un <b>encadrant</b>, apprends les <b>règles de sécurité</b> et grimpe sur des <b>voies faciles</b>.",
      lienClub: ["https://www.ffme.fr/"],
      materiel: "Chaussons d’escalade, baudrier, corde, casque et magnésie (pour éviter d'avoir les mains glissantes).",
      cout: "Le prix d'une entrée dans une salle d'escalade est souvent situé entre <b>12</b> et <b>20€</b> la séance. Le prix d'une licence pour l'année est souvent compris entre <b>100€</b> et <b>200€</b>.",
      bienfaits: "Renforce les <b>bras</b> et le <b>dos</b> et améliore la <b>souplesse</b>.",
      saisonIdeale: "L'escalade se pratique <b>toute l’année</b>. Les voies les plus en altitudes sont déconseillées l'hiver."
    },
    miniJeu: "js/games/escalade.js"
  },

  {
    name: "velo route",
    image: "assets/illustrations/velo_route.jpg",
    alt: "person biking in the moutains",
    personage: "assets/personnages/velo_route.png",
    badge: "assets/badges/badge_velo_route.svg",
    emplacement: "assets/badges/emplacement_badge_velo.svg",
    description: "Découvre le vélo de route : roule sur de longues distances et améliore ton endurance.<br><br> Prêt à essayer le mini-jeu de vélo de route ?",
    infos: {
      resume: "Le <b>vélo de route</b> est un sport d’endurance pratiqué sur <b>routes asphaltées</b>. Il permet de parcourir de <b>longues distances</b> et <b>d’améliorer sa condition physique</b> tout en découvrant de nouveau paysages. C'est aussi un moyen très <b>écologique</b> de se <b>déplacer</b>.",
      conseilsDebutant: "Commence par des <b>trajets courts</b>, <b>règle</b> (ou fait régler) correctement <b>ton vélo</b> et porte toujours un <b>casque</b>.",
      lienClub: ["https://www.ffc.fr/"],
      materiel: "Vélo de route, casque, lunettes, tenue adaptée et bidon (gourde).",
      cout: "Pratiqué le vélo de route est <b>gratuit</b> mais s'inscrire à des courses coûte majoritairement quelques <b>dizaines à centaines d'euros</b>. Le prix d'une licence pour l'année est souvent compris entre <b>100€</b> et <b>200€</b>.",
      bienfaits: "Améliore <b>l’endurance</b>, renforce le <b>cœur</b> et les muscles des <b>jambes</b>.",
      saisonIdeale: "Le vélo se pratique <b>toute l'année</b> quand les conditions le permettent. Si la météo n'est pas favorable, il est aussi possible d'utiliser un <b>home trainer</b> pour tourner les jambes <b>chez soi</b>."
    },
    miniJeu: "js/games/veloRoute.js"
  }
]


export default sports;



