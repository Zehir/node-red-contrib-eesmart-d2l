# Node-Red eeSmart D2L
[![GitHub](https://img.shields.io/github/license/zehir/node-red-contrib-eesmart-d2l)](https://github.com/Zehir/node-red-contrib-eesmart-d2l/blob/main/LICENSE)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Zehir/node-red-contrib-eesmart-d2l/npm-publish.yml?branch=main)](https://github.com/Zehir/node-red-contrib-eesmart-d2l/actions)
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/zehir/node-red-contrib-eesmart-d2l?include_prereleases&label=github&sort=semver)](https://github.com/Zehir/node-red-contrib-eesmart-d2l/releases)
[![npm](https://img.shields.io/npm/v/node-red-contrib-eesmart-d2l)](https://www.npmjs.com/package/node-red-contrib-eesmart-d2l)
[![GitHub issues](https://img.shields.io/github/issues/Zehir/node-red-contrib-eesmart-d2l)](https://github.com/Zehir/node-red-contrib-eesmart-d2l/issues)
[![Liberapay giving](https://img.shields.io/liberapay/gives/Zehir)](https://liberapay.com/Zehir)
[![Discord](https://img.shields.io/discord/779386253912047647?label=discord)](https://discord.gg/qTd363NKeu)

>N.B: Because this tool is targeted for french people, the documentation is in french. The Linky are only installed in France.

Noeud pour traduire les données brutes envoyées par le D2L d'eeSmart Linky.

Convertit les données brutes en données lisibles.

### :boom: Mise à jour majeure 1.0.0 :boom:
 - Vous allez devoir vérifier les connexions du noeud car la sortie erreur as été supprimée. Voir [Handling errors](https://nodered.org/docs/user-guide/handling-errors).
 - Les labels des données ont été modifiés afin d'être traduites en francais.

## Prérequis
- Un compteur [Linky](https://www.enedis.fr/linky-compteur-communicant).
- Un boitier [eeSmart D2L](http://eesmart.fr/modulesd2l/erl-wifi-compteur-linky/).
- Un serveur [Node-Red](https://nodered.org/).
- Les clés de communication applicative et IV de votre D2L.

### Récupération des clés
Pour récupérer vos clés pour le serveur local il faut envoyer un mail à [support@eesmart.fr](mailto:support@eesmart.fr) avec ces informations :
- L'identifiant unique de votre D2L (Un nombre écrit en dessous du QR Code)
- Votre preuve d'achat (optionnel ?)

:memo: [Modèle de mail](mailto:support@eesmart.fr?subject=Demande%20des%20cl%C3%A9s%20pour%20la%20configuration%20d'un%20serveur%20local&body=Bonjour%2CJ'aimerais%20recevoir%20mes%20cl%C3%A9s%20pour%20configurer%20un%20serveur%20local%20pour%20mon%20D2L.Sont%20identifiant%20unique%20est%20%3A%20XXXXXXXXXXXXJe%20l'ai%20achet%C3%A9%20sur%20XXXXXXXXXXX%2C%20vous%20trouverez%20ci-joint%20la%20facture.Cordialement%2C%20XXXXX)

## Installation
Vous pouvez installer ce [noeud](https://flows.nodered.org/node/node-red-contrib-eesmart-d2l) depuis l'option `Manage Palette` de Node-Red et rechercher `node-red-contrib-eesmart-d2l`. 

Ou en utilisant NPM :
```bash
npm install node-red-contrib-eesmart-d2l
```

## Démarrage rapide
- Créer un noeud "TCP in" de type "Listen on" port 7845.
- Définir la sortie sur "Stream of Buffer".
- Définit le topic à "d2l_update".
- Ajouter un noeud "eeSmart D2L".
- Connecter la sortie du noeud "TCP in" à l'entrée du noeud "eeSmart D2L".
- Créer un noeud "TCP out" de type "Reply to TCP".
- Connecter la sortie TCP du noeud "eeSmart D2L" au noeud "TCP out".
- Connecter un noeud de debug aux sorties Données et Erreurs du noeud "eeSmart D2L".
- Utiliser l'application pour smartphone pour configurer votre D2L. Utiliser le serveur local avec l'adresse IP de votre serveur Node-Red et le port définit dans la première étape.
- Lire la documentation du plugin incluse dans Node-Red.

## Références
- [Documentation Enedis](https://www.enedis.fr/sites/default/files/Enedis-NOI-CPT_54E.pdf) - description complète des données envoyés par le Linky via le D2L.
- [Notice d'installation D2L](http://eesmart.fr/wp-content/uploads/eeSmart-D2L-Notice-dinstallation.pdf) - comment configurer votre D2L.
- [Discord](https://discord.gg/qTd363NKeu) - vous pouvez nous rejoindre sur discord.
- [Repo Github eesmart-d2l](https://github.com/Zehir/eesmart-d2l) - code utilisé pour la communication bas niveau.