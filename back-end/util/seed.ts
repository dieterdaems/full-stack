//execute: npx ts-node util/seed.ts
import { faker } from '@faker-js/faker';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    console.log("Start seeding ...");
    await prisma.task.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({});

};

main()