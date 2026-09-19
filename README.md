# Modelo de Arquitetura IoT para Apoio à Tomada de Decisões na Carcinicultura

## Resumo Executivo

Sistema inteligente de monitoramento e controle automático de parâmetros de qualidade de água em viveiros de carcinicultura (criação de camarões). Utiliza sensores de pH e um motor dosador automatizado para manter as condições ideais de criação, com envio de dados em tempo real para análise e suporte à decisão dos aquicultores.

---

## Descrição do Projeto

Este projeto implementa um **Controle de Modelo de Arquitetura IoT** dedicado ao monitoramento contínuo e à automação de processos críticos na carcinicultura. O sistema coleta dados de qualidade de água, processa informações em tempo real e executa ações automáticas de correção, permitindo que o produtor tome decisões mais informadas sobre o manejo do viveiro.

### Objetivo Geral

Analisar e validar um modelo de arquitetura IoT que automatize o controle de pH em viveiros de camarão, reduzindo a necessidade de intervenção manual e melhorando a consistência das condições de criação através de dosagem automática de corretivos químicos.

### Objetivos Específicos

- Monitorar continuamente os níveis de pH da água do viveiro
- Automatizar a dosagem de corretivos químicos para manutenção do pH ideal
- Capturar e armazenar dados históricos para análise e relatórios
- Fornecer interface visual (dashboard) com informações em tempo real
- Validar a eficácia do sistema através de coleta de dados acadêmica

---

## Componentes do Sistema

### Hardware Principal

| Componente | Função | Especificação |
|-----------|--------|---------------|
| **ESP32** | Microcontrolador central | Processamento de dados, lógica de controle |
| **Sensor de pH** | Medição de acidez/alcalinidade | Faixa típica: 0-14 pH |
| **Motor Dosador** | Atuação automática | Bomba/atuador para injetar corretivos |

### Software e Conectividade

- Firmware do ESP32 (C/C++ com Arduino IDE)
- Comunicação WiFi/Bluetooth para transmissão de dados
- Database para armazenamento de histórico
- Dashboard web/mobile para visualização

---

## Processo de Dosagem Automática de pH

### O que é Dosagem Automática de pH?

A **dosagem automática de pH** (também chamada de titulação automática) é um processo onde um sistema controlado por microcontrolador injeta automaticamente substâncias químicas na água para corrigir o pH, mantendo-o dentro da faixa ideal sem necessidade de intervenção manual constante.

### Faixa Ideal para Carcinicultura

- **pH ideal para camarões**: 7,5 a 8,5
- **Faixa de tolerância**: 6,5 a 9,0 (antes de prejuízos significativos)

### Mecanismo de Funcionamento

#### 1. **Leitura do Sensor de pH**
```
Sensor de pH → ESP32 → Conversão Analógica/Digital → Valor de pH
```

O sensor de pH mede continuamente a concentração de íons H⁺ na água. O ESP32 lê essa informação através de um pino ADC (Analog-to-Digital Converter) e a converte em valores numéricos.

#### 2. **Processamento da Lógica de Controle**

O firmware do ESP32 compara o pH lido com os valores de referência:

```
SE pH < 7.5 (ácido demais):
    → ATIVAR motor dosador de BASE (ex: hidróxido de sódio)
    → Injetar volume calculado
    
SE pH > 8.5 (alcalino demais):
    → ATIVAR motor dosador de ÁCIDO (ex: ácido clorídrico diluído)
    → Injetar volume calculado

SE 7.5 ≤ pH ≤ 8.5:
    → Sistema em repouso
    → Continuar monitorando
```

#### 3. **Atuação do Motor Dosador**

O motor dosador é controlado pelo ESP32 através de um relé ou transistor:

- **Pino GPIO do ESP32** → **Relé/Driver** → **Motor/Bomba Dosadora**
- Duração da atuação é calculada conforme o desvio de pH detectado
- Sistema de segurança previne sobre-dosagem

#### 4. **Feedback e Ajuste**

Após injeção, o sistema aguarda tempo de estabilização (geralmente 1-2 minutos) e faz nova leitura para validar se o pH atingiu a faixa ideal.

### Diagrama do Processo

```
┌─────────────────┐
│  Sensor de pH   │
│   (leitura)     │
└────────┬────────┘
         │
         ▼
    ┌─────────────┐
    │   ESP32     │
    │  (processa) │
    └────────┬────┘
             │
      ┌──────┴──────┐
      │             │
   pH < 7.5    pH > 8.5
      │             │
      ▼             ▼
┌──────────┐  ┌──────────┐
│ Injeta   │  │ Injeta   │
│ BASE     │  │ ÁCIDO    │
└──────┬───┘  └────┬─────┘
       │           │
       └─────┬─────┘
             ▼
    ┌──────────────────┐
    │ Aguarda          │
    │ Estabilização    │
    └────────┬─────────┘
             │
             ▼
      ┌────────────┐
      │ Nova       │
      │ Leitura    │
      └────┬───────┘
           │
      [Retorna ao início]
```

---

## Arquitetura do Sistema

### Camadas da Arquitetura

```
┌─────────────────────────────────────────────┐
│         Interface de Usuário                │
│     (Dashboard Web/Mobile/App)              │
│                                             │
│  - Visualização em tempo real               │
│  - Históricos e gráficos                    │
│  - Configuração de parâmetros               │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│      Camada de Aplicação                    │
│  (API, Processamento de dados)              │
│                                             │
│  - Validação de dados                       │
│  - Alertas e notificações                   │
│  - Relatórios                               │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│     Camada de Comunicação                   │
│   (WiFi/MQTT/HTTP)                          │
│                                             │
│  - Protocolo de transmissão                 │
│  - Sincronização de dados                   │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│   Camada de Controle e Sensoriamento        │
│        (ESP32 + Arduino)                    │
│                                             │
│  - Leitura de sensores                      │
│  - Processamento local                      │
│  - Acionamento de atuadores                 │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│      Camada de Hardware                     │
│   (Sensores, Motores, Relés)                │
│                                             │
│  - Sensor de pH                             │
│  - Motor dosador                            │
│  - Fonte de alimentação                     │
└─────────────────────────────────────────────┘
```

### Fluxo de Dados

```
ENTRADA:
Sensor → ADC (ESP32) → Processamento → Lógica de Decisão

SAÍDA:
Decisão → GPIO (ESP32) → Relé/Driver → Motor → Ação Física

ARMAZENAMENTO:
Dados → Buffer (ESP32) → WiFi → Servidor → Database

VISUALIZAÇÃO:
Database → API → Dashboard → Usuário
```

---

## Funcionais Principais

### 1. **Monitoramento Contínuo de pH**

- Leitura do sensor de pH em intervalos configuráveis (recomendado: a cada 30 segundos a 5 minutos)
- Conversão de sinal analógico para valor digital (calibração necessária)
- Armazenamento de histórico para análise posterior

### 2. **Dosagem Automática de pH**

- Detecção automática de desvios de pH
- Cálculo inteligente do volume de corretivo necessário
- Injeção controlada através do motor dosador
- Sistema de proteção contra sobre-dosagem

### 3. **Coleta e Transmissão de Dados**

- Captura de valores de pH e timestamps
- Registro de eventos de dosagem (data, hora, volume)
- Envio de dados via WiFi para servidor central
- Sincronização periódica mesmo em caso de perda de conexão

### 4. **Interface de Visualização**

- Dashboard em tempo real mostrando pH atual
- Gráficos históricos de variação de pH
- Alertas visuais para situações anormais
- Logs de eventos e ações do sistema

### 5. **Suporte à Decisão**

- Relatórios de desempenho do viveiro
- Análise de tendências de pH
- Recomendações de ajustes de manejo
- Exportação de dados para análise externa

---

## Conexões e Pinagem (ESP32)

### Conexão do Sensor de pH
```
Sensor de pH:
  - Saída Analógica (A/D) → GPIO 34 (ADC1) do ESP32
  - GND → GND do ESP32
  - VCC → 5V ou 3.3V (verificar datasheet do sensor)
```

### Conexão do Motor Dosador
```
Motor/Bomba Dosadora:
  - Saída do Relé/Driver → GPIO 32 do ESP32
  - Motor + → Relé NO (normalmente aberto)
  - Motor - → GND
  - Fonte de alimentação do motor (5-12V conforme especificação)
```

### Comunicação de Dados
```
WiFi/Bluetooth:
  - Integrado no ESP32
  - Configurável via firmware
  - Conexão ao roteador local ou servidor de nuvem
```

---

## Algoritmo de Controle (Pseudocódigo)

```c
// Função principal de controle
void loop() {
    
    // 1. LER SENSOR
    int sensorValue = analogRead(pH_SENSOR_PIN);
    float pH = converterParaEscalaPH(sensorValue);
    
    // 2. REGISTRAR DADO
    registrarDado(pH, timeStamp);
    
    // 3. AVALIAR CONDIÇÃO
    if (pH < pH_MINIMO) {
        // pH muito ácido
        float desvio = pH_MINIMO - pH;
        int tempoInjecao = calcularTempoInjeccao(desvio);
        
        // 4. ACIONAR MOTOR (injetar base)
        acionarMotorDosador(BASE, tempoInjecao);
        registrarAcao("Injeção de base", tempoInjecao);
        
    } else if (pH > pH_MAXIMO) {
        // pH muito alcalino
        float desvio = pH - pH_MAXIMO;
        int tempoInjecao = calcularTempoInjeccao(desvio);
        
        // 4. ACIONAR MOTOR (injetar ácido)
        acionarMotorDosador(ACIDO, tempoInjecao);
        registrarAcao("Injeção de ácido", tempoInjecao);
    }
    
    // 5. TRANSMITIR DADOS
    if (tempoDeEnviarDados()) {
        enviarParaServidor(dados);
    }
    
    // 6. AGUARDAR INTERVALO
    delay(INTERVALO_LEITURA);
}
```

---

## Parâmetros Configuráveis

| Parâmetro | Valor Padrão | Descrição |
|-----------|-------------|-----------|
| pH Mínimo | 7.5 | Limite inferior para acionamento |
| pH Máximo | 8.5 | Limite superior para acionamento |
| Intervalo de Leitura | 5 min | Frequência de amostragem |
| Tempo de Estabilização | 2 min | Aguardo após dosagem |
| Volume Máximo de Dosagem | 100 mL | Proteção contra sobre-dosagem |
| Calibração do Sensor | Periódica | Ajuste de precisão (recomendado mensalmente) |

---

## Calibração do Sensor de pH

### Procedimento

1. **Solução Buffer pH 7.0**
   - Imergir sensor em solução de referência pH 7.0
   - Registrar valor lido pelo ADC
   
2. **Solução Buffer pH 4.0 ou 10.0**
   - Imergir em segunda solução de referência
   - Registrar segundo valor de calibração

3. **Cálculo de Fatores**
   ```
   Slope = (pH2 - pH1) / (ADC2 - ADC1)
   Intercept = pH1 - (Slope × ADC1)
   ```

4. **Implementação no Firmware**
   ```c
   float converterParaEscalaPH(int adcValue) {
       return SLOPE * adcValue + INTERCEPT;
   }
   ```

---

## Dashboard - Arquitetura Técnica

### Visão Geral da Arquitetura

O dashboard é uma aplicação web/mobile que consome dados da API de monitoramento, apresentando métricas em tempo real e históricos do sistema de carcinicultura.

```
┌─────────────────┐
│   ESP32         │
│  (Coleta dados) │
└────────┬────────┘
         │ HTTP/MQTT
         ▼
┌─────────────────────────────┐
│   Backend (API REST)        │
│  - Express.js / Node.js     │
│  - Python Flask/FastAPI     │
│  - Database (PostgreSQL)    │
└────────┬────────────────────┘
         │ JSON
         ▼
┌─────────────────────────────┐
│   Frontend (Dashboard)      │
│  - React / Vue.js           │
│  - Web Browser              │
│  - Mobile App               │
└─────────────────────────────┘
```

### Tecnologias Recomendadas

#### Backend

| Componente | Opções | Recomendação |
|-----------|--------|-------------|
| Linguagem | Node.js, Python, Go | Node.js (Express) ou Python (FastAPI) |
| Framework | Express, FastAPI, Django | Express.js ou FastAPI |
| Database | PostgreSQL, MongoDB, MySQL | PostgreSQL para estruturado |
| Broker MQTT | Mosquitto, HiveMQ | Mosquitto (código aberto) |
| Cache | Redis | Redis para dados em tempo real |

#### Frontend

| Componente | Opções | Recomendação |
|-----------|--------|-------------|
| Framework | React, Vue, Angular | React ou Vue.js |
| Gráficos | Chart.js, Recharts, ECharts | Recharts (React) |
| Styling | Tailwind, Bootstrap, Material-UI | Tailwind CSS |
| Hospedagem | Vercel, Heroku, AWS, DigitalOcean | Vercel (frontend) + DigitalOcean/AWS (backend) |

### Endpoints da API

#### 1. **POST /api/readings**
Recebe leitura de sensor do ESP32

**Requisição:**
```json
{
  "deviceId": "ESP32_001",
  "timestamp": "2025-08-31T10:30:00Z",
  "pH": 7.48,
  "temperature": 27.6,
  "ammonia": 0.12,
  "salinity": 12,
  "battery": 95
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Leitura registrada com sucesso",
  "readingId": "READ_12345"
}
```

#### 2. **POST /api/actions**
Registra ações do sistema (dosagens, alertas)

**Requisição:**
```json
{
  "deviceId": "ESP32_001",
  "timestamp": "2025-08-31T10:32:15Z",
  "actionType": "dosage",
  "details": {
    "substance": "base",
    "volumeMl": 25,
    "duration": 45,
    "reason": "pH below minimum"
  }
}
```

**Resposta (200):**
```json
{
  "success": true,
  "actionId": "ACT_67890"
}
```

#### 3. **GET /api/current-status**
Retorna status atual do sistema

**Resposta (200):**
```json
{
  "deviceId": "ESP32_001",
  "lastUpdate": "2025-08-31T10:30:00Z",
  "currentReadings": {
    "pH": 7.48,
    "temperature": 27.6,
    "ammonia": 0.12,
    "salinity": 12
  },
  "systemStatus": {
    "connection": "connected",
    "pHSensor": "functioning",
    "dosagePump": "inactive",
    "lastCalibration": "2025-08-30"
  },
  "alerts": []
}
```

#### 4. **GET /api/history**
Retorna histórico de leituras com filtros

**Query Parameters:**
```
?startDate=2025-08-30T00:00:00Z
&endDate=2025-08-31T23:59:59Z
&limit=100
&offset=0
```

**Resposta (200):**
```json
{
  "data": [
    {
      "timestamp": "2025-08-31T10:30:00Z",
      "pH": 7.48,
      "temperature": 27.6,
      "ammonia": 0.12,
      "salinity": 12
    },
    {
      "timestamp": "2025-08-31T10:25:00Z",
      "pH": 7.45,
      "temperature": 27.5,
      "ammonia": 0.15,
      "salinity": 12
    }
  ],
  "total": 288,
  "page": 1,
  "limit": 100
}
```

#### 5. **GET /api/statistics**
Retorna estatísticas agregadas

**Query Parameters:**
```
?period=24h  (ou 7d, 30d, 90d)
&metric=pH   (ou temperature, ammonia, salinity)
```

**Resposta (200):**
```json
{
  "metric": "pH",
  "period": "24h",
  "statistics": {
    "average": 7.52,
    "minimum": 7.10,
    "maximum": 8.45,
    "standardDeviation": 0.35,
    "readingsCount": 288
  },
  "timeRange": {
    "start": "2025-08-30T10:30:00Z",
    "end": "2025-08-31T10:30:00Z"
  }
}
```

#### 6. **GET /api/alerts**
Retorna alertas do sistema

**Resposta (200):**
```json
{
  "alerts": [
    {
      "alertId": "ALT_111",
      "timestamp": "2025-08-31T09:15:00Z",
      "severity": "warning",
      "type": "pH_deviation",
      "message": "pH abaixo do mínimo ideal",
      "value": 6.95,
      "resolved": false
    }
  ],
  "activeCount": 1,
  "resolvedCount": 12
}
```

#### 7. **POST /api/configuration**
Atualiza configurações do sistema

**Requisição:**
```json
{
  "pHMin": 7.5,
  "pHMax": 8.5,
  "readingInterval": 300,
  "stabilizationTime": 120,
  "maxDosageVolume": 100,
  "autoMode": true
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Configurações atualizadas com sucesso"
}
```

### Modelo de Dados - Leitura (Reading)

```javascript
{
  _id: ObjectId,                    // ID único
  deviceId: String,                 // Identificador do ESP32
  timestamp: ISODate,               // Data/hora UTC
  readings: {
    pH: Float,                      // Valor de pH (0-14)
    temperature: Float,             // Temperatura em °C
    ammonia: Float,                 // Amônia em mg/L
    salinity: Float,                // Salinidade em ppt
    battery: Integer                // Nível de bateria (0-100)
  },
  quality: {
    isValid: Boolean,               // Passou validação
    confidence: Float               // Nível de confiança (0-1)
  },
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### Modelo de Dados - Ação (Action)

```javascript
{
  _id: ObjectId,
  deviceId: String,
  timestamp: ISODate,
  type: String,                     // "dosage", "alert", "calibration"
  details: {
    // Para dosage
    substance: String,              // "acid" ou "base"
    volumeMl: Integer,
    duration: Integer,              // Segundos
    reason: String,
    
    // Para calibration
    calibrationPoint: String,       // "pH7", "pH4", "pH10"
    adcValue: Integer,
    
    // Para alert
    severity: String,               // "info", "warning", "critical"
    message: String
  },
  createdAt: ISODate
}
```

### Modelo de Dados - Configuração (Configuration)

```javascript
{
  _id: ObjectId,
  deviceId: String,
  // Limites de pH
  pHMinimum: 7.5,
  pHMaximum: 8.5,
  
  // Parâmetros de operação
  readingInterval: 300,             // Segundos entre leituras
  stabilizationTime: 120,           // Segundos após dosagem
  maxDosageVolume: 100,             // mL máximo por ciclo
  
  // Limites de alerta
  alertThresholds: {
    temperature: { min: 26, max: 30 },
    ammonia: { max: 0.5 },
    salinity: { min: 10, max: 20 }
  },
  
  // Modo de operação
  autoMode: Boolean,                // true = automático, false = manual
  
  updatedAt: ISODate,
  updatedBy: String
}
```

### Métricas Exibidas no Dashboard

#### Indicadores Principais (KPIs)

1. **pH Atual**
   - Valor instantâneo com timestamp
   - Indicador visual: Verde (ideal), Amarelo (aviso), Vermelho (crítico)
   - Faixa ideal exibida: 7.0 - 8.5

2. **Temperatura**
   - Valor atual em °C
   - Limite ideal: 26 - 30 °C
   - Tendência (↑/↓/→)

3. **Amônia (NH₃)**
   - Concentração em mg/L
   - Limite ideal: < 0.5 mg/L
   - Status de conformidade

4. **Salinidade**
   - Concentração em ppt (partes por mil)
   - Intervalo ideal: 10 - 20 ppt
   - Nível de alerta se fora do intervalo

#### Gráficos e Visualizações

1. **Histórico de pH (últimas 24h)**
   - Tipo: Gráfico de linha
   - Eixo X: Tempo (formato HH:MM)
   - Eixo Y: Valor de pH (0-14)
   - Linhas de referência: Min e Max ideais
   - Destaque de pontos onde ocorreu dosagem

2. **Distribuição de Eventos**
   - Tipo: Timeline vertical
   - Mostra dosagens, calibrações e alertas
   - Data, hora e tipo de evento

3. **Estatísticas Agregadas**
   - Média de pH do dia
   - Máximo e mínimo registrados
   - Desvio padrão
   - Número de leituras

#### Seção de Status do Sistema

```
Conexão:          [✓ Conectado]
Sensor de pH:     [✓ Funcionando]
Bomba Dosadora:   [✗ Desativada]
Última Calibração: 30/08/2025
Bateria:          95%
```

#### Seção de Alertas

- **Ativa**: Quantidade de alertas não resolvidos
- **Resolvida**: Histórico de alertas fechados
- **Crítica**: Alertas em tempo real com notificação sonora

### Funcionalidades de Interação

1. **Filtros Temporais**
   - Últimas 24 horas
   - Últimos 7 dias
   - Últimos 30 dias
   - Intervalo customizado

2. **Exportação de Dados**
   - Formato CSV
   - Formato JSON
   - Relatório em PDF

3. **Configuração Remota**
   - Ajuste de limites de pH
   - Intervalo de leitura
   - Modo automático/manual
   - Limites de alerta

4. **Notificações**
   - Push notifications (mobile)
   - Email para alertas críticos
   - Webhook para integrações externas

### Autenticação e Segurança

```javascript
// Autenticação: JWT (JSON Web Token)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Validação de dados
- Todas as leituras validadas antes de armazenamento
- Verificação de plausibilidade (valores fora de intervalo são descartados)
- Rate limiting: máximo 1000 requisições/hora por deviceId
- HTTPS obrigatório para produção
```

### WebSocket para Atualizações em Tempo Real

Para atualizações instantâneas (sem polling):

```javascript
// Conexão
WebSocket: wss://api.example.com/ws/readings

// Evento de nova leitura
{
  "type": "reading",
  "data": {
    "deviceId": "ESP32_001",
    "timestamp": "2025-08-31T10:30:00Z",
    "pH": 7.48
  }
}

// Evento de alerta
{
  "type": "alert",
  "data": {
    "severity": "warning",
    "message": "pH abaixo do ideal"
  }
}
```

### Fluxo de Dados Completo

```
1. ESP32 coleta dados dos sensores
   ↓
2. ESP32 envia para API: POST /api/readings
   ↓
3. Backend valida e armazena no database
   ↓
4. Sistema processa lógica de alertas/dosagem
   ↓
5. Backend emite evento via WebSocket
   ↓
6. Dashboard recebe em tempo real
   ↓
7. Interface atualiza gráficos e indicadores
   ↓
8. Usuário visualiza dados atualizados
```

### Performance e Escalabilidade

- **Frequência de leitura**: 1 leitura a cada 5 minutos (configurável)
- **Pontos de dados por dia**: ~288 (24h ÷ 5min)
- **Retenção de dados**: Recomendado 1-2 anos (histórico completo)
- **Volume estimado**: ~105.000 leituras/ano por dispositivo
- **Taxa de dados**: ~1-2 KB por leitura (comprimido)
- **Latência aceitável**: < 5 segundos de atraso

### Integração com Sistemas Externos

Endpoints de webhook para integração com:
- Sistemas de notificação (Twilio, SendGrid)
- Plataformas de IoT (ThingSpeak, Azure IoT)
- Ferramentas de análise (Tableau, Power BI)
- Sistemas de gestão (ERP, CRM)

---

## Firmware ESP32 - Integração com Dashboard

### Estrutura Geral do Código

O firmware do ESP32 é responsável por:
1. Ler dados dos sensores
2. Processar lógica de controle
3. Transmitir dados para o backend
4. Receber configurações remotas
5. Executar ações (dosagem automática)

### Bibliotecas Necessárias

```cpp
#include <WiFi.h>              // Conectividade WiFi
#include <HTTPClient.h>        // Cliente HTTP para API REST
#include <ArduinoJson.h>       // Parsing JSON
#include <EEPROM.h>            // Armazenamento persistente
#include <WebSocketsClient.h>  // WebSocket para tempo real
#include <time.h>              // Sincronização de hora
```

### Instalação via Arduino IDE

```
Sketch → Include Library → Manage Libraries
Buscar e instalar:
- ArduinoJson by Benoit Blanchon
- WebSocket for Arduino
- HTTPClient (já incluso)
```

### Configuração Inicial

```cpp
// ===== CONFIGURAÇÕES =====

// WiFi
const char* SSID = "SEU_SSID";
const char* PASSWORD = "SUA_SENHA";

// Servidor backend
const char* API_SERVER = "https://api.seusistema.com";
const char* DEVICE_ID = "ESP32_001";
const char* API_KEY = "sua_chave_api_aqui";

// Sensores
const int pH_SENSOR_PIN = 34;        // GPIO 34 (ADC)
const int MOTOR_DOSADOR_PIN = 32;    // GPIO 32 (OUTPUT)

// Parâmetros padrão
float pH_MIN = 7.5;
float pH_MAX = 8.5;
int READING_INTERVAL = 300;          // 5 minutos em segundos
int STABILIZATION_TIME = 120;        // 2 minutos em segundos

// Calibração do sensor
float pH_SLOPE = 0.18;               // Fator de inclinação
float pH_INTERCEPT = 0.0;            // Intercepto
```

### Estrutura de Variáveis Globais

```cpp
struct SensorReading {
  float pH;
  float temperature;
  float ammonia;
  float salinity;
  uint8_t battery;
  unsigned long timestamp;
};

struct SystemConfig {
  float pHMin;
  float pHMax;
  int readingInterval;
  int stabilizationTime;
  int maxDosageVolume;
  bool autoMode;
};

struct SystemStatus {
  bool isConnected;
  bool pHSensorOK;
  bool dosagePumpOK;
  unsigned long lastCalibration;
  unsigned long lastSuccessfulReading;
};

SensorReading currentReading;
SystemConfig config;
SystemStatus status;
```

### Função Principal de Leitura

```cpp
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Inicializar pinos
  pinMode(pH_SENSOR_PIN, INPUT);
  pinMode(MOTOR_DOSADOR_PIN, OUTPUT);
  digitalWrite(MOTOR_DOSADOR_PIN, LOW);
  
  // Conectar WiFi
  connectToWiFi();
  
  // Sincronizar hora com NTP
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  waitForNTPSync();
  
  // Carregar configurações do EEPROM
  loadConfigFromEEPROM();
  
  // Inicializar status
  status.isConnected = false;
  status.lastSuccessfulReading = 0;
  
  Serial.println("ESP32 inicializado com sucesso");
}

void loop() {
  static unsigned long lastReadTime = 0;
  unsigned long currentTime = millis();
  
  // Verificar conexão WiFi
  if (WiFi.status() != WL_CONNECTED) {
    reconnectWiFi();
  }
  
  // Fazer leitura a cada intervalo configurado
  if (currentTime - lastReadTime >= (READING_INTERVAL * 1000)) {
    performReading();
    lastReadTime = currentTime;
  }
  
  // Processar comandos recebidos (se usar MQTT)
  handleIncomingCommands();
}
```

### Função de Leitura de Sensor

```cpp
void performReading() {
  Serial.println("Iniciando leitura de sensores...");
  
  // 1. LER SENSOR DE pH
  currentReading.pH = readPHSensor();
  
  // 2. VALIDAR LEITURA
  if (isValidReading(currentReading.pH)) {
    status.pHSensorOK = true;
    status.lastSuccessfulReading = time(nullptr);
  } else {
    status.pHSensorOK = false;
    Serial.println("ERRO: Leitura de pH inválida!");
    return;
  }
  
  // 3. REGISTRAR TIMESTAMP
  currentReading.timestamp = time(nullptr);
  
  // 4. LER SENSORES COMPLEMENTARES (simulado para exemplo)
  currentReading.temperature = 27.6;
  currentReading.ammonia = 0.12;
  currentReading.salinity = 12;
  currentReading.battery = 95;
  
  // 5. PROCESSAR LÓGICA DE CONTROLE
  processControlLogic();
  
  // 6. TRANSMITIR PARA API
  sendReadingToAPI(currentReading);
  
  Serial.print("pH lido: ");
  Serial.println(currentReading.pH);
}

float readPHSensor() {
  // Ler múltiplas amostras para melhor precisão
  int numSamples = 10;
  int totalADC = 0;
  
  for (int i = 0; i < numSamples; i++) {
    totalADC += analogRead(pH_SENSOR_PIN);
    delay(10);
  }
  
  int averageADC = totalADC / numSamples;
  
  // Converter para escala de pH usando calibração
  float pH = pH_SLOPE * averageADC + pH_INTERCEPT;
  
  return pH;
}

bool isValidReading(float pH) {
  // pH deve estar entre 0 e 14
  if (pH < 0 || pH > 14) {
    return false;
  }
  
  // Se última leitura foi muito diferente, pode ser erro
  // (histerese: pH não varia mais de 2 pontos de uma vez)
  if (status.lastSuccessfulReading > 0) {
    // Implementar verificação se necessário
  }
  
  return true;
}
```

### Processamento da Lógica de Controle

```cpp
void processControlLogic() {
  if (!config.autoMode) {
    Serial.println("Sistema em modo manual - nenhuma ação automática");
    return;
  }
  
  bool needsDosage = false;
  bool injectBase = false;  // true = base, false = ácido
  float desviation = 0;
  
  // Verificar necessidade de dosagem
  if (currentReading.pH < config.pHMin) {
    // pH muito ácido - injetar base
    desviation = config.pHMin - currentReading.pH;
    needsDosage = true;
    injectBase = true;
    
    Serial.println("ALERTA: pH abaixo do mínimo!");
    sendAlert("pH_DEVIATION", "warning", "pH abaixo do ideal");
    
  } else if (currentReading.pH > config.pHMax) {
    // pH muito alcalino - injetar ácido
    desviation = currentReading.pH - config.pHMax;
    needsDosage = true;
    injectBase = false;
    
    Serial.println("ALERTA: pH acima do máximo!");
    sendAlert("pH_DEVIATION", "warning", "pH acima do ideal");
  }
  
  // Se precisa dosagem, calcular volume e executar
  if (needsDosage) {
    int volumeMl = calculateDosageVolume(desviation);
    int durationSeconds = calculatePumpDuration(volumeMl);
    
    // Segurança: não ultrapassar limite máximo
    if (volumeMl > config.maxDosageVolume) {
      volumeMl = config.maxDosageVolume;
      durationSeconds = calculatePumpDuration(volumeMl);
    }
    
    performDosage(injectBase ? "base" : "acid", 
                  volumeMl, 
                  durationSeconds);
    
    // Aguardar estabilização antes de nova leitura
    delay(config.stabilizationTime * 1000);
    
    // Fazer nova leitura para validar
    currentReading.pH = readPHSensor();
    Serial.print("pH após dosagem: ");
    Serial.println(currentReading.pH);
  }
}

int calculateDosageVolume(float desviation) {
  // Fórmula simplificada: desvio em pH × fator de dosagem
  // Cada 0.5 pH = ~10mL de corretivo (ajustar conforme sua bomba)
  int volumeMl = (int)(desviation * 20);
  return volumeMl;
}

int calculatePumpDuration(int volumeMl) {
  // Calibrar conforme vazão da bomba
  // Exemplo: 2 mL/segundo = volumeMl / 2
  int durationSeconds = volumeMl / 2;
  return durationSeconds;
}
```

### Atuação do Motor Dosador

```cpp
void performDosage(String substance, int volumeMl, int durationSeconds) {
  Serial.print("Iniciando dosagem: ");
  Serial.print(volumeMl);
  Serial.print(" mL de ");
  Serial.println(substance);
  
  // Registrar ação
  unsigned long actionTime = time(nullptr);
  
  // Ativar motor
  digitalWrite(MOTOR_DOSADOR_PIN, HIGH);
  
  // Manter ligado pelo tempo calculado
  delay(durationSeconds * 1000);
  
  // Desativar motor
  digitalWrite(MOTOR_DOSADOR_PIN, LOW);
  
  Serial.println("Dosagem concluída");
  
  // Enviar registro da ação para API
  sendActionToAPI(substance, volumeMl, durationSeconds);
}
```

### Transmissão de Dados para API

```cpp
void sendReadingToAPI(SensorReading reading) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Sem conexão WiFi - dados serão armazenados localmente");
    saveReadingToEEPROM(reading);
    return;
  }
  
  HTTPClient http;
  String url = String(API_SERVER) + "/api/readings";
  
  http.begin(url);
  
  // Headers
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + API_KEY);
  http.addHeader("X-Device-ID", DEVICE_ID);
  
  // Construir JSON
  StaticJsonDocument<256> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["timestamp"] = reading.timestamp;
  doc["pH"] = reading.pH;
  doc["temperature"] = reading.temperature;
  doc["ammonia"] = reading.ammonia;
  doc["salinity"] = reading.salinity;
  doc["battery"] = reading.battery;
  
  String payload;
  serializeJson(doc, payload);
  
  Serial.print("Enviando: ");
  Serial.println(payload);
  
  // Fazer requisição POST
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode == 200) {
    Serial.println("✓ Leitura enviada com sucesso");
    status.isConnected = true;
  } else {
    Serial.print("✗ Erro na requisição: ");
    Serial.println(httpResponseCode);
    status.isConnected = false;
    
    // Tentar recuperar dados não sincronizados
    resendPendingReadings();
  }
  
  http.end();
}

void sendActionToAPI(String substance, int volumeMl, int duration) {
  HTTPClient http;
  String url = String(API_SERVER) + "/api/actions";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + API_KEY);
  
  StaticJsonDocument<256> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["timestamp"] = time(nullptr);
  doc["actionType"] = "dosage";
  doc["details"]["substance"] = substance;
  doc["details"]["volumeMl"] = volumeMl;
  doc["details"]["duration"] = duration;
  doc["details"]["reason"] = "pH correction";
  
  String payload;
  serializeJson(doc, payload);
  
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode == 200) {
    Serial.println("✓ Ação registrada no servidor");
  }
  
  http.end();
}

void sendAlert(String alertType, String severity, String message) {
  HTTPClient http;
  String url = String(API_SERVER) + "/api/alerts";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + API_KEY);
  
  StaticJsonDocument<256> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["timestamp"] = time(nullptr);
  doc["type"] = alertType;
  doc["severity"] = severity;
  doc["message"] = message;
  doc["value"] = currentReading.pH;
  
  String payload;
  serializeJson(doc, payload);
  
  http.POST(payload);
  http.end();
}
```

### Conectividade WiFi

```cpp
void connectToWiFi() {
  Serial.print("Conectando ao WiFi: ");
  Serial.println(SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    status.isConnected = true;
  } else {
    Serial.println("\nFalha ao conectar WiFi");
    status.isConnected = false;
  }
}

void reconnectWiFi() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi desconectado - tentando reconectar...");
    WiFi.disconnect();
    delay(1000);
    connectToWiFi();
  }
}

void waitForNTPSync() {
  Serial.println("Sincronizando hora via NTP...");
  time_t now = time(nullptr);
  int attempts = 0;
  
  while (now < 24 * 3600 && attempts < 20) {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
    attempts++;
  }
  
  Serial.println();
  Serial.print("Hora sincronizada: ");
  Serial.println(ctime(&now));
}
```

### Persistência de Dados

```cpp
void saveReadingToEEPROM(SensorReading reading) {
  // Implementar fila circular no EEPROM
  // Útil para armazenar dados quando sem conexão
  Serial.println("Salvando leitura no EEPROM...");
  
  // Exemplo simplificado (expandir conforme necessário)
  EEPROM.writeFloat(0, reading.pH);
  EEPROM.writeFloat(4, reading.temperature);
  EEPROM.commit();
}

void resendPendingReadings() {
  // Enviar dados que foram salvos offline
  Serial.println("Reenviando leituras pendentes...");
  
  float savedPH = EEPROM.readFloat(0);
  float savedTemp = EEPROM.readFloat(4);
  
  if (savedPH > 0) {
    // Construir e enviar reading salvo
    Serial.println("Dados offline reenviados com sucesso");
    EEPROM.writeFloat(0, 0);
    EEPROM.commit();
  }
}

void saveConfigToEEPROM() {
  Serial.println("Salvando configurações no EEPROM...");
  
  EEPROM.writeFloat(100, config.pHMin);
  EEPROM.writeFloat(104, config.pHMax);
  EEPROM.writeInt(108, config.readingInterval);
  EEPROM.commit();
}

void loadConfigFromEEPROM() {
  Serial.println("Carregando configurações do EEPROM...");
  
  config.pHMin = EEPROM.readFloat(100);
  config.pHMax = EEPROM.readFloat(104);
  config.readingInterval = EEPROM.readInt(108);
  
  // Se valores não foram salvos antes, usar padrões
  if (config.pHMin == 0 || isnan(config.pHMin)) {
    config.pHMin = pH_MIN;
  }
}
```

### Tratamento de Erros e Logs

```cpp
void logEvent(String eventType, String message) {
  unsigned long timestamp = time(nullptr);
  
  Serial.print("[");
  Serial.print(timestamp);
  Serial.print("] ");
  Serial.print(eventType);
  Serial.print(": ");
  Serial.println(message);
  
  // Opcionalmente, enviar logs para servidor
  // sendLogToAPI(eventType, message, timestamp);
}

void handleError(String errorCode, String description) {
  Serial.print("ERRO [");
  Serial.print(errorCode);
  Serial.print("]: ");
  Serial.println(description);
  
  // Enviar alerta crítico
  sendAlert("ERROR", "critical", description);
  
  // Implementar estratégia de recuperação
  // Por exemplo: reset do sensor ou motor
}
```

---

## Segurança e Proteção

### Medidas Implementadas

1. **Proteção contra Sobre-dosagem**
   - Limite máximo de volume por ciclo
   - Timer de segurança no motor

2. **Validação de Dados**
   - Verificação de plausibilidade de leituras
   - Detecção de sensor defeituoso (valores fora de intervalo)

3. **Failsafe**
   - Se sensor falhar, desativar automaticamente o motor dosador
   - Alertar operador via notificação

4. **Backup de Dados**
   - Armazenamento local em EEPROM do ESP32
   - Sincronização com servidor quando conexão restaurada

---

## Referências Acadêmicas

O projeto é fundamentado em artigos e estudos relacionados a:

- Monitoramento de qualidade de água em aquicultura
- Sistemas IoT para agricultura e aquacultura
- Automação de processos de aquicultura
- Dosagem automática de corretivos em sistemas aquáticos

**Documentos inclusos no repositório:**
- `IoT enabled aquatic drone for environmental monitoring.pdf`
- `Water quality monitoring of Peruvian Amazon based in the Internet of Things.pdf`

---

##  Como Usar

### Instalação

1. Clonar o repositório
   ```bash
   git clone https://github.com/Elidayvison/hellocarci.git
   cd hellocarci
   ```

2. Configurar ambiente Arduino IDE
   - Instalar placa ESP32
   - Instalar bibliotecas necessárias (WiFi, MQTT, etc.)

3. Upload do firmware
   - Conectar ESP32 ao computador via USB
   - Configurar porta e velocidade
   - Fazer upload do código

4. Configuração de Rede
   - Editar credenciais WiFi no firmware
   - Configurar endereço do servidor

5. Calibração do Sensor
   - Seguir procedimento descrito na seção de Calibração
   - Ajustar fatores de conversão no código

### Operação

1. Ligar o sistema
2. Aguardar conexão WiFi (LED indicador)
3. Acessar dashboard
4. Monitorar leituras em tempo real

---

##  Troubleshooting

### Sensor não responde

- Verificar conexões de fio
- Testar com multímetro
- Recalibrar sensor

### Motor não ativa

- Verificar voltagem no relé
- Testar relé independentemente
- Verificar GPIO do ESP32

### Conexão WiFi instável

- Reposicionar roteador
- Aumentar potência de transmissão
- Verificar interferências

---

## Suporte e Contribuições

Para dúvidas, sugestões ou contribuições, abra uma issue ou entre em contato através do repositório GitHub.

---

## Licença



---

**Última atualização:** Setembro 2026  
**Status:** Em desenvolvimento
