# Cookbook pour Home Assistant

*[English version](README.md)*

Un gestionnaire de recettes intégré à Home Assistant, dans un panneau de la barre latérale. Pas de compte supplémentaire : il utilise les utilisateurs Home Assistant.

> 🚧 En cours de développement, pas encore utilisable.

## Installation (dépôt personnalisé HACS)

1. HACS → ⋮ → *Dépôts personnalisés* → ajouter `https://github.com/npanau/ha-cookbook` (type *Intégration*).
2. Installer **Cookbook**, puis redémarrer Home Assistant.
3. *Paramètres → Appareils et services → Ajouter une intégration → Cookbook*.

## Importer une recette depuis une URL

*Importer* (à côté de *Nouvelle recette*) lit une page de recette et l'ouvre dans l'éditeur, pour la
vérifier et la corriger avant de l'enregistrer. Rien n'est enregistré tant que vous ne le faites pas.

- L'analyse est faite par [recipe-scrapers](https://github.com/hhursev/recipe-scrapers), qui connaît
  [des centaines de sites](https://docs.recipe-scrapers.com/getting-started/supported-sites/), dont
  Marmiton. Les autres sites fonctionnent quand leurs pages décrivent la recette avec des données
  schema.org, ce que font la plupart des sites et blogs de cuisine ; le résultat peut alors être moins
  complet.
- **Premier démarrage après installation ou mise à jour** : Home Assistant télécharge recipe-scrapers et
  ses dépendances (une quinzaine de paquets, dont `lxml`). Cela peut prendre une minute.
- **La page est téléchargée par votre Home Assistant**, pas par votre navigateur : le site voit l'adresse
  de votre Home Assistant. Les adresses du réseau local (`192.168.x.x`, `localhost`…) sont refusées, pour
  que l'intégration ne puisse pas servir à sonder votre réseau.
- Les sites modifient leurs pages de temps en temps, ce qui peut casser leur import jusqu'à une mise à
  jour de recipe-scrapers : gardez l'intégration à jour.

## Photos

Une photo par recette, prise ou choisie depuis l'éditeur (ou importée avec la recette). Les photos sont
redimensionnées et stockées dans votre Home Assistant (`/config/cookbook/images/`, inclus dans les
sauvegardes), **sans aucune métadonnée** : une photo de téléphone peut contenir la position GPS de l'endroit
où elle a été prise. Elles ne sont visibles que par les utilisateurs connectés à Home Assistant.

## Développement

Voir la section *Development* du [README anglais](README.md#development).

## Licence

[MIT](LICENSE)
