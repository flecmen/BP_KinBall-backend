import { PrismaClient, postType, eventType, role } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
    const user1 = await prisma.user.create({
        data: {
            full_name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
            role: role.admin,
            date_of_birth: new Date(1990, 5, 1),
            last_signed_in: new Date(),
            facebook: 'https://facebook.com/johndoe',
            instagram: 'https://instagram.com/johndoe',
            settings: {
                create: {
                    email_notification: true
                }
            },
            reward_system: {
                create: {
                    xp: 10,
                    level: 1
                }
            }
        }
    })

    const user2 = await prisma.user.create({
        data: {
            full_name: 'Jane Smith',
            email: 'janesmith@example.com',
            password: 'password456',
            role: role.trener,
            date_of_birth: new Date(1985, 8, 22),
            last_signed_in: new Date(),
            organising_events: {
                create: [
                    {
                        type: eventType.trenink,
                        time: new Date(),
                        address: '123 Main St',
                        postId: 1
                    },
                    {
                        type: eventType.turnaj,
                        time: new Date(),
                        address: '456 Elm St',
                        postId: 2
                    }
                ]
            }
        }
    })

    const post1 = await prisma.post.create({
        data: {
            type: postType.event,
            heading: 'My first post',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            authorId: user1.id,
            event: {
                create: {
                    type: eventType.kurz_pro_mladez,
                    time: new Date(),
                    address: '123 Main St',
                    postId: 1,
                    organiserId: user2.id
                }
            }
        }
    })

    const post2 = await prisma.post.create({
        data: {
            type: postType.text,
            heading: 'Breaking news!',
            text: 'Nulla accumsan, augue vel tristique tincidunt, elit quam hendrerit elit, sit amet scelerisque ante augue vel massa.',
            authorId: user2.id,
            groups: {
                create: [
                    {
                        name: 'Sports'
                    },
                    {
                        name: 'News'
                    }
                ]
            }
        }
    })

    // const event1 = await prisma.event.create({
    //     data: {
    //         type: eventType.TRAINING,
    //         price: 10,
    //         time: new Date(),
    //         address: '123 Main St',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    //         people_limit: 20,
    //         substitues_limit: 5,
    //         note: 'Don\'t forget to bring water!',
    //         post: {
    //             create: {
    //                 type: postType.ARTICLE,
    //                 heading: 'Training info',
    //                 text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    //                 authorId: user2.id
    //             }
    //         },
    //         organiserId: user2.id,
    //         teams: {
    //             create: [
    //                 {
    //                     name: 'Team A',
    //                     players: {
    //                         connect: [
    //                             { id: user1.id },
    //                             { id: user2.id }
    //                         ]
    //                     }
    //                 },
    //                 {
    //                     name:
    //                 }

}