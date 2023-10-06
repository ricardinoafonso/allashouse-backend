import "reflect-metadata";
import fastify from "fastify";
import { usersRoutes } from "@modules/users/routes/users.routes";
import fastifyCors from "@fastify/cors";
import { tokenRoute } from "@modules/token/routes/token.route";

const App = fastify({ logger: true });
const Port = process.env.PORT || 4000;

App.register(fastifyCors)
App.register(usersRoutes);
App.register(tokenRoute)

App.listen({ port: parseInt(`${Port}`) }, (error, adress) => {
  if (error) {
    App.log.error(error);
    process.exit(1);
  }
});

export default App;
