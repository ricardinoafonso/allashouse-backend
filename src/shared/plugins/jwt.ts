import fastifyPlugin from "fastify-plugin";
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyReply,
} from "fastify";
import { verify_token } from "@shared/util/util";
import { NotAuthorized } from "@errors/Errors";

const JWT_FASTIFY_PLUGIN: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) => {
  fastify.decorate(
    "authenticated",
    async (req: any, reply: FastifyReply, done: any) => {
      try {
        const { authorization } = req.headers;
        if (!authorization) {
          throw new NotAuthorized(
            "user not authorized",
            "login now , token invalid"
          );
        }
        const token = authorization?.split(" ")[1];
        const { sub: user_id } = verify_token(`${token}`);
        if (user_id) {
          req.user = {
            id: user_id,
          };
          return done();
        }
        throw new NotAuthorized(
          "user not authorized",
          "login now , token invalid"
        );
      } catch (error) {
        return reply.send(error);
      }
    }
  );
};

export default fastifyPlugin(JWT_FASTIFY_PLUGIN);
