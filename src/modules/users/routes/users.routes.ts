import { FastifyInstance, FastifyReply } from "fastify";
import { User, UserService, IUserDtoCreate } from "../service/user.services";
import { container } from "tsyringe";
export async function usersRoutes(fastify: any) {
  fastify.route(
    { 
    method: "POST",
    url: "/auth",
    handler: async (req, reply) => {
    const { email, password } = req.body;
    const UserServices = container.resolve(UserService);
    const resutl = await UserServices.login({
      email: email,
      password: password,
    });
    return reply.send(resutl);
  }});

  fastify.route({ 
    method: "POST",
    url: "/magic/auth",
    preValidation: [fastify.authenticated],
    handler: async (req: any, reply: FastifyReply) =>{
      const { token } = req.body;
      const userService = container.resolve(UserService);
      const result = await userService.magicAuth({
        refresh: token,
        userid: req.user.id,
      })
      return reply.send({ result });
    }
});

fastify.post<{ Body: IUserDtoCreate }>("/create", async (req, reply) => {
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
