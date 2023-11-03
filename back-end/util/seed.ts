//execute: npx ts-node util/seed.ts
import { faker } from '@faker-js/faker';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    console.log("Start seeding ...");
    await prisma.task.deleteMany({});
    await prisma.project.deleteMany({});

    const task1 = await prisma.task.create({
        data: {
            name: "Task 1",
            description: "Task 1 description",
            deadline: faker.date.future(),
        },
    });
    console.log("Created task 1");

    const task2 = await prisma.task.create({
        data: {
            name: "Task 2",
            description: "Task 2 description",
            deadline: faker.date.future(),
        },
    });
    console.log("Created task 2");

const project1 = await prisma.project.create({
    data: {
        name: "Project 1",
        tasks: {
                 connect: [{ id: task1.id } ,
                            { id: task2.id } ]
        },
    },
}); 
console.log("Created project 1");


};

main()