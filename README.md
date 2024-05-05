# Utilização de Web Workers para Conversão de CSV em JSON

## Introdução

Utilização de Web Workers em uma aplicação web para realizar a conversão de arquivos CSV em JSON. A aplicação é desenvolvida utilizando HTML, CSS e TypeScript, seguindo o padrão de projeto MVC (Model-View-Controller).

## Tecnologias Utilizadas

- HTML5
- CSS3
- TypeScript
- Web Workers

## Utilização de Web Workers

Os Web Workers são threads de execução JavaScript em segundo plano que permitem que a aplicação execute tarefas em paralelo, sem interferir na interface do usuário. Neste projeto, os Web Workers são utilizados para processar a conversão de arquivos CSV em JSON de forma assíncrona, mantendo a responsividade da aplicação.

### Fluxo de Funcionamento

1. O usuário seleciona um arquivo CSV utilizando a interface da aplicação.
2. O Controlador recebe o arquivo selecionado e inicia um Web Worker para processar a conversão.
3. O Web Worker processa a conversão do CSV em JSON usando o serviço de processamento do arquivo em segundo plano.
4. Enquanto o Web Worker está processando, a interface do usuário é informada do processo de conversão.
5. Após a conclusão da conversão, o Web Worker envia o resultado de volta para o Controlador.
6. O Controlador atualiza a Interface com o JSON resultante da conversão.

## Como instalar

```bash
git clone https://github.com/MrEzequiel/web-worker.git
cd web-worker

yarn install
yarn dev
```

## Considerações Finais

A utilização de Web Workers nesta aplicação proporciona uma experiência de usuário mais fluída, especialmente ao lidar com grandes conjuntos de dados. O padrão de projeto MVC ajuda a organizar o código de forma modular e facilita a manutenção e expansão da aplicação no futuro.
