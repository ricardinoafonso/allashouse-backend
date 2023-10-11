import { FastifyInstance, FastifyReply } from "fastify";
import { container } from "tsyringe";
import { TokenService } from "../services/token";

interface Token {
  token: string;
}
export async function tokenRoute(fastify: any) {
  fastify.route({
    method: "POST",
    url: "/refresh",
    preValidation: [fastify.authenticated],
    handler: async (req: any, reply: FastifyReply) => {
      const { token } = req.body;
      const tokenService = container.resolve(TokenService);
      const result = await tokenService.update({
        token: token,
        usersId: req.user.id,
      });
      return reply.send({ result });
    },
  });
}
