import { login } from './gatewaylogin';  // import login from './gatewaylogin';
import { Contract } from '@hyperledger/fabric-gateway';
import { TextDecoder } from 'util';

const utf8Decoder = new TextDecoder();

export async function readUserInfo (contract:Contract, userId: string) {
    const result = await contract.evaluateTransaction('readAsset', userId);
    const decodedToJsonResult = utf8Decoder.decode(result); 
    console.log('**readAssetMethod** has been invoked successfully, result is:', decodedToJsonResult);
    return JSON.parse(decodedToJsonResult);
}

export async function createUser (contract: Contract, userId: string) {
    const result = await contract.submitTransaction('createUser', userId);
    const decodedToJsonResult = utf8Decoder.decode(result); 
    console.log(' **createUser** has been invoked successfully, result is:', utf8Decoder.decode(result));
    return JSON.parse(decodedToJsonResult);
}

export async function addTrip (contract: Contract, userId: string, tripId: string, origin: string, destiny: string) {
    const result = await contract.submitTransaction('addTrip', userId, tripId, origin, destiny);
    const decodedToJsonResult = utf8Decoder.decode(result); 
    console.log(' **addTrip** has been invoked successfully, result is:', utf8Decoder.decode(result));
    return JSON.parse(decodedToJsonResult);
}

export async function addBagToTrip(contract: Contract, userId: string, tripId:string, bagId: string, bagInformation: string) {
    const result = await contract.submitTransaction('addBagToTrip', userId, tripId, bagId, bagInformation);
    const decodedToJsonResult = utf8Decoder.decode(result);
    console.log(' **addBagToTrip** has been invoked successfully, result is:', utf8Decoder.decode(result));
    return JSON.parse(decodedToJsonResult);
}

export async function addSizeAndPrice (contract: Contract, userId: string, tripId: string, bagId: string, size: string, price: string) {
    const result = await contract.submitTransaction('addSizeAndPrice', userId, tripId, bagId, size, price);
    const decodedToJsonResult = utf8Decoder.decode(result);
    console.log(' **addSizeAndPrice** has been invoked successfully, result is:', utf8Decoder.decode(result));
    return JSON.parse(decodedToJsonResult);
}

export async function addCheckpointToBag (contract: Contract, userId: string, tripId: string, bagId: string, stage: string, sensorData: string) {
    const result = await contract.submitTransaction('addCheckpointToBag', userId, tripId, bagId, stage, sensorData);
    const decodedToJsonResult = utf8Decoder.decode(result);
    console.log(' **addCheckpointToBag** has been invoked successfully, result is:', utf8Decoder.decode(result));
    return JSON.parse(decodedToJsonResult);
}

    

// Esta funcion hay que implementarla dentro del chaincode. Lo que hace
// es representar todo el historial de transacciones que se han realizado
// por el usuario, devolviendo todo el historial.
export async function listOfAssetMethod (contract: Contract, ownedId: string) {
    const result = await contract.evaluateTransaction('listOfAsset', ownedId);
    const decodedToJsonResult = utf8Decoder.decode(result);
    console.log('**listOfAssetMethod** has been submitted, result is:', decodedToJsonResult);
    return JSON.parse(decodedToJsonResult);
}