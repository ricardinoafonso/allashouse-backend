import { ItokenService } from "@modules/token/dto/dto";
import { TokenService } from "@modules/token/services/token";
import { UserServiceDto } from "@modules/users/dto/dto";
import { UserService } from "@modules/users/service/user.services";
import { container } from "tsyringe";

container.register<UserServiceDto>("userService", UserService);
container.register<ItokenService>('Tokenservice', TokenService)
