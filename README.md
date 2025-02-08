<h1 align="center" style="font-weight: bold;">📽️ API de Filmes</h1>

<p>Esta API permite gerenciar filmes, armazenando informações como título, sinopse, ano de lançamento e gênero.</p>

<h1 >📌 Requisitos</h1>

<p>Antes de instalar, certifique-se de ter os seguintes softwares instalados:</p>

- Node.js (versão 16 ou superior)
- Git (opcional, para clonar o repositório)


<h1>📥 Instalação</h1>
Clone este repositório (ou baixe o código):

```bash
git clone git@github.com:coimbrajoao/Teste-Carefy-Backend.git
cd Teste-Carefy-Backend
```

Instale as dependências do projeto:
```bash
npm install axios body-parser dotenv express sqlite3 uiid http debug pino pino-multi-stream  pino-pretty
```
Isso instalará as seguintes dependências:

- axios (^1.7.9) - Para chamadas HTTP
- body-parse (^0.1.0) - Para interpretar o corpo das requisições
- debug (^4.4.0) - Para auxiliar na depuração
- dotenv (^16.4.7) - Para variáveis de ambiente
- express (^4.21.2) - Framework web para Node.js
- http (^0.0.1-security) - Módulo HTTP
- pino (^9.6.0) - Logger de alta performance
- pino-multi-stream (^6.0.0) - Gerenciamento de múltiplos streams de log
- pino-pretty (^13.0.0) - Formatação de logs
- sqlite3 (^5.1.7) - Banco de dados local
- uuid (^11.0.5) - Para geração de identificadores únicos

<h1>1️⃣ Configurar Variáveis de Ambiente</h1>

Crie um arquivo .env na raiz do projeto e adicione:
```bash
TMDB_API_KEY=SEU_API_KEY
TMDB_BEARER_TOKEN=SEU_TOKEN
```
⚠️ Substitua os valores acima pelos seus dados da API do TMDb

<h1>2️⃣ Iniciar o Servidor</h1>

Execute o seguinte comando no terminal:
```bash
npm start
```
ou
```bash
node src/app.js
```
Se estiver usando nodemon (caso tenha instalado):
```bash
npx nodemon src/app.js
```
<h1>🛠️ Rotas Disponíveis</h1>

|Método                     |Descrição
|----------|------------------------------------------------
|POST/movies                    |Adiciona um filme pelo nome
|POST/movies/:id/avaliation     |Avalia um filme
|PUT/movies/:id                |Atualiza o status de um filme
|GET/movies                    | Lista todos os filmes
|GET/movies/:id                |Obtém detalhes de um filme
|GET/movies/:id/history        |Histórico de mudanças

<h3>POST /movies</h3>

**REQUEST**
```json
{
    "title": "Interstellar"
}
```



**RESPONSE**
```json
{
    "message": "Filme criado com sucesso",
    "movie": {
        "id": 2,
        "title": "Interstellar",
        "synopsis": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        "release_year": "2014-11-05",
        "genre": "Adventure",
        "status": "A assistir",
        "avaliation": 0
    }
}
```



<h3>POST /movies/:id/avaliation</h3>

**REQUEST**
```json
{
    "avaliation": "5"
}
```
**RESPONSE**
```json
{
    "message": "Filme avaliado com sucesso",
    "movie": {
        "id": "2",
        "avaliation": "5"
    }
}
```

<h3>PUT /movies/:id</h3>

**REQUEST**
```json
{
    "status": "Recomendado"
}
```

**RESPONSE**
```json
{
    "message": "Status atualizado com sucesso",
    "updatedMovie": {
        "id": "1",
        "status": "Recomendado"
    }
}
```

<h3>GET /movies</h3>

**RESPONSE**
```json
{
    "curretPage": 1,
    "totalPage": 1,
    "totalMovie": 1,
    "data": [
        {
            "id": 1,
            "title": "Interstellar",
            "synopsis": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
            "release_year": "2014-11-05",
            "genre": "Adventure",
            "status": "Avaliado",
            "avaliation": 5
        }
    ]
}
```


<h3>GET /movies/:id</h3>

**RESPONSE**
```json
{
    "id": 1,
    "title": "Interstellar",
    "synopsis": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    "release_year": "2014-11-05",
    "genre": "Adventure",
    "status": "Avaliado",
    "avaliation": 5
}
```


<h3>GET /movies/:id/history</h3>

**RESPONSE**
```json
{
    "curretPage": 1,
    "totalPage": 1,
    "totalMovie": 5,
    "data": [
        {
            "id": 7,
            "movie_id": 1,
            "action": "Atualizado",
            "details": "Recomendado",
            "user": "admin",
            "timestamp": "2025-02-08 03:45:04"
        }
    ]
}
```

<h1>📚 Tecnologias Utilizadas</h1>

- Node.js - Ambiente de execução
- Express.js - Framework para APIs
- SQLite - Banco de dados local
- Axios - Para chamadas à API do TMDb
- dotenv - Para gerenciar variáveis de ambiente
