#!/bin/bash
clear
echo -e "\e[1mWelcome to the auto-up network for TFG-Hyperledger-Fabric!\e[0m"
echo "This script automates the process of removing, creating, and setting up everything for testing."
echo "It will create the genesis block, join orderers and peers, and install the previously packaged chaincode."
echo "Please open at least 2 more terminal windows - one for peer0 and one for the orderer."

echo -e "\nFor starting the \e[1mpeer0:\e[0m    ./peer node start"
echo -e "For starting the \e[1morderer:\e[0m  ./orderer start"

echo -e "\n\e[1mNote:\e[0m You need the peer and orderer to be started in separate terminals before proceeding."

read -n 1 -s -p $'\nPress any key when ready \n \n \n'


echo "#############"
echo -e '############# \n \n'
read -p "Do you want to run the remove.py script? It will remove genesis block, orderer and peer chaincode and data. (yes/no): " choice

echo "Current Directory: $(pwd)"

if [[ "$choice" == "yes" ]]; then
    echo "Running remove.py script..."
    python3 remove.py 2>&1 | tee python_output.txt
    
else
    echo "Skipping remove.py script..."
fi

echo -e "Creating network..."

export CORE_PEER_MSPCONFIGPATH=../cryptogen/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

cd genesis
./configtxgen -profile ChannelDeveloper -outputBlock genesis_block.pb -channelID channel1
cd .. && cd orderer

./osnadmin channel join --channelID channel1  --config-block ../genesis/genesis_block.pb -o 127.0.0.1:6003

cd .. && cd peer0
./peer channel join -b ../genesis/genesis_block.pb --tls --cafile ../cryptogen/crypto-config/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem --certfile ../cryptogen/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt --keyfile ../cryptogen/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key


echo -e "\e[1mOrderer and peer have joined the network.\e[0m"

read -p "Do you want to install the chaincode (yes/no): " choice
if [[ "$choice" == "yes" ]]; then
    echo "Installing chaincode..."
    ./peer lifecycle chaincode install basic.tar.gz

    
fi