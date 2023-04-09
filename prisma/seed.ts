import { PrismaClient, postType, eventType, role } from '@prisma/client'
import userService from '../src/services/user-service';
import postService from '../src/services/post-service';
import authUtils from '../src/utils/auth-utils';
import groupService from '../src/services/group-service';
import env from '../src/utils/env';

const prisma = new PrismaClient()


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
            image_path: "avatar.jpg"
        }
    })

    const userAdmin = await userService.createUser({
        full_name: 'David Flek',
        email: env.requireEnv('ADMIN_EMAIL') as string,
        password: authUtils.hashPassword(env.requireEnv('ADMIN_PASSWORD') as string),
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
            password: authUtils.hashPassword('heslo'),
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
            password: authUtils.hashPassword('heslo'),
            role: role.trener,
            date_of_birth: new Date(1985, 8, 22),
            last_signed_in: new Date(),
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
                time: new Date('2022-05-01T10:00:00.000Z'),
                address: "adresa nějaká",
                description: "random description",
                people_limit: 20,
                substitues_limit: 5,
                address_short: "adresa krátká",
                organiser: { connect: { id: user1?.id } },
                groups: {
                    connect: [{ id: group1?.id }, { id: group2?.id }]
                }
            }
        }
    })

    const post3 = await postService.createPost({
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
                time: new Date('2023-05-01T10:00:00.000Z'),
                address: "adresa dlouhá",
                description: "random description",
                people_limit: 20,
                substitues_limit: 5,
                address_short: "adresa krátká",
                organiser: { connect: { id: user1?.id } },
                groups: {
                    connect: [{ id: group1?.id }, { id: group2?.id }]
                },
            }
        }
    })

    await userService.createUser({
        full_name: 'John Doe',
        email: 'johndoe@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.admin,
        date_of_birth: new Date(1990, 4, 12),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Emma Johnson',
        email: 'emmajohnson@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.trener,
        date_of_birth: new Date(1988, 1, 15),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Michael Brown',
        email: 'michaelbrown@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.clen_spolku_hrac,
        date_of_birth: new Date(1995, 10, 5),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Jessica Wilson',
        email: 'jessicawilson@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.neclen_spolku_hrac,
        date_of_birth: new Date(1986, 6, 30),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'David Lee',
        email: 'davidlee@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.hrac_z_jineho_klubu,
        date_of_birth: new Date(1992, 2, 20),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Olivia Jackson',
        email: 'oliviajackson@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.zajemce,
        date_of_birth: new Date(1998, 11, 10),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Jacob White',
        email: 'jacobwhite@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.trener,
        date_of_birth: new Date(1989, 7, 8),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Sophia Martinez',
        email: 'sophiamartinez@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.neclen_spolku_hrac,
        date_of_birth: new Date(1996, 3, 24),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'William Davis',
        email: 'williamdavis@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.hrac_z_jineho_klubu,
        date_of_birth: new Date(1993, 9, 1),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Isabella Rodriguez',
        email: 'isabellarodriguez@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.zajemce,
        date_of_birth: new Date(1999, 5, 18),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Emma Watson',
        email: 'emmawatson@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.trener,
        date_of_birth: new Date(1991, 3, 15),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Michael Jackson',
        email: 'michaeljackson@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.clen_spolku_hrac,
        date_of_birth: new Date(1980, 11, 11),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Jack Sparrow',
        email: 'jacksparrow@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.neclen_spolku_hrac,
        date_of_birth: new Date(1985, 4, 25),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Bruce Wayne',
        email: 'brucewayne@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.hrac_z_jineho_klubu,
        date_of_birth: new Date(1975, 7, 23),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Elizabeth Bennet',
        email: 'elizabethbennet@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.zajemce,
        date_of_birth: new Date(1995, 10, 7),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Clark Kent',
        email: 'clarkkent@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.admin,
        date_of_birth: new Date(1983, 5, 18),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Mickey Mouse',
        email: 'mickeymouse@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.trener,
        date_of_birth: new Date(1928, 11, 18),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Donald Duck',
        email: 'donaldduck@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.clen_spolku_hrac,
        date_of_birth: new Date(1934, 6, 9),
        last_signed_in: new Date(),
    });

    await userService.createUser({
        full_name: 'Hermione Granger',
        email: 'hermionegranger@example.com',
        password: authUtils.hashPassword('heslo'),
        role: role.neclen_spolku_hrac,
        date_of_birth: new Date(1979, 9, 19),
        last_signed_in: new Date(),
    });


}

main()
    .catch(e => { throw e })
