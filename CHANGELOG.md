# Changelog

Toutes les modifications notables apportées à ce projet seront documentées dans ce fichier.

:memo: Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère au [Versionnage Sémantique](https://semver.org/spec/v2.0.0.html).

## [Unreleased] :construction:
## [1.0.0] - 2021-01-27 ![Relative date](https://img.shields.io/date/1611767136?label=) :tada:
### :boom: Mise à jour majeure :boom:
 - Vous allez devoir vérifier les connexions du noeud car la sortie erreur as été supprimée. Voir [Handling errors](https://nodered.org/docs/user-guide/handling-errors).
 - Les labels des données ont été modifiés afin d'être traduites en francais.

### :heavy_plus_sign: Ajout
- :alien: La mise à jour du micrologiciel est maintenant possible. Et sera automatiquement téléchargé sur le [site](http://sicame.io/) du fournisseur.
- :building_construction: Nouveau format détaillé par défaut pour les TIC en version Standard.
- :egg: Ajout d'emoji au changelog.

### :heavy_minus_sign: Suppression
- Suppression de la sortie erreur, il faut à présent utiliser le noeud Catch. Voir [Handling errors](https://nodered.org/docs/user-guide/handling-errors).

### :recycle: Changement
- :truck: Séparation du code indépendant de node-red dans un autre [repo github](https://github.com/Zehir/eesmart-d2l).

## [0.3.0] - 2020-11-25 ![Relative date](https://img.shields.io/date/1606309301?label=) :speech_balloon:
### :recycle: Changement
- Traduction en francais.

## [0.2.5] - 2020-11-24 ![Relative date](https://img.shields.io/date/1606242883?label=)
### :heavy_plus_sign: Ajout
- Message d'erreur pour la demande de mise à jour du micrologiciel.
### :recycle: Changement
- Ajout du code d'erreur au message d'état.

## [0.2.4] - 2020-11-19 ![Relative date](https://img.shields.io/date/1605802829?label=)
### :bug: Correction
- Message d'erreur pour les requetes de type GET_HORLOGE [#5](https://github.com/Zehir/node-red-contrib-eesmart-d2l/issues/5).

## [0.2.3] - 2020-11-16 ![Relative date](https://img.shields.io/date/1605556772?label=)
### :bug: Correction
- Message d'erreur de format par défaut..

## [0.2.2] - 2020-11-16 ![Relative date](https://img.shields.io/date/1605546807?label=)
### :heavy_plus_sign: Ajout
- Message d'erreur si une partie de la trame TCP est manquante. 

## [0.2.1] - 2020-11-16 ![Relative date](https://img.shields.io/date/1605543464?label=)
### :bug: Correction
- Mauvais message de status dans le mode TIC Standard.

## [0.2.0] - 2020-11-16 ![Relative date](https://img.shields.io/date/1605541033?label=) :rocket:
### :heavy_plus_sign: Ajout
- Accepte les expression JSONata en options.
- Messages de status du noeud.
- Choix du format de sortie.
### :recycle: Changement
- Accepte les charges utiles au format buffer et base64.

## [0.1.1] - 2020-11-06 ![Relative date](https://img.shields.io/date/1604690140?label=)
### :heavy_plus_sign: Ajout
- Ajout du code d'erreur 0xA004 pour les charges utiles au format inconnues.

## [0.1.0] - 2020-11-05 ![Relative date](https://img.shields.io/date/1604531360?label=) :rocket:
### :recycle: Changement
- Changement de la catégorie du noeud pour 'parser'.
- id_d2l et maintenant une chaine de caractère à la place d'en nombre.
### :bug: Correction
- Problèmes quand l'ID du D2L commence par 0.

## [0.0.2] - 2020-11-04 ![Relative date](https://img.shields.io/date/1604504235?label=)
### :heavy_plus_sign: Ajout
- Ajout du Changelog.
- Github Workflow pour publier automatiquement le paquet npm.

## [0.0.1] - 2020-11-03 ![Relative date](https://img.shields.io/date/1604449693?label=) :rocket:
### :heavy_plus_sign: Ajout
- Première version fonctionnelle.