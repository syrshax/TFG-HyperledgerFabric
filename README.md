# ALPHA 0.1 trazability-hyperledger-fabric-network

### Test arquitecture for building a trazability network
It consist in 2 orgs:

      OrdererOrg
      PeerOrg

Each org joins the same channel, called "channel1"



### Application and chaincode idea

The chaincode will have basic functions:

      InitLedger  ->    With the basic structure of the data          
      CreateAsset ->    When we deploy new items/lugagge identites into the ledger
      ReadAsset   ->    Reading the ID of the item/lugagge. Could read:

                                                                  + Owner
                                                                  + Destination
                                                                  + Weight
                                                                  + Time
                                                                  
      SendAsset   ->    To transfer information between peer nodes



The *App* will read from the ledger and write into the ledger with those functions.
Remaining processing data or information, it be handled by the *App* himself, the server
where will be hosted.

Then we will have:

                  |-------------------------------------------------------------------------------|
                  |                   Ledger0   <-   Peer0   <- ESP32_0 **collecting world data** | 
      *App*  <----|-->  Channel1 <->  Ledger1   <-   Peer1   <- ESP32_1 **collecting world data** |
                  |     (Orderer)     Ledger2   <-   Peer2   <- ESP32_2 **collecting world data** |
                  |-------------------------------------------------------------------------------|



## Instalation

For installing and testing the net, It will only work with 1 peer (unless you chose to init the 2nd and 3rd peer) for testing the chaincode and 
genesis config. It's still very early version.


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

- **smartcontrac-dev**: The chaincode

- **applicacion-nodejs**: Application and gateway for connecting and interacting with the smartcontract and the channel network.

## *SMARTCONTRACT-DEV*

By the time, as in **ALPHA 0.1**, It only contains 3 functions:

      InitLedger -->        Initialize the ledger with basic data, structured.
      readAsset -->         Ask the ledger to retrieve the asset by an ID, if exist, returns it in a parsed JSON. If not, throws an error.
      modifyAsset -->       Overrides the asset by an ID. If doesn't exist, throws an error.
      createAsset -->       Creates a new instance in the ledger by giving the parameters of the asset:
      
                                          ID:
                                          Color:
                                          Size:





## ESP32 QR web camera
For using the ESP32 camera on the model FREENOVE ESP32 WROVER, you need to compile the ```ESP32webCameraWorking.ino```
with the Arduino IDE, and add the dependencies from ```https://github.com/yoursunny/esp32cam/tree/main/``` this
program will create a WebServer where you can connect, and when using alongside the script ```camQRdecodeToText.py```
which It will decode all the QR images into text, It will create a file and will write down the QR decodings with timestamps.

For the process of verifying QR codes, I need to generate a certain type of code with a certain ID which will be only
valid for our propuose.

## Application for interacting with chaincode.
I made a simple WebApp to create new assets and read from the ledger. Calls simple API's to fetch directly from the peer0 (anchor peer and acting as main director of the PeerOrg). 

You can ask by ID and it will return the ID, Color, and Weight.

For creating an asset, you must SCAN with the ESP32 a QR with a valid form, then you need to introduce the color and the weight and it will be submited to the API then will call the createAssetMethod to invoke the createAsset function in the chaincode.

![webapp-nodejs-chaincode](https://github.com/syrshax/trazability-HLF/assets/92058771/87bd4d00-af2f-4842-8d0b-feec96ac2320)


