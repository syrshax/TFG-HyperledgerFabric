import * as grpc from '@grpc/grpc-js';
import * as crypto from 'crypto';
import { connect, Identity, signers, Network, Contract, Gateway} from '@hyperledger/fabric-gateway';
import { promises as fs } from 'fs';
import { TextDecoder } from 'util';
import { endorseMethod } from '@hyperledger/fabric-gateway/dist/client';


const utf8Decoder = new TextDecoder();
const channelname = 'channel1';
const chaincodename = 'tfgsmartcontract1';

interface LoginCredentials{
    
    network: Network;
    contract: Contract;
}

export async function login(): Promise<LoginCredentials> {

    // Se crea la conexcion con la ORG1, proporcionando las credenciales de admin y TLS para conectar con el peer0, principal.
    const credentials = await fs.readFile('../cryptogen/crypto-config/peerOrganizations/org1.tfgalbertous.com/users/Admin@org1.tfgalbertous.com/msp/signcerts/Admin@org1.tfgalbertous.com-cert.pem');
    const identity = { mspId: 'Org1MSP', credentials };

    const clientCert = await fs.readFile('../cryptogen/crypto-config/peerOrganizations/org1.tfgalbertous.com/peers/peer0.org1.tfgalbertous.com/tls/server.crt'); //nos conectamos al peer0 que es el ANCHOR-PEER, necesitamos las credenciales TLS de el.
    const clientKey = await fs.readFile('../cryptogen/crypto-config/peerOrganizations/org1.tfgalbertous.com/peers/peer0.org1.tfgalbertous.com/tls/server.key');
    const caCert = await fs.readFile('../cryptogen/crypto-config/peerOrganizations/org1.tfgalbertous.com/peers/peer0.org1.tfgalbertous.com/tls/ca.crt');


    // Read and set up the private key and signer
    const privateKeyPem = await fs.readFile('../cryptogen/crypto-config/peerOrganizations/org1.tfgalbertous.com/users/Admin@org1.tfgalbertous.com/msp/keystore/priv_sk');
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const signer = signers.newPrivateKeySigner(privateKey);

    
    const credentialTLS = grpc.credentials.createSsl(caCert, clientKey, clientCert);

    const client = new grpc.Client('peer0.org1.tfgalbertous.com:7051',credentialTLS);
    console.log(' \n\n\n\ \t Successfully connected to the peer using GRPC, and built a TLS connection \n\n');


    const gateway = await connect({ identity, signer, client });
  
    const network: Network = await gateway.getNetwork(channelname);
    const contract: Contract = network.getContract(chaincodename);

    //const putResult = await contract.evaluateTransaction('readAsset', 'alberto');
    //console.log ('\t EXECUTED, QUERY TO THE PEER SELECTED, READ THE ASSET:', utf8Decoder.decode(putResult));
    const gatewayIdentity = gateway.getIdentity();
    

    console.log('\t Successfully connected to the GATEWAY \n');
    console.log ('\t The identity of the network is:', gatewayIdentity.mspId, '\n \n \n');


    return { network, contract };

}
