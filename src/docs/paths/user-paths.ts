import schemas from "../schemas"

export default {
    "/user": {
        get: {
            tags: ["User"],
            description: "Use to request all users",
            responses: {
                "200": {
                    "description": "A successful response"
                }
            }
        },
        post: {
            tags: ["User"],
            description: "Use to create a new user",
        }
    },
    "/user/{userId}": {
        get: {
            tags: ["User"],
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
        },
        put: {
            tags: ["User"],
            description: "Use to update a single user by id",
        },
        delete: {
            tags: ["User"],
            description: "Use to delete a single user by id",
        },
    },
    "/user/changePassword/{userId}": {
        put: {
            tags: ["User"],
            description: "Use to change user password",
        }
    }
}