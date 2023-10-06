import { FastifyInstance } from "fastify";

interface Token {
  token: string;
}
export async function tokenRoute(TokenRoute: FastifyInstance) {
  TokenRoute.post<{ Body: Token }>("/refresh", async (req, reply) => {
    const { token } = req.body;
  });
}
