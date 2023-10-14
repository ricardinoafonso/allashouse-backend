import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";
import { IMagicAuth, IUserDto, IUserDtoCreate } from "../dto/dto";
import { UserService } from "../service/user.services";
export async function usersRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: "/auth",
    handler: async (req: any, reply: FastifyReply) => {
      const { email, password } = req.body;
      const UserServices = container.resolve(UserService);
      const resutl = await UserServices.login({
        email: email,
        password: password,
      });
      return reply.send(resutl);
    },
  });

  fastify.post<{ Body: IMagicAuth }>(
    "/magic/auth",
    { preHandler: [fastify?.authenticated] },
    async (req: any, reply: FastifyReply) => {
      const { token } = req.body;
      const userService = container.resolve(UserService);
      const result = await userService.magicAuth({
        refresh: token,
      });
      return reply.send(result);
    }
  );
  fastify.put<{ Body: IUserDto }>(
    "/update/user",
    { preHandler: [fastify?.authenticated] },
    async (req: any, res: FastifyReply) => {
      const { email, name, contact, adress, password } = req.body;
      const userServices = container.resolve(UserService);
      const resutl = await userServices.update(req.user.id, {
        email,
        contact,
        password,
        adress,
        name,
      });
      return resutl;
    }
  );

  fastify.delete(
    "/delete/user",
    { preHandler: [fastify?.authenticated] },
    async (req: any, reply) => {
      const UserServices = container.resolve(UserService);
      const result = await UserServices.delete(req.user.id);
      return result;
    }
  );
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
