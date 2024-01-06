//execute: npx ts-node util/seed.ts
import { faker } from '@faker-js/faker';
import { PrismaClient } from "@prisma/client";
import { User } from '../domain/model/user';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    console.log("Start seeding ...");
    await prisma.task.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({});
    
    const team1 = await prisma.team.create({
        data: {
            name: 'Red Team',
        },
    });
    console.log(`Created team with name: ${team1.name}`);

    const team2 = await prisma.team.create({
        data: {
            name: 'Blue Team',
        },
    });
    console.log(`Created team with name: ${team2.name}`);

    const team3 = await prisma.team.create({
        data: {
            name: 'Green Team',
        },
    });
    console.log(`Created team with name: ${team3.name}`);

    const project1 = await prisma.project.create({
        data: {
            name: 'Full-stack project',
            team: {
                connect: {id: 1}
            }
        },
    });
    console.log(`Created project with name: ${project1.name}`);

    const project2 = await prisma.project.create({
        data: {
            name: 'Front-end project',
            team: {
                connect: {id: 2}
            }
        },
    });
    console.log(`Created project with name: ${project2.name}`);
    
    const task1 = await prisma.task.create({
        data: {
            name: 'Create database',
            description: 'Create database for project',
            completed: false,
            deadline: faker.date.future(),
            project: {
                connect: {id: 1}
            }
        },
    });
    console.log(`Created task with name: ${task1.name}`);

    const task2 = await prisma.task.create({
        data: {
            name: 'Create front-end',
            description: 'Create front-end for project',
            completed: false,
            deadline: faker.date.future(),
            project: {
                connect: {id: 1}
            }
        },
    });
    console.log(`Created task with name: ${task2.name}`);

    const task3 = await prisma.task.create({
        data: {
            name: 'Create back-end',
            description: 'Create back-end for project',
            completed: false,
            deadline: faker.date.future(),
            project: {
                connect: {id: 1}
            }
        },
    });
    console.log(`Created task with name: ${task3.name}`);

    const task4 = await prisma.task.create({
        data: {
            name: 'Create database',
            description: 'Create database for project',
            completed: false,
            deadline: faker.date.future(),
            project: {
                connect: {id: 2}
            }
        },
    });
    console.log(`Created task with name: ${task4.name}`);
    
    const project3 = await prisma.project.create({
        data: {
            name: 'Back-end project',
            team: {
                connect: {id: 1}
            }
        },
    });
    console.log(`Created project with name: ${project3.name}`);
    
    const user1pw = bcrypt.hashSync('greetjej123', 12);
    const user1 = await prisma.user.create({
        data: {
            name: 'Greetje Jongen',
            email: 'greetjej@ucll.be',
            password: user1pw,
            role: 'user',
            specialisation: 'Front-end'
        },
    });
    console.log(`Created user with name: ${user1.name} and email: ${user1.email}`);

    const user2pw = bcrypt.hashSync('elkes123', 12);
    const user2 = await prisma.user.create({
        data: {
            name: 'Elke Steegmans',
            email: 'elkes@ucll.be',
            password: user2pw,
            role: 'user',
            specialisation: 'Back-end',
            teams: {
                connect: {id: 1}
            }
        },
    });
    console.log(`Created user with name: ${user2.name} and email: ${user2.email}`);


    const user3pw = bcrypt.hashSync('johanp123', 12);
    const user3 = await prisma.user.create({
        data: {
            name: 'Johan Pieck',
            email: 'johanp@ucll.be',
            password: user3pw,
            role: 'admin',
            specialisation: 'Full-stack'
        },
    });
    console.log(`Created user with name: ${user3.name} and email: ${user3.email}`);

};
main()