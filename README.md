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

