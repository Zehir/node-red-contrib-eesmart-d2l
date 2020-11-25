# Changelog

Toutes les modifications notables apportées à ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère au [Versionnage Sémantique](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.5] - 2020-11-24 ![Relative date](https://img.shields.io/date/1606242883?label=)
### Ajout
- Message d'erreur pour la demande de mise à jour du micrologiciel.
### Changement
- Ajout du code d'erreur au message d'état.

## [0.2.4] - 2020-11-19 ![Relative date](https://img.shields.io/date/1605802829?label=)
### Correction
- Message d'erreur pour les requetes de type GET_HORLOGE [#5](https://github.com/Zehir/node-red-contrib-eesmart-d2l/issues/5).

## [0.2.3] - 2020-11-16 ![Relative date](https://img.shields.io/date/1605556772?label=)
### Correction
- Message d'erreur de format par défaut..

## [0.2.2] - 2020-11-16 ![Relative date](https://img.shields.io/date/1605546807?label=)
### Ajout
- Message d'erreur si une partie de la trame TCP est manquante. 

## [0.2.1] - 2020-11-16 ![Relative date](https://img.shields.io/date/1605543464?label=)
### Correction
- Mauvais message de status dans le mode TIC Standard.

## [0.2.0] - 2020-11-16 ![Relative date](https://img.shields.io/date/1605541033?label=)
### Ajout
- Accepte les expression JSONata en options.
- Messages de status du noeud.
- Choix du format de sortie.
### Changement
- Accepte les charges utiles au format buffer et base64.

## [0.1.1] - 2020-11-06 ![Relative date](https://img.shields.io/date/1604690140?label=)
### Ajout
- Ajout du code d'erreur 0xA004 pour les charges utiles au format inconnues.

## [0.1.0] - 2020-11-05 ![Relative date](https://img.shields.io/date/1604531360?label=)
### Changement
- Changement de la catégorie du noeud pour 'parser'.
- id_d2l et maintenant une chaine de caractère à la place d'en nombre.
### Correction 
- Problèmes quand l'ID du D2L commence par 0.

## [0.0.2] - 2020-11-04 ![Relative date](https://img.shields.io/date/1604504235?label=)
### Ajout
- Ce fichier
- Github Workflow pour publier automatiquement le paquet npm.

## [0.0.1] - 2020-11-03 ![Relative date](https://img.shields.io/date/1604449693?label=)
### Ajout
- Première version fonctionnelle.