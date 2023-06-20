import schemas from "../schemas"

export default {
    "/auth/login": {
        post: {
            tags: ["Auth"],
            summary: "Login",
            description: "Login",
        }
    },
    "/auth/checkEmail/:email": {
        get: {
            tags: ["Auth"],
            description: "Check email availability",
        }
    },
    "/auth/register": {
        post: {
            tags: ["Auth"],
            description: "Register user",
        }
    }
}