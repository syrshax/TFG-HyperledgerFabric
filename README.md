# TFG - Red de prueba Blockchain para trazabilidad basada en IoT

### Arquitecture for building a trazability network
It consist in 2 orgs:

      OrdererOrg
      PeerOrg

Each org joins the same channel, called "channel1".


The `OrdererOrg` consist in 1 orderer that mantains the flow of the blockchain. He is responsible for managing and ordering all blocks.

The `PeerOrg` consists in 3 `peers`. Each one has a local db state and writes information into the blockchain.



This is the arqutecture proposed


                  |-------------------------------------------------------------------------------|
                  |                   Ledger0   <-   Peer0   <- ESP32_0 **collecting world data** | 
      *App*  <----|-->  Channel1 <->  Ledger1   <-   Peer1   <- ESP32_1 **collecting world data** |
                  |     (Orderer)     Ledger2   <-   Peer2   <- ESP32_2 **collecting world data** |
                  |-------------------------------------------------------------------------------|



## Instalation

For installing and testing the net, you need to create the crypto material, setting up the core.yaml and orderer.yaml, creating a genesis block config and then join all memebers into the blockchain.

I've made a script that automate the creation and joining process. You must redo the local configuration of your peers and orderer refering to your own network configuration.

**Not automated yet! As version 1.0 Must be done manually. run_network.sh not working properly.**

            cd
            git clone
            git checkout version1 //{select the updated branch}
            chmod +x run_network.sh
            ./run_network.sh



## Folder content
The principal files are described here:

- **orderer**: orderer binary, orderer.yaml (the config file of the orderer), osnadmin (for interacting with the orderer), MSP folders.

- **peer0** : peer binary, core.yaml (the config file of the peer), MSP folders

- **cryptogen**: All the crypto material for users and Org1, OrdererOrg. 

- **smartcontrac-dev**: The chaincode written in Javascript

- **applicacion-nodejs**: Application and gateway for connecting and interacting with the smartcontract and the channel network. Writtern in Typescript.

## *SMARTCONTRACT-DEV*

The `smartcontract` is the logic of the network. It will execute functions that are requiered for this project. Each of them manage the world state db, extracting information and adding it. These functions are linked to the `client user App`, a fronted for user to interact more visually with the blockchain.

These are the functions.

      createUser              --> Registers users
      addTrip                 --> Add information about the trip.
      addBagToTrip            --> Creates information about the lugagge the user wants to travel with
      addSizeAndPrice         --> Adds the price and Size to the db
      addCheckpointToBag      --> Gets information from the ESP32 sensors and updates the DB. Also writes a timestamp when the data is written.
      readAsset               --> Given an user ID, returns all data belongin to him. All flight history in this case.
      deleteFlight            --> For develop purpouses. It doesnt have a frontend. Must be run in CLI. Detele a flight given user, flightId.



## ESP32 QR web camera
For using the ESP32 camera on the model FREENOVE ESP32 WROVER, you need to compile the ```ESP32webCameraWorking.ino```
with the Arduino IDE, and add the dependencies from ```https://github.com/yoursunny/esp32cam/tree/main/``` this
program will create a WebServer where you can connect, and when using alongside the script ```camQRdecodeToText.py```
which It will decode all the QR images into text, It will create a file and will write down the QR decodings with timestamps.

For the process of verifying QR codes, I need to generate a certain type of code with a certain ID which will be only
valid for our propuose.

## ESP32 scale/weight meter
Using a HX711 sensor for measuring weight. The sensors are like a Weasthone bridge. It gives mV to to the ESP32, then with a calibration, we recieve these mV converted to grams.

The ESP32 has an inside web server, that sends the weight to an HTTP endpoint. Then we recollect that data with a Python script and then we send it to our backend server (our Application) for processing it.

Thanks to an Python script `webWeight.py` we get the weight, requesting the ESP32 to send the weight, and then we post the information into a local API.

## Application for interacting with chaincode.
The frontend application constist in a web interface for the user and the admin to see the data and write with the smartcontract functions into the ledger.

There, we can register, add our trip destinations, add the amount of bags we wish to travel with. Then it will gives us a simple QR for tracking your lugagge. 

We alse have a search function for retrieving all the user's history flight.


![webapp-nodejs-chaincode](https://github.com/syrshax/trazability-HLF/assets/92058771/87bd4d00-af2f-4842-8d0b-feec96ac2320)


