# Controle de Modelo de Arquitetura IoT para o Apoio à Tomada de Decisões na carcinicultura

## Descrição

## Descrição

Este projeto tem como objetivo analisar um <!--[dataset de imagens](https://github.com/JaGuzmanT/CONCORNET2023)--> Controle de Modelo de Arquitetura IoT para o Apoio à Tomada de Decisões na carcinicultura, usando ferramentas de ASP32, Arduino e sensores de controle da água com um dashboard que entrega ao usuario um controle de completo sobre o sistema de criação.

## Funcionalidades

- Hadware:  ASP32, Arduino e sensores <!--descrição dos sensores-->
- Análise do PH agua: O projeto utiliza um sensor para controle do PH enviando a informação para o datasent .
- Referência Acadêmica: O projeto é fundamentado no artigo acadêmico <!--[Damage detection on steel-reinforced concrete produced by corrosion via YOLOv3: A detailed guide](https://www.frontiersin.org/journals/built-environment/articles/10.3389/fbuil.2023.1144606/full).-->
## Treinando uma rede neural YOLOv5 para detecção de objetos

1. Coleta e Anotação de Dados:

   - É coletado um grande conjunto de imagens contendo os objetos que você deseja detectar.
   - Anota-se as imagens com caixas delimitadoras e rótulos de classe usando ferramentas como LabelImg ou VGG Image Annotator (VIA).
   - Nosso dataset veio previamente rotulado

2. Configuração do Ambiente:

   - Instalação das bibliotecas e dependências necessárias dentro do diretório yolov5

   ```
       pip install -r requirements.txt
   ```

   - Configuração do ambiente Python com os pacotes necessários.

3. Pré-processamento de Dados:

   - Redimensionionamento das imagens para o tamanho de entrada esperado pelo YOLOv5 (615x615).
   - Normalização dos valores dos pixels.
   - Conversão das anotações para o formato exigido pelo YOLOv5.

4. Configuração do Modelo:

   - Download do arquivo de configuração do YOLOv5 e os pesos pré-treinados.
   - Modificação do arquivo de configuração dataset.yaml para corresponder ao número de classes do dataset, caminho para o dataset e as imagens.

5. Treinamento:

   - Divisão do dataset em conjuntos de treinamento e validação.
   - Utilização do YOLOv5 em TensorFlow/Keras para iniciar o treinamento.
   - Monitoramento do treinamento usando métricas como perda e mAP (mean Average Precision).

6. Avaliação:

   - Avaliação do modelo treinado no conjunto de validação.
   - Calculo das métricas como precisão, recall e mAP para avaliar o desempenho.

7. Ajuste Fino:

   - Ajuste de hiperparâmetros (por exemplo, taxa de aprendizado, tamanho do lote) e re-treinamento se necessário.
   - Realização do aumento de dados para melhorar a robustez do modelo.

8. Inferência:

   - Utilização do modelo treinado para fazer previsões em novas imagens.
   - Visualização dos resultados desenhando caixas delimitadoras e rótulos de classe nas imagens.

9. Implantação:

   - Exportação do modelo treinado para um formato adequado para implantação (por exemplo, TensorFlow SavedModel, ONNX).
   - Integração do modelo em uma aplicação ou serviço para detecção de objetos em tempo real.

## Código utilizado no projeto

```
# Passo 1: Clonar o repositório
!git clone https://github.com//darknet.git
%cd darknet

# Passo 2: Baixar o Yolov5
git clone clone https://github.com/ultralytics/yolov5
# - Entre na pasta yolov5
# - execute o comando de instalação pip install -r requirements.txt

# Passo 3: Baixar o dataset
git clone https://github.com/JaGuzmanT/CONCORNET2023.git

# Passo 4: Modificar arquivos de configuração
# - importe a pasta dataset contendo as imagens e labels para a pasta yolov5
# - Atualize `dataset.yaml` para o número de classes e filtros e adicione o caminho para as imagens e labels

# Passo 5: Treinar o modelo
python yolov5/train.py --img 640 --epochs 3 --data dataset.yaml --weights yolov5s.pt

# Passo 6: Avaliar o modelo
yolo detect val model=yolov5s.pt
```

## Instalação

1. Clone o repositório: `git clone https://github.com/seu-usuario/seu-repositorio.git`
2. Instale o yoloV5
3. Acesse o diretório yoloV5
4. Crie um diretório chamado database e cole as imagens trazidas do repositório de origem pra lá
5. Execute o comando
```
    pip install -r requirements.txt
```

## Uso

1. Execute o comando de treinamento
2. Siga as instruções no console.

## Integrantes

Os integrantes do grupo são:

1. José Alexandre Lourenço Gonçalves
2. Ilana Brochardt
3. Elidayvison Silva
4. Juliane Monteiro Pires

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/).
````
