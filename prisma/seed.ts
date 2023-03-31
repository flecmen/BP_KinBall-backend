import { PrismaClient, postType, eventType, role } from '@prisma/client'
import userService from '../src/services/user-service';
import postService from '../src/services/posts/post-service';
import authService from '../src/services/auth-service';
import eventService from '../src/services/events/event-service';
import groupService from '../src/services/group-service';
import dotenv from 'dotenv';

const prisma = new PrismaClient()
dotenv.config();


async function main() {
    const group1 = await groupService.createGroup({
        name: "all",
        color: "grey"
    })

    const group2 = await groupService.createGroup({
        name: "testGroup",
        color: "red-6"
    })
    const default_profile_pic = await prisma.image.create({
        data: {
            image_path: "avatars/avatar.jpg"
        }
    })

    const userAdmin = await userService.createUser({
        full_name: 'David Flek',
        email: process.env.ADMIN_EMAIL as string,
        password: authService.hashPassword(process.env.ADMIN_PASSWORD as string),
        role: role.admin,
        date_of_birth: new Date(1989, 3, 11),
        last_signed_in: new Date(),
        facebook: 'https://facebook.com/davidflek',
        instagram: 'https://instagram.com/davidflek',
        groups: {
            connect: [
                { id: group2?.id }]
        },
    })
    const user1 = await userService.createUser(
        {
            full_name: 'John Doe',
            email: 'johndoe@example.com',
            password: authService.hashPassword('heslo'),
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
            password: authService.hashPassword('heslo'),
            role: role.trener,
            date_of_birth: new Date(1985, 8, 22),
            last_signed_in: new Date(),
        }
    )



    const post2 = await postService.createPost({
        type: postType.event,
        heading: "heading2",
        author: { connect: { id: user1?.id } },
        groups: {
            connect: [{ id: group1?.id }, { id: group2?.id }]
        },
        text: 'Integer rutrum, orci vestibulum ullamcorper ultricies, lacus quam ultricies odio, vitae placerat pede sem sit amet enim. Proin in tellus sit amet nibh dignissim sagittis. Nulla non lectus sed nisl molestie malesuada. Nullam sit amet magna in magna gravida vehicula. Mauris dictum facilisis augue. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Fusce tellus odio, dapibus id fermentum quis, suscipit id erat. ',
        event: {
            create: {
                type: eventType.trenink,
                price: 350,
                time: new Date('2021-05-01T10:00:00.000Z'),
                address: "adresa nějaká",
                description: "random description",
                people_limit: 20,
                substitues_limit: 5,
                address_short: "adresa krátká",
                organiser: { connect: { id: user1?.id } }
            }
        }
    }
    )


    const post1 = await postService.createPost(
        {
            type: postType.text,
            heading: "heading",
            author: { connect: { id: user1?.id } },
            groups: {
                connect: [{ id: group1?.id }]
            },
            text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris tincidunt sem sed arcu. Praesent id justo in neque elementum ultrices. Maecenas aliquet accumsan leo. Nunc tincidunt ante vitae massa. In dapibus augue non sapien. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Integer in sapien. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ac dolor sit amet purus malesuada congue. Et harum quidem rerum facilis est et expedita distinctio. Fusce suscipit libero eget elit. Nullam lectus justo, vulputate eget mollis sed, tempor sed magna. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Fusce nibh. Aenean vel massa quis mauris vehicula lacinia.'
        }
    )



}

main()
    .catch(e => { throw e })
