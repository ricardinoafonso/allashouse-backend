import { FastifyInstance } from "fastify";
import { User, UserService, IUserDtoCreate } from "../service/user.services";
import { container } from "tsyringe";
export async function usersRoutes(Route: FastifyInstance) {
  Route.post<{ Body: User }>("/auth", async (req, reply) => {
    const { email, password } = req.body;
    const UserServices = container.resolve(UserService);
    const resutl = await UserServices.login({
      email: email,
      password: password,
    });
    return reply.send(resutl);
  });
  Route.post<{ Body: IUserDtoCreate }>("/create", async (req, reply) => {
    const { email, adress, password, contact, name } = req.body;
    const UserServices = container.resolve(UserService);
    const result = await UserServices.create({
      email: email,
      password: password,
      name: name,
      contact: contact,
      adress: adress,
    });
    return reply.send(result);
  });
}
