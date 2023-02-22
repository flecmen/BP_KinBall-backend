import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from '../../package.json'
import Logger from "./logger";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Kin-ball API",
            version,
            description: "Dokumentace API webové aplikace Kin-Ball Institutu v Brně"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    cheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["src/routes/*.ts", "prisma/schema.prisma"]
}

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
    // Swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    Logger.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;