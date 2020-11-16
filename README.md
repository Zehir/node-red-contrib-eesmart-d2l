# Node Red eeSmart D2L
[![GitHub](https://img.shields.io/github/license/zehir/node-red-contrib-eesmart-d2l)](https://github.com/Zehir/node-red-contrib-eesmart-d2l/blob/main/LICENSE)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Zehir/node-red-contrib-eesmart-d2l/NPM%20Publish)](https://github.com/Zehir/node-red-contrib-eesmart-d2l/actions)
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/zehir/node-red-contrib-eesmart-d2l?include_prereleases&label=github&sort=semver)](https://github.com/Zehir/node-red-contrib-eesmart-d2l/releases)
[![npm](https://img.shields.io/npm/v/node-red-contrib-eesmart-d2l)](https://www.npmjs.com/package/node-red-contrib-eesmart-d2l)
[![GitHub issues](https://img.shields.io/github/issues/Zehir/node-red-contrib-eesmart-d2l)](https://github.com/Zehir/node-red-contrib-eesmart-d2l/issues)
[![Liberapay giving](https://img.shields.io/liberapay/gives/Zehir)](https://liberapay.com/Zehir)

Server node for eeSmart D2L Linky

Converts the data sent by the D2L into readable data.

You can install this [node](https://flows.nodered.org/node/node-red-contrib-eesmart-d2l) from 'Manage Palette' option of node red.

## Prerequisites
- [eeSmart D2L](http://eesmart.fr/modulesd2l/erl-wifi-compteur-linky/)
- [Node Red](https://nodered.org/) server

## Getting APP and IV Keys
To get your keys for local server send an email to [support@eesmart.fr](mailto:support@eesmart.fr) with the folowwing data
- Your D2L unique identifier
- Your proof of purchase

[Mail Template](mailto:support@eesmart.fr?subject=Requesting%20Keys%20for%20local%20server&body=Hello%2C%0D%0A%0D%0AI%20would%20like%20to%20get%20my%20keys%20to%20setup%20a%20local%20server%20for%20my%20D2L.%0D%0AHis%20unique%20ID%20is%3A%20XXXXXXXXXXXX%0D%0AI%20buy%20it%20from%20XXXXXXXXXXX%2C%20you%20will%20find%20my%20bill%20attached.%0D%0A%0D%0ACordially%2C%20XXXXX)

## Quickstart
- Create a TCP in node of type "Listen on" port 7845.
- Set the Output to a stream of Buffer.
- Set the Topic to d2l_update.
- Connect this node to the TCP in input.
- Create a TCP out node of type Reply to TCP.
- Connect this node to the TCP out output.
- Connect a debug node to the Data and Error outputs.
- Use the smartphone application to setup your D2L. Use the local server with the Node Red IP and the port 7845 or any used in step 1.
- Read the documentation in Node Red

## References
- [Enedis documentation](https://www.enedis.fr/sites/default/files/Enedis-NOI-CPT_54E.pdf) - full description of data returned by the node
- [D2L User manual](http://eesmart.fr/wp-content/uploads/eeSmart-D2L-Notice-dinstallation.pdf) - how to configure your D2L
