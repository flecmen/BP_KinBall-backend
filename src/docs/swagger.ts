import path from 'path';
import paths from './paths';
import userPaths from "./paths/user-paths";
import schemas from './schemas';

export default {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Kin-ball API",
            version: "1.0.0",
            description: "This is the API for the Kin-ball project"
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
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                ...schemas,
            }
        },
        paths: {
            ...paths,
        }
    },
    apis: [
        './paths/user-paths',
    ]
}