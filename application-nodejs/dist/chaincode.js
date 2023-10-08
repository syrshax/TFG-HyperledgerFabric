"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOfAssetMethod = exports.addCheckpointToBag = exports.addSizeAndPrice = exports.addBagToTrip = exports.addTrip = exports.createUser = exports.readUserInfo = void 0;
const util_1 = require("util");
const utf8Decoder = new util_1.TextDecoder();
async function readUserInfo(contract, userId) {
    const result = await contract.evaluateTransaction('readAsset', userId);
    const decodedToJsonResult = utf8Decoder.decode(result);
    console.log('**readAssetMethod** has been invoked successfully, result is:', decodedToJsonResult);
    return JSON.parse(decodedToJsonResult);
}
exports.readUserInfo = readUserInfo;
async function createUser(contract, userId) {
    const result = await contract.submitTransaction('createUser', userId);
    const decodedToJsonResult = utf8Decoder.decode(result);
    console.log(' **createUser** has been invoked successfully, result is:', utf8Decoder.decode(result));
    return JSON.parse(decodedToJsonResult);
}
exports.createUser = createUser;
async function addTrip(contract, userId, tripId, origin, destiny) {
    const result = await contract.submitTransaction('addTrip', userId, tripId, origin, destiny);
    const decodedToJsonResult = utf8Decoder.decode(result);
    console.log(' **addTrip** has been invoked successfully, result is:', utf8Decoder.decode(result));
    return JSON.parse(decodedToJsonResult);
}
exports.addTrip = addTrip;
async function addBagToTrip(contract, userId, tripId, bagId, bagInformation) {
    const result = await contract.submitTransaction('addBagToTrip', userId, tripId, bagId, bagInformation);
    const decodedToJsonResult = utf8Decoder.decode(result);
    console.log(' **addBagToTrip** has been invoked successfully, result is:', utf8Decoder.decode(result));
    return JSON.parse(decodedToJsonResult);
}
exports.addBagToTrip = addBagToTrip;
async function addSizeAndPrice(contract, userId, tripId, bagId, size, price) {
    const result = await contract.submitTransaction('addSizeAndPrice', userId, tripId, bagId, size, price);
    const decodedToJsonResult = utf8Decoder.decode(result);
    console.log(' **addSizeAndPrice** has been invoked successfully, result is:', utf8Decoder.decode(result));
    return JSON.parse(decodedToJsonResult);
}
exports.addSizeAndPrice = addSizeAndPrice;
async function addCheckpointToBag(contract, userId, tripId, bagId, stage, sensorData) {
    const result = await contract.submitTransaction('addCheckpointToBag', userId, tripId, bagId, stage, sensorData);
    const decodedToJsonResult = utf8Decoder.decode(result);
    console.log(' **addCheckpointToBag** has been invoked successfully, result is:', utf8Decoder.decode(result));
    return JSON.parse(decodedToJsonResult);
}
exports.addCheckpointToBag = addCheckpointToBag;
// Esta funcion hay que implementarla dentro del chaincode. Lo que hace
// es representar todo el historial de transacciones que se han realizado
// por el usuario, devolviendo todo el historial.
async function listOfAssetMethod(contract, ownedId) {
    const result = await contract.evaluateTransaction('listOfAsset', ownedId);
    const decodedToJsonResult = utf8Decoder.decode(result);
    console.log('**listOfAssetMethod** has been submitted, result is:', decodedToJsonResult);
    return JSON.parse(decodedToJsonResult);
}
exports.listOfAssetMethod = listOfAssetMethod;
//# sourceMappingURL=chaincode.js.map