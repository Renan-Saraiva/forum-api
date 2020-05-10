# ForumAPI

API para um fórum de discussões

## Pré-Requisitos e Configurações

- Ter instalado o [node](https://nodejs.org/en/).
- Ter instalado o [npm](https://www.npmjs.com/).
- Uma instância do [MongoDB](https://www.mongodb.com/).
- Ter configurado o arquivo [.EVN](https://github.com/Renan-Saraiva/forum-api/blob/master/.env.example) com os dados de conexão do MongoDB, abaixo segue um exemplo de configuração:

```
#MongoDB Access
BDUSER=
DBPASSWORD=
DBURI=
```

#### Abaixo as decrições de cada chave

- DBUSER = Usuário para conexão ao banco MongoDB
- DBPASSWORD = Senha para conexão ao banco MongoDB
- DBURI = Endereço da instância do banco MongoDB


A interface para esta API pode ser encontrado [neste repositório](https://github.com/Renan-Saraiva/forum-app).


## Executar os testes

1. Com o terminal de sua preferência entre na pasta raiz do projeto.
2. Execute o comando `npm install` para instalar todas as dependências.
3. Execute o comando `npm run teste` para iniciar os testes.

## Executar a aplicação

1. Com o terminal de sua preferência entre na pasta raiz do projeto
2. Execute o comando `npm install` para instalar todas as dependências
3. Execute o comando `npm run start` para iniciar a aplicação
4. Por default a aplicação estará rodando na porta [8080](http://localhost:8080)

## Documentação da API

Com o software [Insomnia](https://insomnia.rest/) é possível visualizar a documentação da API, basta realizar o download e importar o arquivo [Insomnia.json](https://github.com/Renan-Saraiva/forum-api/blob/master/Insomnia.json) no diretório raiz da aplicação, a documentação de cada método pode ser visualizada na aba docs da requisição.
