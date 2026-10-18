// Configurações Globais
const CONFIG = {
  MIN_SAFE_PH: 7.5,
  MAX_SAFE_PH: 8.5,
  MAX_DATA_POINTS: 30,
  UPDATE_INTERVAL: 1500
};

// Estado da Aplicação
const state = {
  targetPh: 8.0,
  phHistory: [],
  alerts: []
};

// Elementos do DOM
const dom = {
  phValue: document.getElementById('phValue'),
  phStatusTag: document.getElementById('phStatusTag'),
  cardPh: document.getElementById('cardPh'),
  tempValue: document.getElementById('tempValue'),
  salinityValue: document.getElementById('salinityValue'),
  doValue: document.getElementById('doValue'),
  alertList: document.getElementById('alertList'),
  btnNormal: document.getElementById('btnNormal'),
  btnAcid: document.getElementById('btnAcid'),
  btnAlkaline: document.getElementById('btnAlkaline'),
  canvas: document.getElementById('phChart')
};

const ctx = dom.canvas.getContext('2d');

// Ajusta a resolução do Canvas para telas HDPI
function setupCanvas() {
  const rect = dom.canvas.parentElement.getBoundingClientRect();
  dom.canvas.width = rect.width;
  dom.canvas.height = rect.height;
}

// Adiciona um evento de alerta na lista
function addAlertMessage(message, type = 'info') {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR');
  
  const alertObj = { message, type, timeStr };
  state.alerts.unshift(alertObj);
  
  if (state.alerts.length > 20) {
    state.alerts.pop();
  }
  
  renderAlerts();
}

function renderAlerts() {
  dom.alertList.innerHTML = state.alerts
    .map(alert => `
      <li class="alert-item ${alert.type}">
        <span>${alert.message}</span>
        <span class="alert-time">${alert.timeStr}</span>
      </li>
    `)
    .join('');
}

// Desenha o gráfico de linha customizado usando Canvas API
function drawChart() {
  const width = dom.canvas.width;
  const height = dom.canvas.height;
  const padding = 30;

  ctx.clearRect(0, 0, width, height);

  if (state.phHistory.length < 2) return;

  const minPh = 5.5;
  const maxPh = 10.0;
  
  const getX = (index) => padding + (index / (CONFIG.MAX_DATA_POINTS - 1)) * (width - (padding * 2));
  const getY = (val) => height - padding - ((val - minPh) / (maxPh - minPh)) * (height - (padding * 2));

  // 1. Desenhar a Zona Segura Verde (pH 7.5 - 8.5)
  const ySafeMin = getY(CONFIG.MAX_SAFE_PH);
  const ySafeMax = getY(CONFIG.MIN_SAFE_PH);
  
  ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
  ctx.fillRect(padding, ySafeMin, width - (padding * 2), ySafeMax - ySafeMin);
  
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  
  ctx.beginPath();
  ctx.moveTo(padding, ySafeMin);
  ctx.lineTo(width - padding, ySafeMin);
  ctx.moveTo(padding, ySafeMax);
  ctx.lineTo(width - padding, ySafeMax);
  ctx.stroke();
  ctx.setLineDash([]);

  // 2. Desenhar a Linha dos Dados de pH
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#38bdf8';

  state.phHistory.forEach((val, i) => {
    const x = getX(i);
    const y = getY(val);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // 3. Desenhar os Pontos nos nós do gráfico
  state.phHistory.forEach((val, i) => {
    const x = getX(i);
    const y = getY(val);
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = (val < CONFIG.MIN_SAFE_PH || val > CONFIG.MAX_SAFE_PH) ? '#ef4444' : '#38bdf8';
    ctx.fill();
  });
}

// Simula a chegada periódica de dados da telemetria do Arduino
function simulateTelemetryData() {
  // Gera variação suave
  const noise = (Math.random() - 0.5) * 0.08;
  const currentPh = parseFloat((state.targetPh + noise).toFixed(2));
  
  // Atualiza histórico do gráfico
  state.phHistory.push(currentPh);
  if (state.phHistory.length > CONFIG.MAX_DATA_POINTS) {
    state.phHistory.shift();
  }

  // Atualiza Leituras na Interface
  dom.phValue.textContent = currentPh.toFixed(2);
  
  // Atualiza variações pequenas dos outros parâmetros
  dom.tempValue.textContent = (28.0 + (Math.random() - 0.5) * 0.4).toFixed(1);
  dom.salinityValue.textContent = (25.0 + (Math.random() - 0.5) * 0.2).toFixed(1);
  dom.doValue.textContent = (6.2 + (Math.random() - 0.5) * 0.3).toFixed(1);

  // Avaliação do Estado do pH
  if (currentPh < CONFIG.MIN_SAFE_PH) {
    dom.phStatusTag.textContent = 'ÁCIDO';
    dom.phStatusTag.className = 'status-tag tag-warning';
  } else if (currentPh > CONFIG.MAX_SAFE_PH) {
    dom.phStatusTag.textContent = 'ALCALINO';
    dom.phStatusTag.className = 'status-tag tag-danger';
  } else {
    dom.phStatusTag.textContent = 'IDEAL';
    dom.phStatusTag.className = 'status-tag tag-success';
  }

  drawChart();
}

// Event Listeners dos Botões do Simulador
dom.btnNormal.addEventListener('click', () => {
  state.targetPh = 8.0;
  addAlertMessage('Comando enviado: Restabelecendo pH para faixa ideal (8.00).', 'info');
});

dom.btnAcid.addEventListener('click', () => {
  state.targetPh = 6.8;
  addAlertMessage('ALERTA: Queda de pH induzida! Água abaixo do limite de segurança (6.80).', 'warning');
});

dom.btnAlkaline.addEventListener('click', () => {
  state.targetPh = 9.1;
  addAlertMessage('PERIGO: Surto alcalino! pH crítico detectado (9.10).', 'danger');
});

// Inicialização
window.addEventListener('resize', () => {
  setupCanvas();
  drawChart();
});

// Start da Aplicação
setupCanvas();
addAlertMessage('Conexão Socket.io estabelecida com sucesso com o servidor Node.js.', 'info');
addAlertMessage('Recebendo telemetria do microcontrolador (ESP32 / Arduino).', 'info');

setInterval(simulateTelemetryData, CONFIG.UPDATE_INTERVAL);