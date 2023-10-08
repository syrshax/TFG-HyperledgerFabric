import requests
import time
from collections import deque

# Usar una sesión para las solicitudes
session = requests.Session()

def enviar_datos_al_backend(peso):
    url_backend = "http://localhost:3000/esp32-2"
    datos = {
        'peso': peso
    }
    try:
        response = session.post(url_backend, json=datos)
        response.raise_for_status()  # Asegurarse de que la solicitud fue exitosa
        return response.json()  
    except requests.exceptions.RequestException as e:
        print(f"Error al enviar los datos: {e}")

def obtener_peso():
    url = "http://192.168.1.79/"
    response = session.get(url)
    print(response.text)
    return float(response.text)

def es_peso_estable(lecturas):
    media = sum(lecturas) / len(lecturas)
    return all(abs(lectura - media) <= 100 for lectura in lecturas)

def monitorear_peso(valor_maximo):
    lecturas = deque(maxlen=10)  # Usar deque para mantener automáticamente 10 elementos

    while True:
        peso_actual = obtener_peso()
        lecturas.append(peso_actual)
        
        if len(lecturas) == 10 and es_peso_estable(lecturas):
            return min(sum(lecturas) / len(lecturas), valor_maximo)
        
        time.sleep(0.)

valor_maximo = 20000.0

while True:
    peso_real = monitorear_peso(valor_maximo)
    respuesta = enviar_datos_al_backend(peso_real)
    if respuesta:
        print(f"El peso verdadero es: {peso_real:.2f} g")
        print(respuesta)
