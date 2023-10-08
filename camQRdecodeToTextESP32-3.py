import cv2
import time
import numpy as np
import pyzbar.pyzbar as pyzbar
import urllib.request
import requests
from datetime import datetime

font = cv2.FONT_HERSHEY_PLAIN
url = 'http://192.168.1.80/'

cv2.namedWindow("live transmission", cv2.WINDOW_AUTOSIZE)

prevQR = ""
actualQR = ""

# Incrementa el tiempo de sleep para reducir la frecuencia de las solicitudes
sleep_time =  1/24

while True:
    try:
        start_time = time.time()
        
        img_resp = urllib.request.urlopen(url + 'cam-hi.jpg')
        imgnp = np.array(bytearray(img_resp.read()), dtype=np.uint8)
        frame = cv2.imdecode(imgnp, -1)
        
        # Si es posible, define una ROI (región de interés) aquí para optimizar la decodificación de QR.
        
        decodedObjects = pyzbar.decode(frame)
        for obj in decodedObjects:
            actualQR = obj.data.decode('utf-8')
            if prevQR != actualQR:
                print("Type:", obj.type)
                print("Data: ", actualQR)
                prevQR = actualQR

                current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                with open("QR_data_logs.txt", "a") as f:
                    f.write(f"{current_datetime} - {actualQR}\n")

                response = requests.post('http://localhost:3000/esp32-camera', json={'IDENTIFICACION': actualQR.split('\n'), 'ESP32': "unit3"})
                print("POST Response:", response.text)

            cv2.putText(frame, str(actualQR), (50, 50), font, 2, (255, 0, 0), 3)
        
        end_time = time.time()
        fps = 1 / (end_time - start_time)
        cv2.putText(frame, f"FPS: {fps:.2f}", (10, 30), font, 2, (255, 0, 0), 3)
        
        current_time = time.strftime("%H:%M:%S")
        cv2.putText(frame, f"Time: {current_time}", (10, 70), font, 2, (255, 0, 0), 3)


        time.sleep(sleep_time)
        
        cv2.imshow("live transmission", frame) 

        if cv2.waitKey(1) == 27:
            break

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        time.sleep(sleep_time)

cv2.destroyAllWindows()
