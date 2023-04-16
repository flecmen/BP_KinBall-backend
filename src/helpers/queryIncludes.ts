import { Group } from "@prisma/client"

export const eventIncludes = {
    players: {
        include: {
            user: {
                include: { profile_picture: true }
            }
        }
    },
    organiser: {
        include: { profile_picture: true, }
    },
    teams: {
        include: {
            players: {
                include: { profile_picture: true }
            }
        }
    },
    groups: true,
}

export const userInclude = {
    settings: true,
    reward_system: true,
    profile_picture: true,
    groups: true
}

export const commentInclude = {
    author: {
        include: userInclude
    },
    likes: true,
}

export const postIncludes = {
    author: {
        include: userInclude
    },
    groups: true,
    event: {
        include: {
            organiser: {
                include: {
                    profile_picture: true,
                    groups: true,
                }
            },
            players: {
                include: {
                    user: {
                        include: {
                            profile_picture: true,
                        }
                    },
                }
            },
            teams: true,
        }
    },
    images: true,
    likes: true,
    comments: {
        include: commentInclude
    },
    survey_options: {
        include: {
            votes: true,
        }
    },
    user_notification: true
}



let userGroups: Group[] = []
export const whereGroups = {
    some: {
        id: {
            in: userGroups.map(group => group.id)
        }
    }
}
