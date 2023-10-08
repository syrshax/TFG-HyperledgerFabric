let bagCount = 0;

function addBag() {
    bagCount++;
    const bagContainer = document.getElementById('bagContainer');
    const newBagInput = document.createElement('input');
    newBagInput.type = 'text';
    newBagInput.id = 'bag' + ('0' + bagCount).slice(-2); // ID en formato 'bag01', 'bag02', etc.
    newBagInput.placeholder = 'Descripción de la maleta ' + bagCount;
    bagContainer.appendChild(newBagInput);
}

function deleteBag() {
    if (bagCount > 0) {
        bagCount--;
        const bagContainer = document.getElementById('bagContainer');
        bagContainer.removeChild(bagContainer.lastChild);
    }
    else {
        alert('No hay maletas disponibles');
    }
}

async function addCompleteTrip() {
    // Recoger la información del usuario y del viaje
    const userId = document.getElementById('travelUserId').value;
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    
    // Recoger la información de las maletas
    const bags = [];
    for (let i = 1; i <= bagCount; i++) {
        const bagId = 'bag' + ('0' + i).slice(-2);
        const bagDescription = document.getElementById(bagId).value;
        bags.push({ bagId, description: bagDescription });
    }

    try {
        // Enviar la información al backend
        const response = await fetch('http://192.168.1.37:3000/addTrip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, origin, destination, bags })
        });


        // Verificar la respuesta del servidor
        if(response.ok) {
            const data = await response.json();
            generateQR(userId, data.newTripId, bags);
            
        } else {
            console.error('Error al añadir el viaje:', await response.text());
        }
    } catch (error) {
        console.error('Error al añadir el viaje:', error);
    }
}


async function createUser() {
    const userId = document.getElementById('userId').value;
    
    try {
      const response = await fetch('http://192.168.1.37:3000/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
  
      const data = await response.json();
      console.log(data);
      //usamos la propiedad de success que viene desde el backend que sera TRUE OR FALSE
      if (data.success) {
        alert('Usuario creado exitosamente: ' + userId);
      } else {
        alert('Error jeje: ' + data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }


  function displayUserData(data) {
    const rightContainer = document.querySelector('.right');
    
    // Limpiar el contenido existente
    rightContainer.innerHTML = `<h2>Buscar Usuario</h2>
    <div class="search-bar">
        <label for="searchId">ID del Usuario:</label>
        <input type="text" id="searchId">
        <button onclick="searchUser()">Buscar</button>
    </div>`;
    
    // Añadir una tarjeta para cada viaje
    data.trips.forEach(trip => {
        const card = document.createElement('div');
        card.className = 'card';

        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        cardHeader.textContent = `${trip.origin} ✈ ✈ ✈ ${trip.destination}`;
        card.appendChild(cardHeader);


        const bagList = document.createElement('ul');
        bagList.className = 'bag-list';
        card.appendChild(bagList);

        // Añadir una lista de maletas para el viaje actual
        trip.bags.forEach(bag => {
            const bagItem = document.createElement('li');
            bagItem.className = 'bag-item';

            const bagInfo = document.createElement('div');
            bagInfo.className = 'bag-info';
            if (bag.size == null || bag.price == null) {
               bag.size = 'No ha sido registrado'
               bag.price = 'No ha sido añadido'
            } else {
                bag.size = String(bag.size/1000) + ' KG'
                bag.price = String(bag.price) + '€'
            };
            
            bagInfo.innerHTML = `ID del viaje: ${trip.tripID.slice(-3)} <br><br> ID de la maleta: ${bag.bagID} <br><br> Peso: ${bag.size} <br><br>  Precio de facturacion: ${bag.price} <br><br>  Descripción: ${bag.bagInformation} <br><br> `;
            bagItem.appendChild(bagInfo);

            var date1 = new Date(bag.timestampStage1);
            var date2 = new Date(bag.timestampStage2);
            var date3 = new Date(bag.timestampStage3);
            
            if (date1.toLocaleTimeString('it-IT') == "Invalid Date") {
                date1 = "No ha sido registrado";
            }else { date1 = date1.toLocaleDateString('it-IT') + ' ' + date1.toLocaleTimeString('it-IT')};
            if (date2.toLocaleTimeString('it-IT') == "Invalid Date") {
                date2 = "No ha sido registrado";
            }else { date2 = date2.toLocaleDateString('it-IT') + ' ' + date2.toLocaleTimeString('it-IT')};
            if (date3.toLocaleTimeString('it-IT') == "Invalid Date") {
                date3 = "No ha sido registrado";
            }else { date3 = date3.toLocaleDateString('it-IT') + ' ' + date3.toLocaleTimeString('it-IT')};


            const checkpointInfo = document.createElement('div');
            checkpointInfo.className = 'checkpoint-info';
            checkpointInfo.innerHTML = `Registro aeropuerto origen -  ${bag.checkpoints.stage1} <br> Check realizado con fecha: ${date1} <br> <br> `
            checkpointInfo.innerHTML += `<br> Registro facturacion -  ${bag.checkpoints.stage2} <br> Check realizado con fecha: ${date2}<br><br> ` 
            checkpointInfo.innerHTML += `<br>  Registro aeropuerto destino - ${bag.checkpoints.stage3} <br> Check realizado con fecha: ${date3}`;
            if (bag.checkpoints.stage1 == 'True' && bag.checkpoints.stage2 == 'True' && bag.checkpoints.stage3 == 'True') {
                checkpointInfo.innerHTML += `<br><br>  Check completo <br><br> `;
            }
            bagItem.appendChild(checkpointInfo);

            bagList.appendChild(bagItem);
        });

        rightContainer.appendChild(card);
    });
}


// Ejemplo: Llamada ficticia a una función de búsqueda que devolvería los datos
async function searchUser() {
    const userId = document.getElementById('searchId').value;

    try{
        const response = await fetch('http://192.168.1.37:3000/searchUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });

        const data = await response.json();
        console.log(data);
        if (data){
        displayUserData(data);
        } else {
            alert('Error: ' + data.message);
        }

    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

function fetchPeso() {
    fetch('http://192.168.1.37:3000/obtenerPeso')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener el peso");
            }
            return response.json();
        })
        .then(data => {
            const peso = parseFloat(data.peso).toFixed(2);
            const weightDisplayElement = document.getElementById('weightDisplay');
            weightDisplayElement.textContent = `Peso actual: ${Math.abs(peso/1000)} kg`;
            weightDisplayElement.setAttribute('data-peso', peso); // Almacena el peso como un atributo del elemento
        })
        .catch(error => {
            console.error("Hubo un error obteniendo el peso:", error);
        });
}

setInterval(fetchPeso, 1000);  // Actualiza cada segundo


function generateQR(userIdvar, tripIdvar, bags) {
    const userId = userIdvar;
    const tripId = tripIdvar;
    const qrContainer = document.getElementById('qr-container');
    qrContainer.innerHTML = '';

    bags.forEach(bag => {
        const { bagId, description } = bag;
        const qrData = `ID: ${userId}\nTRIPID: ${tripId}\nBAGID: ${bagId}`;
        const encodedData = encodeURIComponent(qrData);
        const qrURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedData}&size=250x250`;

        const qrCodeElement = document.createElement('div');
        const qrImage = document.createElement('img');
        const qrDescription = document.createElement('p');

        qrCodeElement.className = 'qr-code'; // Añadir clase para estilos

        fetch(qrURL)
            .then(response => response.blob())
            .then(blob => {
                const imageUrl = URL.createObjectURL(blob);
                qrImage.src = imageUrl;

                // Mover la descripción encima de la imagen y añadir clase para estilos
                if (description) {
                    qrDescription.textContent = description;
                    qrDescription.className = 'qr-description';
                    qrCodeElement.appendChild(qrDescription);
                }

                qrCodeElement.appendChild(qrImage);
                qrContainer.appendChild(qrCodeElement);
            })
            .catch(error => {
                console.error("Error al generar el código QR: ", error);
            });
    });
}


async function sendWeight() {

    const userId = document.getElementById('weightIdUser').value;
    const tripId = document.getElementById('flightIdUser').value;
    const bagId = document.getElementById('bagIdUser').value;
    const peso = Math.abs(document.getElementById('weightDisplay').getAttribute('data-peso'));

    console.log("qUE VALE PESO", peso)
    try {
        const response = await fetch('/enviarPeso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, tripId, bagId, peso}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();
        alert('Mensaje del servidor: ' + data);

    } catch (error) {
        console.error('Error al enviar el peso:', error);
        alert('Error al enviar el peso: ' + error.message);
    }
}



