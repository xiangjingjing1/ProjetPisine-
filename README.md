# Projet Piscine

## Vue d'ensemble

Ce projet a pour but de permettre aux étudiants de Polytech de réaliser les examens blancs du TOEIC directement sur un site. Cela permettra de collecter automatiquement les réponses des élèves, de corriger celles-ci et ainsi de donner instantanément sa note à l'élève. De plus, les professeurs seront capables de consulter le score de chaque élève pour une session donnée ainsi qu'obtenir différentes statistiques sur les résultats.

## Technologie

Ce site web tourne sous [Node.JS](https://nodejs.org), les packages principaux utilisés sont :
 * [Express](https://www.npmjs.com/package/express) : un package permettant de gérer les requêtes effectuées sur le serveur (routes, middlewares, etc ...).
 * [Sequelize](https://www.npmjs.com/package/sequelize) : un package mettant à disposition un ORM compatible avec diverses bases de données (Postgres, MySQL, MariaDB, SQLite, Microsoft SQL Server).
 * [Passport](https://www.npmjs.com/package/passport) : un package permettant de mettre en place un middleware gérant l'authentification des utilisateurs.
 * [Mustache](https://www.npmjs.com/package/mustache) : un package implémentant le support pour l'utilisation du langage de template [mustache](http://mustache.github.com/).

 Dans la mesure du possible, le code est écrit en [TypeScript](https://www.typescriptlang.org/).

 ## Installation

 Pour installer le serveur vous allez avoir besoin de Node.JS sur votre système. Vous pouvez télécharger celui-ci sur [le site officiel de Node.JS](https://nodejs.org/en/). Vous pouvez vérifier que vous avez bien installé Node.JS en utilisant la commande `node -v` qui devrait vous afficher la version de Node.JS installée.

Vous devriez avoir aussi, par le même occasion, npm d'installé. Vous pouvez aussi vérifier avec la commande `npm -v` si celui-ci est installé.

 Une fois Node.JS et npm installés, clonez le repo :

```
git clone https://github.com/xiangjingjing1/ProjetPisine-.git
cd ProjetPiscine-
```

Puis installez les dépendances nécessaires au projet :

```
npm install
```

Vous devriez ensuite être capable de lancer le serveur via la commande `npm start`.