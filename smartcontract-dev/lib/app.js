//chaincodetest,,,

'use strict';

const { Contract } = require('fabric-contract-api'); //we import fabric api for managing contracts
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');

class simplecontract extends Contract { //we create new class and extend with the fabric api
    async InitLedger(ctx) { //Init de la db, ctx is the "context" of the contract, give us methods and properties
        
        const initAssets =[ 
            {
                ID: 'alberto',
                trips: [
                    {
                        tripID: 'viaje001',
                        origin: 'Madrid',
                        destination: 'Sevilla',
                        bags: [
                            {
                                bagID: '0001',
                                size: '20kg',
                                price: '24,5 euros',
                                checkpoints:{ stage0: "True", stage1: "True", stage2: "True"}
                            }
                        ]
                    }
                ]
                
            
            }
        
        ]
    
        

        for (const asset of initAssets) {
            //stringfy to convert to json
            //deterministic and alphabetical order
            await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
            //indicamos que el id es unico y guardmos true para indexarlo
            console.info('Asset ${asset.ID} logically created and stored');
        }

        return JSON.stringify(initAssets);
    }



    async createUser (ctx, userId){
      const userData = await ctx.stub.getState(userId);
      if (userData && userData.length > 0) {
        throw new Error(`The user ${userId} already exists`);
      }
      const newUser = {
        ID: userId,
        trips: []
      };
      await ctx.stub.putState(userId, Buffer.from(JSON.stringify(newUser)));
      return JSON.stringify(newUser);
    }

    async addTrip (ctx, userId, tripId, origin, destiny){
        const userDataBuffer = await ctx.stub.getState(userId);
    if (!userDataBuffer || userDataBuffer.length === 0) {
        throw new Error(`The user ${userId} does not exist`);
    }
    const userData = JSON.parse(userDataBuffer.toString());
    const newTrip = {
        tripID: tripId,
        origin: origin,
        destination: destiny,
        bags: []
    };
    userData.trips.push(newTrip);
    await ctx.stub.putState(userId, Buffer.from(JSON.stringify(userData)));
    return JSON.stringify(newTrip);
    }
    
    async addBagToTrip(ctx, userId, tripId, bagId, bagInformation) {
        const userDataBuffer = await ctx.stub.getState(userId);
        if (!userDataBuffer || userDataBuffer.length === 0) {
            throw new Error(`The user ${userId} does not exist`);
        }
    
        const userData = JSON.parse(userDataBuffer.toString());
        const trip = userData.trips.find(t => t.tripID === tripId);
        if (!trip) {
            throw new Error(`The trip ${tripId} does not exist for user ${userId}`);
        }
    
        const newBag = {
            bagID: bagId,
            bagInformation: bagInformation,
            size: null,
            price: null,
            checkpoints: {stage1:"false" , stage2:"false", stage3:"false"}
        };
    
        trip.bags.push(newBag);
        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(userData)));
        return JSON.stringify(newBag);
    }
    
    async addSizeAndPrice (ctx, userId, tripId, bagId, size, price){
        const userDataBuffer = await ctx.stub.getState(userId);
        if (!userDataBuffer || userDataBuffer.length === 0) {
            throw new Error(`The user ${userId} does not exist`);
        }
    
        const userData = JSON.parse(userDataBuffer.toString());
        const trip = userData.trips.find(t => t.tripID === tripId);
        if (!trip) {
            throw new Error(`The trip ${tripId} does not exist for user ${userId}`);
        }
        const bag = trip.bags.find(b => b.bagID === bagId);
        if (!bag) {
        throw new Error(`The bag ${bagId} does not exist in trip ${tripId} for user ${userId}`);
        }

        bag.size = size;
        bag.price = price;

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(userData)));
        return JSON.stringify(bag);
    }

    async addCheckpointToBag(ctx, userId, tripId, bagId,stage,sensorData){
        const userDataBuffer = await ctx.stub.getState(userId);
        if (!userDataBuffer || userDataBuffer.length === 0) {
            throw new Error(`The user ${userId} does not exist`);
        }

        const userData = JSON.parse(userDataBuffer.toString());
        const trip = userData.trips.find(t => t.tripID === tripId);
        if (!trip) {
        throw new Error(`The trip ${tripId} does not exist for user ${userId}`);
        }
        const bag = trip.bags.find(b => b.bagID === bagId);
        if (!bag) {
        throw new Error(`The bag ${bagId} does not exist in trip ${tripId} for user ${userId}`);
        }
        
        bag.checkpoints[stage] = sensorData
        bag[`timestamp${stage.charAt(0).toUpperCase() + stage.slice(1)}`] = new Date().getTime();
        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(userData)));
        return JSON.stringify(bag);

    }


    async readAsset (ctx, id){
        const assetJSON = await ctx.stub.getState(id); //get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist, CAN'T READ it`);
        }
        return assetJSON.toString();
    }

    async deleteFlight (ctx, userId, tripId){
        const userDataBuffer = await ctx.stub.getState(userId);
        if (!userDataBuffer || userDataBuffer.length === 0) {
            throw new Error(`The user ${userId} does not exist`);
        }
        const userData = JSON.parse(userDataBuffer.toString());
        const tripIndex = userData.trips.findIndex(t => t.tripID === tripId);
        console.log(tripIndex);
        if (tripIndex == -1) {
            throw new Error(`The trip ${tripId} does not exist for user ${userId}`);
        }

        userData.trips.splice(tripIndex, 1);
        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(userData)));
        return `Trip with ID ${tripId} has been deleted for user ${userId}`; 

  
    }

   /* 
   Nose si implementar una funcion de deleteo de Viajes... esta por ver el uso que 
   puede tener.
    
   

    }
    */
}
module.exports = simplecontract;
