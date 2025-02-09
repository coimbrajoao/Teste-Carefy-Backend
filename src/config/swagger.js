const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const basicAuth = require("../middlewares/authMiddleware");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "🎥 API de Filmes",
            version: "1.0.0",
            description: "Documentação da API de Filmes",
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Servidor Local",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "basic",
                    bearerFormat: "Autenticação basica utilizando usuario e senha",
                },
            },
        },security: [
            {
                basicAuth: [],
            },
        ],
        tags: [
            {
                name: "Movies",
                description: "Operações relacionadas aos filmes",
            },
            {
                name: "Logs",
                description: "Operações relacionadas aos logs",
            }
        ],
    },
    apis: ["src/docs/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
