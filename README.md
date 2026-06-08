# Outdoor Explorer - Les Sports Plein Air

**Outdoor Explorer** est une application web interactive et ludique conçue sous forme de livre numérique. Elle permet de découvrir différents sports de nature à travers des mini-jeux.
Pour déverrouiller les fiches informatives de chaque sport (matériel nécessaire, bienfaits, conseils de débutant, liens vers des clubs), l'utilisateur doit gagner un mini-jeu d'arcade intégré !

---

## Le Concept & Fonctionnalités

1. **Système de connexion :** Une page d'accueil pour entrer son nom d'utilisateur retrouver sa progression.
2. **Livre interactif :** Une navigation réaliste où l'utilisateur clique sur les pages pour les tourner physiquement et parcourir le livre.
3. **4 Mini-Jeux Arcade :**
   * **Ski :** Slalomez et passez entre les portes.
   * **Trail :** Evitez les obstacles (rochers, arbres) sur le sentier avec les flèches du clavier.
   * **Escalade :** Un jeu QTE (Quick Time Event) où il faut presser les bonnes touches de lettres affichées sur les prises pour grimper la paroi.
   * **Vélo de Route :** Ne quittez pas la route à l'aide des flèches gauche et droite.
4. **Système de Progression :** Les informations détaillées du sport sont floutées tant que le mini-jeu correspondant n'a pas été remporté. Une fois gagné, le badge du sport est débloqué et la fiche devient lisible.

> **Note de navigation :** L'application intègre une détection d'appareil et avertit l'utilisateur par une alerte que le site est optimisé pour une navigation sur ordinateur.

---

## Technique

* **Frontend :** React (Gestion des pages dynamique)
* **Moteur Graphique :** HTML5 Canvas 2D (Animations, hitboxes et défilement des décors généré aléatoirement).
* **Styles :** CSS3 (Animations de flip 3D et flous dynamiques).

---
