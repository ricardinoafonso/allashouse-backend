import { UserServiceDto } from "@modules/users/dto/dto";
import { UserService } from "@modules/users/service/user.services";
import { container } from "tsyringe";

container.register<UserServiceDto>("userService", UserService);
