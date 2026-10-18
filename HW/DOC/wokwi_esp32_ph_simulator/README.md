# Wokwi — Simulador de pH com ESP32 DevKit V1

O potenciômetro simula a entrada analógica do PH-4502C. O pH mostrado é **ilustrativo** e não é uma medição real.

## Arquivos
- `diagram.json`: circuito ESP32 + potenciômetro.
- `sketch.ino`: firmware Arduino.
- `libraries.txt`: dependência ArduinoJson.

## Ligações
- Potenciômetro `VCC` (terminal lateral 1) → ESP32 `3V3`.
- Potenciômetro `SIG` (terminal central/cursor) → ESP32 `GPIO34`.
- Potenciômetro `GND` (terminal lateral 2) → ESP32 `GND`.
- Nunca conecte 5 V ao GPIO34.

## Executar no Wokwi
1. Abra https://wokwi.com/projects/new/esp32.
2. Substitua o conteúdo do diagrama pelo `diagram.json` deste pacote.
3. Substitua o firmware pelo `sketch.ino`.
4. Adicione `ArduinoJson` no Library Manager se necessário.
5. Inicie a simulação e abra o Serial Monitor em 115200 baud.
6. Gire o potenciômetro virtual para variar o ADC e o pH ilustrativo.

## Integração com o backend FastAPI
O firmware pode enviar `tank_id`, `ph`, `voltage`, `adc_raw`, `source=simulacao` e `quality=simulada` ao endpoint `/api/measurements`.

Para ativar, mude `ENABLE_BACKEND` para `true`, configure Wi-Fi e `API_URL`.
**Limitação:** Wokwi roda na nuvem e normalmente não alcança diretamente um IP privado como `192.168.x.x` do computador local. Use um endpoint acessível de forma segura ou teste o firmware em um ESP32 físico na mesma rede. Não exponha o backend sem autenticação à internet.

## Escala ilustrativa
O código mapeia ADC 0–4095 linearmente para pH 0–14 apenas para testar a leitura, o Serial Monitor e o fluxo de dados. Um eletrodo real exige calibração com soluções padrão e parâmetros medidos.
