import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt" 
const Prisma = new PrismaClient();

async function seed() {
  const user = Prisma.users;
  const password = await hash("12345678",8)
  await user.create({
    data: {
      name: "Ricardino de Almeida Afonso",
      email: "ricardino@gmail.com",
      password: password,
      adress: "Macon",
      contact: "922663820",
      User: 'admin',
      status: true
    },
  });
}


seed()