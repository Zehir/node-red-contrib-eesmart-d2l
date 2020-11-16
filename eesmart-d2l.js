module.exports = function (RED) {

    var crypto = require('crypto');

    function EESmartD2LNode(config) {
        RED.nodes.createNode(this, config);
        this.format_tcp_data = config.format_tcp_data || "default";
        this.format_tcp_output = config.format_tcp_output || "buffer";

        var node = this;

        node.sendErrorMessage = function (code, message, data = {}) {

            let msg = {
                topic: "error_message",
                error_code: code,
                payload: message
            }

            this.send([
                undefined,
                Object.assign(msg, data),
                undefined
            ]);
            this.status({fill: "red", shape: "ring", text: message})
        }

        let TYPE_COMMANDE_V3_PUSH_JSON = 0x3
        let TYPE_COMMANDE_V3_GET_HORLOGE = 0x5

        const ENCRYPTION_CIPHER = 0x1
        const ENCRYPTION_DECIPHER = 0x2

        /**
         *
         * @param buffer Le paquet de donnée
         * @param way ENCRYPTION_CIPHER|ENCRYPTION_DECIPHER
         * @param credentials
         * @returns {Buffer}
         */
        function applyEncryption(buffer, way, credentials) {
            let cle = Buffer.from(credentials.key_application_communication, 'hex');
            let iv = Buffer.from(credentials.key_initialization_vector, 'hex');
            let algorithm = 'aes-128-cbc';
            let cipher

            switch (way) {
                case ENCRYPTION_CIPHER:
                    cipher = crypto.createCipheriv(algorithm, cle, iv);
                    break;
                case ENCRYPTION_DECIPHER:
                    cipher = crypto.createDecipheriv(algorithm, cle, iv);
                    break;
                default:
                    return buffer;
            }

            cipher.setAutoPadding(false)

            return Buffer.concat([buffer.subarray(0, 16), cipher.update(buffer.subarray(16))])
        }

        function generateCRC(buffer) {

            let data = Buffer.concat([buffer.subarray(0, 32), buffer.subarray(34)]);

            let table = Uint16Array.from([
                0x0000, 0xC0C1, 0xC181, 0x0140, 0xC301, 0x03C0,
                0x0280, 0xC241, 0xC601, 0x06C0, 0x0780, 0xC741,
                0x0500, 0xC5C1, 0xC481, 0x0440, 0xCC01, 0x0CC0,
                0x0D80, 0xCD41, 0x0F00, 0xCFC1, 0xCE81, 0x0E40,
                0x0A00, 0xCAC1, 0xCB81, 0x0B40, 0xC901, 0x09C0,
                0x0880, 0xC841, 0xD801, 0x18C0, 0x1980, 0xD941,
                0x1B00, 0xDBC1, 0xDA81, 0x1A40, 0x1E00, 0xDEC1,
                0xDF81, 0x1F40, 0xDD01, 0x1DC0, 0x1C80, 0xDC41,
                0x1400, 0xD4C1, 0xD581, 0x1540, 0xD701, 0x17C0,
                0x1680, 0xD641, 0xD201, 0x12C0, 0x1380, 0xD341,
                0x1100, 0xD1C1, 0xD081, 0x1040, 0xF001, 0x30C0,
                0x3180, 0xF141, 0x3300, 0xF3C1, 0xF281, 0x3240,
                0x3600, 0xF6C1, 0xF781, 0x3740, 0xF501, 0x35C0,
                0x3480, 0xF441, 0x3C00, 0xFCC1, 0xFD81, 0x3D40,
                0xFF01, 0x3FC0, 0x3E80, 0xFE41, 0xFA01, 0x3AC0,
                0x3B80, 0xFB41, 0x3900, 0xF9C1, 0xF881, 0x3840,
                0x2800, 0xE8C1, 0xE981, 0x2940, 0xEB01, 0x2BC0,
                0x2A80, 0xEA41, 0xEE01, 0x2EC0, 0x2F80, 0xEF41,
                0x2D00, 0xEDC1, 0xEC81, 0x2C40, 0xE401, 0x24C0,
                0x2580, 0xE541, 0x2700, 0xE7C1, 0xE681, 0x2640,
                0x2200, 0xE2C1, 0xE381, 0x2340, 0xE101, 0x21C0,
                0x2080, 0xE041, 0xA001, 0x60C0, 0x6180, 0xA141,
                0x6300, 0xA3C1, 0xA281, 0x6240, 0x6600, 0xA6C1,
                0xA781, 0x6740, 0xA501, 0x65C0, 0x6480, 0xA441,
                0x6C00, 0xACC1, 0xAD81, 0x6D40, 0xAF01, 0x6FC0,
                0x6E80, 0xAE41, 0xAA01, 0x6AC0, 0x6B80, 0xAB41,
                0x6900, 0xA9C1, 0xA881, 0x6840, 0x7800, 0xB8C1,
                0xB981, 0x7940, 0xBB01, 0x7BC0, 0x7A80, 0xBA41,
                0xBE01, 0x7EC0, 0x7F80, 0xBF41, 0x7D00, 0xBDC1,
                0xBC81, 0x7C40, 0xB401, 0x74C0, 0x7580, 0xB541,
                0x7700, 0xB7C1, 0xB681, 0x7640, 0x7200, 0xB2C1,
                0xB381, 0x7340, 0xB101, 0x71C0, 0x7080, 0xB041,
                0x5000, 0x90C1, 0x9181, 0x5140, 0x9301, 0x53C0,
                0x5280, 0x9241, 0x9601, 0x56C0, 0x5780, 0x9741,
                0x5500, 0x95C1, 0x9481, 0x5440, 0x9C01, 0x5CC0,
                0x5D80, 0x9D41, 0x5F00, 0x9FC1, 0x9E81, 0x5E40,
                0x5A00, 0x9AC1, 0x9B81, 0x5B40, 0x9901, 0x59C0,
                0x5880, 0x9841, 0x8801, 0x48C0, 0x4980, 0x8941,
                0x4B00, 0x8BC1, 0x8A81, 0x4A40, 0x4E00, 0x8EC1,
                0x8F81, 0x4F40, 0x8D01, 0x4DC0, 0x4C80, 0x8C41,
                0x4400, 0x84C1, 0x8581, 0x4540, 0x8701, 0x47C0,
                0x4680, 0x8641, 0x8201, 0x42C0, 0x4380, 0x8341,
                0x4100, 0x81C1, 0x8081, 0x4040
            ])

            let crc = 0xFFFF;
            for (const b of data)
                crc = table[(b ^ crc) & 0xFF] ^ (crc >> 8 & 0xFF);
            return (crc ^ 0x0000) & 0xFFFF;

        }

        /**
         * @desc Vérifie le cheksum du paquet
         *
         * @param buffer Le paquet de donnée
         * @returns {boolean}
         */
        function checkCRC(buffer) {
            return buffer.readUIntLE(32, 2) === generateCRC(buffer)
        }

        /**
         * @desc Retourne l'entête du buffer
         *
         * @param buffer Le paquet de donnée
         * @param onlyUncrypted retourne seulement les 4 premières entetes qui ne sont pas crytpés
         * @returns {{crc16: *, frameSize: number, payloadSize: number, payloadType: number, idD2L: string, randomNumber: Buffer | BigUint64Array | Uint8Array | Int8Array | Int32Array | Int16Array | Uint16Array | Float64Array | Uint32Array | BigInt64Array | Float32Array | Uint8ClampedArray, protocolVersion: number, nextQuery: number, encryptionMethod: number}}
         */
        function getHeaders(buffer, onlyUncrypted = false) {
            let data = {};

            // Version du protocole, toujours égale à 3
            data.protocolVersion = buffer.readUIntLE(0, 1);
            // Taille de la trame
            data.frameSize = buffer.readUIntLE(2, 2);
            // Identifiant du D2L
            data.idD2L = String(buffer.readBigUInt64LE(4)).padStart(12, '0')
            // Clef AES utilisé, toujours égale à 1
            data.encryptionMethod = buffer.readUIntLE(12, 1) & 0x7;

            // L'entête est crypté après le 16eme octet
            if (onlyUncrypted === true) {
                return data;
            }

            // Nombre aléatoire
            data.randomNumber = buffer.subarray(16, 32);
            // Checksum
            data.crc16 = buffer.subarray(32, 34);
            // Taille du payload
            data.payloadSize = buffer.readUIntLE(34, 2);
            // Type de payload
            data.payloadType = buffer.readUIntLE(36, 1) & 0x7F;
            // Commande suivante (force le D2L à exécuter une fonction) (non documenté)
            data.nextQuery = buffer.readUIntLE(37, 1) & 0x7F;

            // Requete (valeur 0) ou Reponse (valeur 1)
            if (buffer.readUIntLE(36, 1) & 0x80 === 0x80) {
                data.isRequest = true
                data.isResponse = false
            } else {
                data.isRequest = false
                data.isResponse = true
            }
            // Réussie (valeur 0), Erreur (valeur 1)
            if (buffer.readUIntLE(37, 1) & 0x80 === 0x80) {
                data.isSuccess = false
                data.isError = true
            } else {
                data.isSuccess = true
                data.isError = false
            }

            return data
        }

        function generateResponse(idD2L, typePayload, payload) {

            let random = crypto.randomBytes(16)
            let buffer = Buffer.concat([Buffer.alloc(16), random, Buffer.alloc(6), payload])

            let missingBytes = 16 - Buffer.byteLength(buffer) % 16
            if (missingBytes > 0) {
                buffer = Buffer.concat([buffer, Buffer.alloc(missingBytes)])
            }

            buffer.writeUIntLE(0x3, 0, 1) // protocolVersion
            buffer.writeUIntLE(Buffer.byteLength(buffer), 2, 2) // frameSize
            buffer.writeBigUInt64LE(BigInt(idD2L), 4) // idD2L
            buffer.writeUIntLE(0x1, 12, 1) // encryptionMethod
            buffer.writeUIntLE(0x1, 12, 1) // randomNumber
            buffer.writeUIntLE(Buffer.byteLength(payload), 34, 2) // payloadSize
            buffer.writeUIntLE(typePayload + 0x80, 36, 2) // payloadType + response

            // Generate CRC at the end
            buffer.writeUIntLE(generateCRC(buffer), 32, 2) // crc16

            return buffer;
        }

        function getRequestPayloadRaw(headers, buffer) {
            return buffer.subarray(38, 38 + headers.payloadSize).toString('utf8');
        }

        function getRequestPayload(headers, buffer) {
            if (!headers.isRequest || headers.payloadSize === 0 || headers.payloadType !== TYPE_COMMANDE_V3_PUSH_JSON) {
                return {};
            }

            let data = {
                success: true,
                payload: {}
            };

            try {
                data.payload = getRequestPayloadRaw(headers, buffer)
            } catch (error) {
                data.success = false
                data.error_code = "0xB001"
                data.error_message = "Can't read payload"
            }
            try {
                data.payload = JSON.parse(data.payload)
                // Convert horloge
                data.payload._HORLOGE = clockToDate(parseInt(data.payload._HORLOGE, 10))
            } catch (error) {
                data.success = false
                data.error_code = "0xB002"
                data.error_message = "Can't decode JSON payload"
            }

            return data;
        }

        function dateToClock(date) {
            let now = date - Date.UTC(2016, 0); // eeSmart timestamp origin is not 1/1/1970 it's 1/1/2016
            return Math.round(now / 1000);
        }

        function clockToDate(clock) {
            return new Date(Date.UTC(2016, 0) + clock * 1000);
        }


        function getCredentials(node, msg) {
            let cred = {};

            ['id_d2l', 'key_application_communication', 'key_initialization_vector'].forEach((k) => {
                cred[k] = RED.util.evaluateNodeProperty(node.credentials[k], node.credentials[k + "_type"], node, msg);
            });

            return cred;
        }

        function formatOutputData(data) {

            switch (node.format_tcp_data) {
                case "default":
                    let _data = {
                        info: {
                            d2l_id: data._ID_D2L,
                            d2l_firmware: data._DATE_FIRMWARE,
                            serial_number: data.ADCO,
                            frame_type: data._TYPE_TRAME
                        },
                        date: data._HORLOGE
                    }

                    switch (data._TYPE_TRAME) {
                        case 'HISTORIQUE':
                            _data.subscription = {
                                tariff: data.OPTARIF,
                                intensity: parseInt(data.ISOUSC, 10),
                                intensity_max: parseInt(data.IMAX, 10)
                            }

                            if (data.DEMAIN !== undefined && data.DEMAIN.length > 0) {
                                _data.info.tempo_couleur_demain = data.DEMAIN
                            }

                            if (data.PTEC !== undefined && data.PTEC.length > 0) {
                                _data.info.periode_tarifaire = data.PTEC
                            }

                            _data.consumption = {}

                            // Option Base
                            if (data.BASE !== undefined && data.BASE.length > 0) {
                                _data.consumption.base = parseInt(data.BASE, 10)
                            }

                            // Option Heures Creuses
                            if (data.HCHC !== undefined && data.HCHC.length > 0) {
                                _data.consumption.heures_creuses = parseInt(data.HCHC, 10)
                            }
                            if (data.HCHP !== undefined && data.HCHP.length > 0) {
                                _data.consumption.heures_pleines = parseInt(data.HCHP, 10)
                            }

                            // Option EJP
                            if (data.EJPHN !== undefined && data.EJPHN.length > 0) {
                                _data.consumption.ejp_heures_normales = parseInt(data.EJPHN, 10)
                            }
                            if (data.EJPHPM !== undefined && data.EJPHPM.length > 0) {
                                _data.consumption.ejp_heures_pointe_mobile = parseInt(data.EJPHPM, 10)
                            }
                            if (data.PEJP !== undefined && data.PEJP.length > 0) {
                                _data.info.ejp_preavis = parseInt(data.PEJP, 10)
                            }

                            // Option Tempo
                            if (data.BBRHCJB !== undefined && data.BBRHCJB.length > 0) {
                                _data.consumption.tempo_heures_creuses_bleus = parseInt(data.BBRHCJB, 10)
                            }
                            if (data.BBRHPJB !== undefined && data.BBRHPJB.length > 0) {
                                _data.consumption.tempo_heures_pleines_bleus = parseInt(data.BBRHPJB, 10)
                            }
                            if (data.BBRHCJW !== undefined && data.BBRHCJW.length > 0) {
                                _data.consumption.tempo_heures_creuses_blancs = parseInt(data.BBRHCJW, 10)
                            }
                            if (data.BBRHPJW !== undefined && data.BBRHPJW.length > 0) {
                                _data.consumption.tempo_heures_pleines_blancs = parseInt(data.BBRHPJW, 10)
                            }
                            if (data.BBRHCJR !== undefined && data.BBRHCJR.length > 0) {
                                _data.consumption.tempo_heures_creuses_rouges = parseInt(data.BBRHCJR, 10)
                            }
                            if (data.BBRHPJR !== undefined && data.BBRHPJR.length > 0) {
                                _data.consumption.tempo_heures_pleines_rouges = parseInt(data.BBRHPJR, 10)
                            }

                            _data.phases = {}

                            if (data.IINST1 !== undefined && data.IINST1.length > 0) {
                                _data.phases.instant_intensity_1 = parseInt(data.IINST1, 10)
                            }


                            if (data.IINST2 !== undefined && data.IINST2.length > 0) {
                                _data.phases.instant_intensity_2 = parseInt(data.IINST2, 10)
                            }


                            if (data.IINST3 !== undefined && data.IINST3.length > 0) {
                                _data.phases.instant_intensity_3 = parseInt(data.IINST3, 10)
                            }

                            let total = 0
                            for (const key in _data.consumption) {
                                total += _data.consumption[key]
                            }
                            _data.consumption.total = total


                            break;
                        case 'STANDARD':
                            //TODO Support standard mode
                            return {
                                error_code: "0xC001",
                                error_message: "Default mode is not supported for Linky's STANDARD, please use Raw data array."
                            }
                    }


                    return _data;
                case "raw_array":
                default:
                    return data
            }
        }

        node.on('input', function (msg) {

            // Load credentials
            let credentials = getCredentials(node, msg)

            // Check topic
            if (msg.topic !== 'd2l_update') {
                node.send([
                    undefined,
                    {
                        topic: "error_message",
                        error_code: "0xA001",
                        payload: "Can't handle the messages with topic '" + msg.topic + "'.",
                        error_debug_data: ""
                    },
                    undefined
                ]);
                return;
            }

            let dataBuffer
            if (typeof msg.payload === "string") {
                dataBuffer = Buffer.from(msg.payload, 'base64')
            } else if (typeof msg.payload === "object" && Buffer.isBuffer(msg.payload)) {
                dataBuffer = msg.payload
            } else {
                node.sendErrorMessage("0xA005", "Can't parse input data, it's should be Buffer or Base64 String.")
                return;
            }

            let headers = getHeaders(dataBuffer, true)

            // Check D2L id
            if (headers.idD2L !== credentials.id_d2l) {
                node.sendErrorMessage("0xA002", "D2L id mismatch, got '" + headers.idD2L + "' and expect '" + credentials.id_d2l + "'.")
                return;
            }

            // Decrypt Buffer
            dataBuffer = applyEncryption(dataBuffer, ENCRYPTION_DECIPHER, credentials)

            // Update headers again because some are encryped
            headers = getHeaders(dataBuffer)

            // Check if frame is complete
            if (headers.frameSize !== dataBuffer.length) {
                node.sendErrorMessage("0xA006", "Can't read data, part of the data is missing. Try adding a join node between this node and the TCP in node to create a Buffer joining using an empty buffer with a timeout of 0.5 second.")
                return;
            }

            // Check if CRC is OK
            if (!checkCRC(dataBuffer)) {
                node.sendErrorMessage("0xA003", "Can't read data, the checksum is invalid. Please check the Key and IV values")
                return;
            }

            // Check if it's a request
            if (headers.isRequest === false) {
                node.sendErrorMessage("0xFFFF", "Can't handle response messages. Please report this on github if it's was sent by the D2L.")
                return;
            }

            let sendData = new Array(3);

            switch (headers.payloadType) {
                case TYPE_COMMANDE_V3_PUSH_JSON:

                    let requestPayload = getRequestPayload(headers, dataBuffer)
                    if (requestPayload.success === false) {
                        node.sendErrorMessage(requestPayload.error_code, requestPayload.error_message, {error_debug_data: msg.payload})
                        return;
                    }

                    sendData[0] = msg
                    sendData[0].topic = 'd2l_data'
                    sendData[0].payload = requestPayload.payload
                    sendData[0].payloadHeaders = headers
                // Dans tous les cas il faut renvoyer l'horloge alors on ne 'break' pas

                case TYPE_COMMANDE_V3_GET_HORLOGE:

                    sendData[2] = RED.util.cloneMessage(msg)
                    sendData[2].topic = 'd2l_time_update'

                    // Generation de la réponse avec l'heure actuelle
                    let responsePayload = Buffer.alloc(4)
                    responsePayload.writeUIntLE(dateToClock(Date.now()), 0, 4)
                    responsePayload = generateResponse(credentials.id_d2l, headers.payloadType, responsePayload)
                    responsePayload = applyEncryption(responsePayload, ENCRYPTION_CIPHER, credentials)

                    switch (node.format_tcp_output) {
                        case "base64":
                            sendData[2].payload = responsePayload.toString('base64')
                            break;
                        case "buffer":
                        default:
                            sendData[2].payload = responsePayload
                            break;
                    }

                    break;

                default:
                    node.sendErrorMessage(
                        '0xA004',
                        "Unknown Payload Type, got '" + headers.payloadType + "' and expect '" + TYPE_COMMANDE_V3_PUSH_JSON + "' or '" + TYPE_COMMANDE_V3_GET_HORLOGE + "'. Please open an issue on Github.",
                        {
                            payload_size: headers.payloadSize,
                            payload_data: getRequestPayloadRaw(headers, dataBuffer),
                            error_debug_data: msg.payload
                        }
                    )

                    return;

            }

            // Format data
            sendData[0].payload = formatOutputData(sendData[0].payload)
            if (sendData[0].error_code) {
                node.sendErrorMessage(sendData[0].error_code, sendData[0].error_message,)
                return;
            }

            // Status message
            let displayText = node.format_tcp_data === "default" && sendData[0].payload.info.frame_type === "HISTORIQUE" ?
                new Date(Date.now()).toLocaleTimeString() + " : " + sendData[0].payload.consumption.total + " Wh" :
                "Updated at " + new Date(Date.now()).toLocaleTimeString()
            node.status({
                fill: "green",
                shape: "dot",
                text: displayText
            })

            // Send data
            node.send(sendData);
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
