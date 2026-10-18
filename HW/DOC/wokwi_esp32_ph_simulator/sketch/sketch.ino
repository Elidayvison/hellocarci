#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// SIMULADOR: o potenciômetro representa a entrada analógica.
// O valor de pH é ilustrativo, não é uma medição real.
#define PH_PIN 34
const int ADC_MAX = 4095;
const bool ENABLE_BACKEND = false;
const char* WIFI_SSID = "SUA_REDE_WIFI";
const char* WIFI_PASSWORD = "SUA_SENHA";
const char* API_URL = "http://192.168.1.100:8000/api/measurements";
const unsigned long SEND_INTERVAL_MS = 5000;
unsigned long lastSend = 0;

float adcToIllustrativePH(int raw) {
  // Mapeamento linear didático de 0..4095 para pH 0..14.
  // Não substitui calibração com soluções padrão.
  return (raw / (float)ADC_MAX) * 14.0f;
}

void connectWiFi() {
  if (!ENABLE_BACKEND) return;
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando ao Wi-Fi");
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
    delay(300); Serial.print(".");
  }
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) Serial.println("Wi-Fi conectado.");
  else Serial.println("Wi-Fi indisponível; leitura local continua.");
}

void postReading(float ph, int raw, float voltage) {
  if (!ENABLE_BACKEND || WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  StaticJsonDocument<256> doc;
  doc["tank_id"] = "TANQUE-01";
  doc["ph"] = roundf(ph * 100.0f) / 100.0f;
  doc["voltage"] = roundf(voltage * 1000.0f) / 1000.0f;
  doc["adc_raw"] = raw;
  doc["source"] = "simulacao";
  doc["quality"] = "simulada";
  String body; serializeJson(doc, body);
  int status = http.POST(body);
  Serial.printf("POST API: HTTP %d\n", status);
  if (status < 0) Serial.println("Falha de rede/API; confira URL, firewall e acesso.");
  http.end();
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetPinAttenuation(PH_PIN, ADC_11db);
  delay(300);
  Serial.println("\n=== Simulador de pH: ESP32 + potenciômetro ===");
  Serial.println("DADO SIMULADO: potenciômetro não mede pH real.");
  Serial.println("Para medir água, use sensor e eletrodo devidamente calibrados.");
  connectWiFi();
}

void loop() {
  int raw = analogRead(PH_PIN);
  float voltage = raw * 3.3f / ADC_MAX;
  float ph = adcToIllustrativePH(raw);
  Serial.printf("[SIMULADO] ADC=%4d | tensão estimada=%.3f V | pH ilustrativo=%.2f\n", raw, voltage, ph);
  if (ENABLE_BACKEND && millis() - lastSend >= SEND_INTERVAL_MS) {
    lastSend = millis();
    postReading(ph, raw, voltage);
  }
  delay(1000);
}
