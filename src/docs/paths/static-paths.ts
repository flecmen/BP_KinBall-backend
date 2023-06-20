import schemas from "../schemas"

export default {
    "/static/image": {
        post: {
            tags: ["Static"],
            description: "Upload image",
        }
    },
    "/static/image/{filename}": {
        get: {
            tags: ["Static"],
            description: "Get static file by filename",
        }
    }
}