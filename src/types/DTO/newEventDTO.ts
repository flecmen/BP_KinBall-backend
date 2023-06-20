import { Event, Group, Post, User } from "@prisma/client";

type newEventDTO = Event & {
    organiser: User,
    groups: Group[],
    heading: string | null | undefined,
    price: string | null,
    people_limit: string,
    substitues_limit: string,
    reaction_deadline: Post["reaction_deadline"] | undefined
}

export default newEventDTO;