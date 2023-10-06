import fastifyPlugin from "fastify-plugin";
import { FastifyInstance,FastifyPluginAsync,FastifyPluginOptions,FastifyReply,FastifyRequest } from "fastify";

const { KEY_JWT } = process.env;
const JWT_FASTIFY_PLUGIN: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions,) => {
  fastify.register(require("@fastify/jwt"), {
    secret: KEY_JWT,
  });
  fastify.decorate("authenticated", async (req:FastifyRequest, reply:FastifyReply) => {
    try {
     //   await req.jwtVerify()
    } catch (error) {
      return reply.send(error);
    }
  });
};


export default fastifyPlugin(JWT_FASTIFY_PLUGIN)
