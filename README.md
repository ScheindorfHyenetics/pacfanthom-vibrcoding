# Fantome Chasseur

Prototype web autonome d'un clone de Pacman inverse: on incarne le fantome bleu et l'objectif est d'attraper Pacman avant les autres fantomes.

## Lancer

Ouvrir `index.html` dans un navigateur.

## Scores

- Fantome joueur: 10 points
- Autre fantome: 5 points
- Pacman termine le labyrinthe: 0 point

Les manches redemarrent automatiquement apres chaque issue.

## Structure

- `index.html`: structure de l'interface et chargement des fichiers.
- `css/styles.css`: styles de l'interface et du plateau SVG.
- `js/config.js`: constantes, carte et directions.
- `js/state.js`: etat mutable de la partie.
- `js/maze.js`: lecture de carte et tests de collisions.
- `js/render.js`: rendu SVG du plateau et des personnages.
- `js/ai.js`: decisions de Pacman et des fantomes rivaux.
- `js/game.js`: boucle de jeu, scores et fins de manche.
- `js/input.js`: clavier, boutons tactiles, pause et relance.
- `js/main.js`: demarrage du prototype.
