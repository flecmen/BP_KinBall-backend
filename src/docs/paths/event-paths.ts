import schemas from "../schemas"

export default {
    "/event": {
        get: {
            tags: ["Event"],
            description: "Get paginated events",
            parameters: [
                schemas.parameters.query.page,
                schemas.parameters.query.limit,
            ]
        },
        post: {
            tags: ["Event"],
            description: "Create event",
        }
    },
    "/event/{eventId}": {
        get: {
            tags: ["Event"],
            description: "Get event by Id",
        },
        put: {
            tags: ["Event"],
            description: "Edit event",
        },
        delete: {
            tags: ["Event"],
            description: "Delete event",
        },
    },
    "/event/{eventId}/user/{userId}/status/{userOnEventStatus}/{boolValue}": {
        post: {
            tags: ["Event"],
            description: "change user vote (going, don't know, not going)",
        }
    },
    "/event/{eventId}/attendance": {
        post: {
            tags: ["Event"],
            description: "do the attendance",
        }
    },
    "/event/multiple": {
        get: {
            tags: ["Event"],
            description: "GET multiple events by Ids",
            parameters: [
                schemas.parameters.query.idArray
            ]
        }
    },
    "/event/multiple/byPostIds": {
        get: {
            tags: ["Event"],
            description: "GET multiple events by postIds",
            parameters: [
                schemas.parameters.query.idArray
            ]
        }
    },
    "/event/organiser/{userId}/{filter}": {
        get: {
            tags: ["Event"],
            description: "GET events by organiser",
            parameters: [
                {
                    in: "path",
                    name: "filter",
                    schema: {
                        type: "string",
                        enum: ["today", "future", "past"]
                    }
                }
            ]
        }
    }

}