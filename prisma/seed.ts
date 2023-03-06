import { PrismaClient, postType, eventType, role } from '@prisma/client'
import userService from '../src/services/user-service';
import postService from '../src/services/post-service';
const prisma = new PrismaClient()

const mockUsers = {
    userAdmin: {
        full_name: 'David Flek',
        email: 'davidovkyflekovky@gmail.com',
        password: 'heslo',
        role: role.admin,
        date_of_birth: new Date(1989, 3, 11),
        last_signed_in: new Date(),
        facebook: 'https://facebook.com/davidflek',
        instagram: 'https://instagram.com/davidflek',
    }
}


async function main() {
    const userAdmin = await userService.createUser(mockUsers.userAdmin)
    const user1 = await userService.createUser(
        {
            full_name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
            role: role.trener,
            date_of_birth: new Date(1990, 5, 1),
            last_signed_in: new Date(),
            facebook: 'https://facebook.com/johndoe',
            instagram: 'https://instagram.com/johndoe',
        }
    )
    const user2 = await userService.createUser(
        {
            full_name: 'Jane Smith',
            email: 'janesmith@example.com',
            password: 'password456',
            role: role.trener,
            date_of_birth: new Date(1985, 8, 22),
            last_signed_in: new Date(),
        }
    )

    const group1 = await prisma.group.create({
        data: {
            name: "all",
            color: "grey"
        }
    })

    const post2 = await postService.createPost({
        type: postType.event,
        heading: "heading2",
        author: { connect: { id: user1?.id } },
        groups: {
            connect: [{ id: group1.id }]
        },
    }
    )

    // const event1 = await prisma.event.create({
    //     data: {
    //         type: eventType.trenink,
    //         price: 350,
    //         time: new Date(),
    //         address: "adresa nějaká",
    //         organiser: {
    //             connect: { id: userAdmin?.id }
    //         },
    //         post: {
    //             connect: { id: post2?.id }
    //         }
    //     }
    // })



    const post1 = await postService.createPost(
        {
            type: postType.text,
            heading: "heading",
            author: { connect: { id: user1?.id } },
            groups: {
                connect: [{ id: group1.id }]
            },
        }
    )



}

main()
    .catch(e => { throw e })

export default mockUsers;