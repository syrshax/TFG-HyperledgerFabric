"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gatewaylogin_1 = require("./gatewaylogin");
const chaincode_1 = require("./chaincode");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express_1.default.static('public'));
let ultimoPeso = null;
async function main() {
    //login returns the login credentials interface, {network,contract}
    const { network, contract } = await (0, gatewaylogin_1.login)();
    console.log('Starting server...');
    app.post('/esp32-2', async (req, res) => {
        const peso = req.body.peso;
        console.log(`Peso recibido: ${peso}`);
        ultimoPeso = peso; // Guardas el peso en la variable
        res.json({ message: 'Peso recibido exitosamente!' });
    });
    app.get('/obtenerPeso', (req, res) => {
        if (ultimoPeso !== null) {
            res.json({ peso: ultimoPeso });
        }
        else {
            res.status(404).json({ message: 'Peso no disponible' });
        }
    });
    app.post('/enviarPeso', async (req, res) => {
        const peso = req.body.peso;
        const userId = req.body.userId;
        const bagId = req.body.bagId;
        const tripId = req.body.tripId;
        console.log(`Enviar Peso: ${peso}`);
        console.log(`userId: ${userId}`);
        console.log(`bagId: ${bagId}`);
        console.log(`tripId: ${tripId}`);
        const price = peso * 0.0025; //0.0025 es el coste en euros por gramo
        const userinformation = await (0, chaincode_1.readUserInfo)(contract, userId);
        try {
            await (0, chaincode_1.addSizeAndPrice)(contract, userId, tripId, bagId, String(peso), String(price));
            await (0, chaincode_1.addCheckpointToBag)(contract, userId, tripId, bagId, "stage2", "True");
            return res.status(200).send('Peso enviado exitosamente');
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Error al enviar el peso');
        }
    });
    /*
    FUNCION DONDE PARTICIPA EL ESP32 NUMERO 1, LEE EL ID DEL USUARIO, EL BAGID Y EL TRIPID PARA IDENTIFICAR MALETAS!!
    */
    app.post('/esp32-camera', async (req, res) => {
        const identificacion = req.body.IDENTIFICACION;
        const esp32unit = req.body.ESP32;
        //Suponemos que siempre viene de la misma forma ID:xxx,TRIPID:xxx,BAGID:xxx
        let userID = "";
        let tripID = "";
        let bagID = "";
        if (!Array.isArray(identificacion) || identificacion.length !== 3) {
            console.log('Formato de código QR inválido');
            return res.status(400).send('Formato de código QR inválido');
        }
        identificacion.forEach((item) => {
            const parts = item.split(':'); // divide el string en dos partes: clave y valor
            const key = parts[0].trim();
            const value = parts[1].trim();
            switch (key) {
                case 'ID':
                    userID = value;
                    break;
                case 'TRIPID':
                    tripID = value;
                    break;
                case 'BAGID':
                    bagID = value;
                    break;
            }
        });
        console.log('UserID:', userID);
        console.log('TripID:', tripID);
        console.log('BagID:', bagID);
        // Pasamos el stage1 check que seria que la maleta a pasado
        // el primer check donde se valida, el usuario, trip y id de la maleta.
        try {
            if (esp32unit === 'unit1') {
                await (0, chaincode_1.addCheckpointToBag)(contract, userID, tripID, bagID, 'stage1', 'True');
            }
            if (esp32unit == 'unit3') {
                await (0, chaincode_1.addCheckpointToBag)(contract, userID, tripID, bagID, 'stage3', 'True');
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).send('Error en el check, viaje, maleta o usuario no validos. Vuelva a crear el QR code!');
        }
        res.status(200).send('Datos recibidos');
    });
    /*
    
    Crea un usuario. En res.status.json Envia un objeto json con 2 propiedades: success y userId
    
    Success es un bool para decir si el usuario fue creado o no y luego el menssaje que se envia al front o al log.
    
    */
    app.post('/createUser', async (req, res) => {
        const userId = req.body.userId;
        try {
            await (0, chaincode_1.createUser)(contract, userId);
            res.status(200).json({ success: true, userId });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'El usuario ya existe. Por favor, pongase en contacto con el administrador en caso de perder su identidad.' });
        }
    });
    app.post('/searchUser', async (req, res) => {
        const userId = req.body.userId;
        try {
            const userinfo = await (0, chaincode_1.readUserInfo)(contract, userId);
            res.status(200).json(userinfo);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'El usuario no existe' });
        }
    });
    /*
    app.post('/addTrip', async (req, res) => {
      const userId = req.body.userId;
      const origin = req.body.origin;
      const destiny = req.body.destination;
    
      console.log('userId:', userId);
      console.log('origin:', origin);
      console.log('destiny:', destiny);
    
      try{
        const tempdata = await readUserInfo(contract, userId);
        const trips = tempdata.trips.length;
        const newTripId = 'trip' + (trips + 1).toString().padStart(3, '0');
    
        await addTrip(contract, userId, newTripId, origin, destiny);
      }
      catch (error){
        console.error(error);
        res.status(500).json({ success: false, message: 'El usuario no existe' });
      }
    
    });
    */
    function generateTripId(index) {
        return 'trip' + index.toString().padStart(3, '0');
    }
    app.post('/addTrip', async (req, res) => {
        const { userId, origin, destination, bags } = req.body;
        console.log('userId:', userId);
        console.log('origin:', origin);
        console.log('destination:', destination);
        console.log('bags:', bags);
        try {
            const tempdata = await (0, chaincode_1.readUserInfo)(contract, userId);
            let index = tempdata.trips.length + 1;
            let newTripId = generateTripId(index);
            // Mientras el tripId generado ya exista, sigue intentando
            while (tempdata.trips.find((t) => t.tripID === newTripId)) {
                index++;
                newTripId = generateTripId(index);
            }
            await (0, chaincode_1.addTrip)(contract, userId, newTripId, origin, destination);
            for (let i = 0; i < bags.length; i++) {
                await (0, chaincode_1.addBagToTrip)(contract, userId, newTripId, bags[i].bagId, bags[i].description);
            }
            res.status(200).json({
                success: true,
                message: 'Viaje añadido exitosamente',
                newTripId // Incluir el newTripId en la respuesta
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error al añadir el viaje' });
        }
    });
    app.listen(3000, '0.0.0.0', () => {
        console.log('Listening on port 3000, on http://localhost:3000');
    });
}
main().catch((error) => {
    console.error(`Error encountered: ${error}`);
    process.exit(1);
});
//# sourceMappingURL=main.js.map