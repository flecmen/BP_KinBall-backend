import schemas from "../schemas"

export default {
    "/user": {
        get: {
            description: "Use to request all users",
            responses: {
                "200": {
                    "description": "A successful response"
                }
            }
        }
    },
    "/user/:userId": {
        get: {
            description: "Use to request a single user by id",
            parameters: [
                {
                    in: "path",
                    name: "userId",
                    schema: schemas.User.properties.id,
                    required: true,
                    description: "Numeric id of the user to get"
                }
            ],
            responses: {
                200: {
                    "description": "A successful response"
                }
            }
        }
    }
}