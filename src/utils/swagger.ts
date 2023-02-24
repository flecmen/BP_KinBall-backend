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
            schemas: {
                Settings: {
                    type: Object,
                    properties: {
                        userId: {
                            type: Number,
                            example: 1,
                            description: 'id of user (1:1 relation)'
                        },
                        email_notiffication: {
                            type: Boolean,
                            example: true
                        },
                        push_notification: {
                            type: Boolean,
                            example: true
                        }
                    }
                },
                Reward_system: {
                    type: Object,
                    properties: {
                        userId: {
                            type: Number,
                            example: 1,
                            description: 'id of user (1:1 relation)'
                        },
                        xp: {
                            type: Number,
                            example: 0
                        },
                        level: {
                            type: Number,
                            example: 1
                        }
                    }
                },
                User: {
                    type: Object,
                    properties: {
                        id: {
                            type: Number,
                            example: 1
                        },
                        full_name: {
                            type: String,
                            example: 'Jan Novák'
                        },
                        email: {
                            type: String,
                            example: 'John@example.com'
                        },
                        password: {
                            type: String,
                            example: 'heslo'
                        },
                        role: {
                            type: String,
                            example: 'trener'
                        },
                        date_of_birth: {
                            type: String,
                            example: '1989-04-10T22:00:00.000Z'
                        },
                        last_signed_in: {
                            type: String,
                            example: '2023-02-23T15:32:32.548Z'
                        },
                        facebook: {
                            type: String,
                            example: 'https://www.facebook.com/FlekDavid/'
                        },
                        instagram: {
                            type: String,
                            example: 'https://www.instagram.com/FlekDavid/'
                        },
                        settings: {
                            $ref: '#components/schemas/Settings'
                        },
                        reward_system: {
                            $ref: '#components/schemas/Reward_system'
                        }
                    }
                }
            }
        }
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