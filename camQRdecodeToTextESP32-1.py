import cv2
import time
import numpy as np
import pyzbar.pyzbar as pyzbar
import urllib.request
import requests
from datetime import datetime

font = cv2.FONT_HERSHEY_PLAIN
url = 'http://192.168.1.78/'

cv2.namedWindow("live transmission", cv2.WINDOW_AUTOSIZE)

prevQR = ""
actualQR = ""

max_retries = 5
retry_delay = 2  # seconds

while True:
    start_time = time.time()
    
    for _ in range(max_retries):
        try:
            img_resp = urllib.request.urlopen(url + 'cam-hi.jpg')
            imgnp = np.array(bytearray(img_resp.read()), dtype=np.uint8)
            frame = cv2.imdecode(imgnp, -1)
            break  
        except urllib.error.HTTPError as e:
            print(f"HTTP error: {e.code}, {str(e)}")
            if e.code == 503: 
                print("Retrying in", retry_delay, "seconds...")
                time.sleep(retry_delay)
            else:
                break  
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            break  
    else:  
        print("Failed to retrieve image after", max_retries, "attempts. Skipping iteration.")
        continue  

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

            response = requests.post('http://localhost:3000/esp32-camera', json={'IDENTIFICACION': actualQR.split('\n'), 'ESP32': "unit1"})
            print("POST Response:", response.text)

        cv2.putText(frame, str(actualQR), (50, 50), font, 2, (255, 0, 0), 3)
    
    # Adding FPS and current time overlay
    end_time = time.time()
    fps = 1 / (end_time - start_time)
    current_time_str = datetime.now().strftime("%H:%M:%S")
    cv2.putText(frame, f"FPS: {fps:.2f}", (10, 30), font, 2, (255, 0, 0), 3)
    cv2.putText(frame, f"Time: {current_time_str}", (10, 70), font, 2, (255, 0, 0), 3)

    time.sleep(0.015)
    
    cv2.imshow("live transmission", frame) 

    if cv2.waitKey(1) == 27:
        break

cv2.destroyAllWindows()
