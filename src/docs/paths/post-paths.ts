import schemas from "../schemas"

export default {
    "/post": {
        get: {
            tags: ["Post"],
            description: "Get paginated posts",
            parameters: [
                schemas.parameters.query.page,
                schemas.parameters.query.limit,
            ]
        },
        post: {
            tags: ["Post"],
            description: "Create post",
        },
    },
    "/post/{postId}": {
        get: {
            tags: ["Post"],
            description: "Get post by Id",
        },
        put: {
            tags: ["Post"],
            description: "Edit post",
        },
        delete: {
            tags: ["Post"],
            description: "Delete post",
        },
    },
    "/post/multiple": {
        get: {
            tags: ["Post"],
            description: "GET multiple posts by Ids",
            parameters: [
                schemas.parameters.query.idArray
            ]
        },
    },

    "/post/{postId}/like/{userId}": {
        post: {
            tags: ["Post"],
            description: "Create like post",
        },
        delete: {
            tags: ["Post"],
            description: "Delete like post",
        },
    },

    "/post/{postId}/comment/{userId}": {
        post: {
            tags: ["Post"],
            description: "Create comment post",
        },
        delete: {
            tags: ["Post"],
            description: "Delete comment post",
        },
    },

    "/post/{postId}/comment/{commentId}/like/{userId}": {
        post: {
            tags: ["Post"],
            description: "Like a comment under a post",
        },
        delete: {
            tags: ["Post"],
            description: "Delete like a comment under a post",
        },
    },

    "/post/{postId}/survey/{survey_optionId}/user/{userId}/{boolValue}": {
        post: {
            tags: ["Post"],
            description: "Vote on a survey option",
        }
    }

}