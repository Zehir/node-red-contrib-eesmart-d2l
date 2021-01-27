module.exports = function (RED) {

    const D2L = require('eesmart-d2l')

    function EESmartD2LNode(config) {
        RED.nodes.createNode(this, config);
        this.format_tcp_data = config.format_tcp_data || "default";
        this.format_tcp_output = config.format_tcp_output || "buffer";

        var node = this;

        function getCredentials(node, msg) {
            let cred = {};

            ['id_d2l', 'key_application_communication', 'key_initialization_vector'].forEach((k) => {
                cred[k] = RED.util.evaluateNodeProperty(node.credentials[k], node.credentials[k + "_type"], node, msg);
            });

            return cred;
        }

        node.on('input', function (msg, send, done) {

            // For version of node-red bellow 1.0
            send = send || function () {
                node.send.apply(node, arguments)
            }


            let sendErrorMessage = function (code, message, data) {

                msg.error_detailed = {
                    code: code,
                    message: message
                };

                if (data) {
                    msg.error_detailed.data = data
                }

                if (done) {
                    // Node-RED 1.0 compatible
                    done(message)

                } else {
                    // Node-RED 0.x compatible
                    node.error(message, msg);
                }

                node.status({fill: "red", shape: "ring", text: code + ": " + message})
            }


            // Check topic
            if (msg.topic !== 'd2l_update') {
                sendErrorMessage("BAD_TOPIC", "Impossible de traiter les messages avec le topic '" + msg.topic + "'.");
                return;
            }

            try {

                let dataBuffer
                if (typeof msg.payload === "string") {
                    dataBuffer = Buffer.from(msg.payload, 'base64')
                } else if (typeof msg.payload === "object" && Buffer.isBuffer(msg.payload)) {
                    dataBuffer = msg.payload
                } else {
                    sendErrorMessage("PAYLOAD_BAD_FORMAT", "Impossible de lire la charge utile, il doit être au format 'Buffer' ou 'Base64 String'.")
                    return;
                }

                // Load credentials
                let credentials = getCredentials(node, msg)

                let d2l = new D2L(credentials.key_application_communication, credentials.key_initialization_vector);
                d2l.parseRequest(dataBuffer)

                let sendData = new Array(2);

                // noinspection FallThroughInSwitchStatementJS
                switch (d2l.getPayloadType()) {

                    case 'PUSH_JSON':
                        sendData[0] = msg
                        sendData[0].topic = 'd2l_data'
                        sendData[0].payloadHeaders = d2l.headers
                        sendData[0].payload = d2l.getPayload(node.format_tcp_data)

                    // Dans tous les cas il faut renvoyer l'horloge alors on ne 'break' pas
                    case 'GET_HORLOGE':
                        sendData[1] = RED.util.cloneMessage(msg)
                        sendData[1].topic = 'd2l_time_update'
                        sendData[1].payload = (node.format_tcp_output === 'base64')
                            ? d2l.getResponse().toString('base64')
                            : d2l.getResponse()
                        break;


                    case 'UPDATE_REQUEST':

                        node.status({
                            fill: "blue",
                            shape: "dot",
                            text: new Date(Date.now()).toLocaleTimeString("fr-FR") + " : Récupération de la MàJ logicielle..."
                        })


                        d2l.getFrimwareUpdatePromise().then(value => {

                            sendData[1] = msg
                            sendData[1].topic = 'd2l_frimware_update'

                            sendData[1].payload = (node.format_tcp_output === 'base64') ? value : Buffer.from(value.toString(), 'base64')

                            node.status({
                                fill: "blue",
                                shape: "dot",
                                text: new Date(Date.now()).toLocaleTimeString("fr-FR") + " : Répondu à une demande de MàJ logicielle."
                            })

                            send(sendData);

                            if (done) {
                                done();
                            }

                        }).catch(reason => {
                            sendErrorMessage(
                                'UPDATE_REQUEST_ERROR',
                                reason,
                                {
                                    payload_size: d2l.headers.payloadSize,
                                    payload_data: d2l.getPayloadRaw().toString('base64'),
                                    error_debug_data: msg.payload
                                }
                            );
                        })

                        return;

                    default:
                        sendErrorMessage(
                            'UNKNOWN_PAYLOAD_TYPE',
                            "Type de charge utile inconnue, reçu '" + d2l.headers.payloadType + "' et attend '" + d2l.TYPE_COMMANDE.PUSH_JSON + "' ou '" + d2l.TYPE_COMMANDE.GET_HORLOGE + "'. Merci d'ouvrir une issue sur GitHub.",
                            {
                                payload_size: d2l.headers.payloadSize,
                                payload_data: d2l.getPayloadRaw().toString('base64'),
                                error_debug_data: msg.payload
                            }
                        )
                        return;
                }


                // Status message
                switch (d2l.getPayloadType()) {
                    case 'PUSH_JSON':
                        node.status({
                            fill: "green",
                            shape: "dot",
                            text: node.format_tcp_data === "default" ?
                                new Date(Date.now()).toLocaleTimeString("fr-FR") + " : " + sendData[0].payload.consommation.total + " Wh." :
                                "MàJ à " + new Date(Date.now()).toLocaleTimeString("fr-FR")
                        })
                        break;

                    case 'GET_HORLOGE':
                        node.status({
                            fill: "blue",
                            shape: "dot",
                            text: new Date(Date.now()).toLocaleTimeString("fr-FR") + " : Répondu à une demande d'horloge."
                        })
                        break;

                }

                // Send data
                send(sendData);

                if (done) {
                    done();
                }

            } catch (error) {
                sendErrorMessage(
                    error.code,
                    error.toString()
                )
            }


        });
    }

    RED.nodes.registerType("eesmart-d2l", EESmartD2LNode, {
        credentials: {
            id_d2l: {type: "text"},
            key_application_communication: {type: "text"},
            key_initialization_vector: {type: "text"},
            id_d2l_type: {type: "text"},
            key_application_communication_type: {type: "text"},
            key_initialization_vector_type: {type: "text"},
        },
    });

}
