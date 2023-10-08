import { Contract } from '@hyperledger/fabric-gateway';
export declare function readUserInfo(contract: Contract, userId: string): Promise<any>;
export declare function createUser(contract: Contract, userId: string): Promise<any>;
export declare function addTrip(contract: Contract, userId: string, tripId: string, origin: string, destiny: string): Promise<any>;
export declare function addBagToTrip(contract: Contract, userId: string, tripId: string, bagId: string, bagInformation: string): Promise<any>;
export declare function addSizeAndPrice(contract: Contract, userId: string, tripId: string, bagId: string, size: string, price: string): Promise<any>;
export declare function addCheckpointToBag(contract: Contract, userId: string, tripId: string, bagId: string, stage: string, sensorData: string): Promise<any>;
export declare function listOfAssetMethod(contract: Contract, ownedId: string): Promise<any>;
