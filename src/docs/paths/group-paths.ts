import schemas from "../schemas"

export default {
    "/group": {
        get: {
            tags: ["Group"],
            summary: "Get all groups",
        },
        post: {
            tags: ["Group"],
            summary: "Create group",
        },
    },
    "/group/{groupId}": {
        get: {
            tags: ["Group"],
            summary: "Get group by Id",
        },
        put: {
            tags: ["Group"],
            summary: "Edit group",
        },
        delete: {
            tags: ["Group"],
            summary: "Delete group",
        }
    }
}