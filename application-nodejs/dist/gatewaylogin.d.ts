import { Network, Contract } from '@hyperledger/fabric-gateway';
interface LoginCredentials {
    network: Network;
    contract: Contract;
}
export declare function login(): Promise<LoginCredentials>;
export {};
