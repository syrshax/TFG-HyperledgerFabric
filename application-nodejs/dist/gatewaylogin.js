"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const crypto = __importStar(require("crypto"));
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const fs_1 = require("fs");
const util_1 = require("util");
const utf8Decoder = new util_1.TextDecoder();
const channelname = 'channel1';
const chaincodename = 'tfgsmartcontract1';
async function login() {
    // Se crea la conexcion con la ORG1, proporcionando las credenciales de admin y TLS para conectar con el peer0, principal.
    const credentials = await fs_1.promises.readFile('../cryptogen/crypto-config/peerOrganizations/org1.tfgalbertous.com/users/Admin@org1.tfgalbertous.com/msp/signcerts/Admin@org1.tfgalbertous.com-cert.pem');
    const identity = { mspId: 'Org1MSP', credentials };
    const clientCert = await fs_1.promises.readFile('../cryptogen/crypto-config/peerOrganizations/org1.tfgalbertous.com/peers/peer0.org1.tfgalbertous.com/tls/server.crt'); //nos conectamos al peer0 que es el ANCHOR-PEER, necesitamos las credenciales TLS de el.
    const clientKey = await fs_1.promises.readFile('../cryptogen/crypto-config/peerOrganizations/org1.tfgalbertous.com/peers/peer0.org1.tfgalbertous.com/tls/server.key');
    const caCert = await fs_1.promises.readFile('../cryptogen/crypto-config/peerOrganizations/org1.tfgalbertous.com/peers/peer0.org1.tfgalbertous.com/tls/ca.crt');
    // Read and set up the private key and signer
    const privateKeyPem = await fs_1.promises.readFile('../cryptogen/crypto-config/peerOrganizations/org1.tfgalbertous.com/users/Admin@org1.tfgalbertous.com/msp/keystore/priv_sk');
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const signer = fabric_gateway_1.signers.newPrivateKeySigner(privateKey);
    const credentialTLS = grpc.credentials.createSsl(caCert, clientKey, clientCert);
    const client = new grpc.Client('peer0.org1.tfgalbertous.com:7051', credentialTLS);
    console.log(' \n\n\n\ \t Successfully connected to the peer using GRPC, and built a TLS connection \n\n');
    const gateway = await (0, fabric_gateway_1.connect)({ identity, signer, client });
    const network = await gateway.getNetwork(channelname);
    const contract = network.getContract(chaincodename);
    //const putResult = await contract.evaluateTransaction('readAsset', 'alberto');
    //console.log ('\t EXECUTED, QUERY TO THE PEER SELECTED, READ THE ASSET:', utf8Decoder.decode(putResult));
    const gatewayIdentity = gateway.getIdentity();
    console.log('\t Successfully connected to the GATEWAY \n');
    console.log('\t The identity of the network is:', gatewayIdentity.mspId, '\n \n \n');
    return { network, contract };
}
exports.login = login;
//# sourceMappingURL=gatewaylogin.js.map