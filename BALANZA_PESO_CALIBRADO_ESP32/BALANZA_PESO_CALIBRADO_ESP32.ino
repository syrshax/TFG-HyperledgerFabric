#include <HX711_ADC.h>

const int HX711_dout = 4;
const int HX711_sck = 5;
HX711_ADC LoadCell(HX711_dout, HX711_sck);

void setup() {
  Serial.begin(115200);
  LoadCell.begin();
  LoadCell.start(2000);
  LoadCell.setCalFactor(66.875);  // Establecer el factor de conversión
}

void loop() {
  LoadCell.update();
  float peso = LoadCell.getData();
  Serial.print("Peso: ");
  Serial.print(peso, 2);
  Serial.println(" g");
  delay(10);
}
