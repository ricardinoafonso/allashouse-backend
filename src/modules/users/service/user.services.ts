import { injectable, inject } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@shared/infra/database/prisma";
import {
  hashPassword,
  passwordCompare,
  token,
  token_refresh,
  userParserData,
  verify_token,
} from "@shared/util/util";
import { z } from "zod";
import { BadRequest, BaseError, NotAuthorized } from "@errors/Errors";
import {
  IUserDto,
  IUserDtoCreate,
  LoginResponse,
  TokenAuth,
  User,
  UserServiceDto,
} from "../dto/dto";
import {
  ItokenService as TokenService,
  TokenType,
} from "@modules/token/dto/dto";

@injectable()
export class UserService implements UserServiceDto {
  private Users: PrismaClient;
  constructor(@inject("Tokenservice") private tokenService: TokenService) {
    this.Users = prisma;
  }

  async create(data: IUserDtoCreate): Promise<IUserDto> {
    try {
      const user_parsedData = userParserData().parse(data);
      const user = await this.Users.users.findFirst({
        where: {
          email: user_parsedData.email,
        },
      });

      if (!user) {
        const password = await hashPassword(user_parsedData.password);
        const user = await this.Users.users.create({
          data: {
            name: user_parsedData.name,
            contact: user_parsedData.contact,
            adress: user_parsedData.adress,
            email: user_parsedData.email,
            password: password,
            photo: "",
            status: true,
            User: "user",
          },
        });
        return user;
      }
      throw new NotAuthorized(
        "email user already exists",
        "please try other email"
      );
    } catch (error: any) {
      throw new NotAuthorized(error.message, "");
    }
  }
  async update(id_: string, data: IUserDto): Promise<boolean> {
    try {
      const parsedData = userParserData().parse(data);
      const id_parse = z.object({
        id: z.string(),
      });
      const { id } = id_parse.parse({ id: id_ });
      const password = await hashPassword(parsedData.password);
      await this.Users.users.update({
        data: {
          name: parsedData.name,
          contact: parsedData.contact,
          adress: parsedData.adress,
          email: parsedData.email,
          password: password,
          status: true,
          User: "user",
        },
        where: {
          id: id,
        },
      });
      return true;
    } catch (error: any) {
      throw new BaseError(error.message, error.stack, "", error.status);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const delete_user = await this.Users.users.delete({ where: { id: id } });
      if (delete_user) {
        return true;
      }
      throw new BadRequest(
        "algo deu errado ao deletar user",
        "tente mais tarde"
      );
    } catch (error: any) {
      throw new BadRequest(error.message, "algo deu errado !");
    }
  }
  async magicAuth(token_auth: TokenAuth): Promise<any> {
    try {
      const parserData = z.object({
        refresh: z.string(),
      });
      const { refresh } = parserData.parse(token_auth);
      const { sub } = verify_token(refresh);

      const findTokenRefresh = await this.tokenService.find(refresh);

      if (!findTokenRefresh) {
        throw new NotAuthorized(
          "token not valid or invalid",
          "please check your details"
        );
      }

      const user = await this.Users.users.findFirst({
        where: { id: sub },
      });

      const { id: tokenId } = findTokenRefresh;
      const token_ = await token(sub);
      const refresh_token = token_refresh(sub);

      const delete_token = await this.tokenService.delete(tokenId);

      if (delete_token) {
        await this.tokenService.create({
          token: refresh_token,
          token_type: TokenType.REFRESH_AUTH,
          usersId: `${user.id}`,
        });
      }

      const { id, password, ...users } = user;
      return { token: token_, refresh_token: refresh_token, ...users };
    } catch (error: any) {
      throw new BadRequest(error.message, "algo deu errado !");
    }
  }
  async login(user: User): Promise<LoginResponse> {
    try {
      const parseData = z.object({
        email: z.string().email("email invalido"),
        password: z.string({ required_error: "campo obrigatorio" }),
      });
      const userDataValidated = parseData.parse(user);

      const findUser = await this.Users.users.findFirst({
        where: { email: userDataValidated.email },
      });
      if (findUser) {
        const compare_password = await passwordCompare(
          userDataValidated.password,
          findUser.password
        );
        if (!compare_password)
          throw new NotAuthorized(
            "email or password invalid",
            "please check your details"
          );

        const token_ = await token(findUser.id);
        const refresh_token = token_refresh(findUser.id);
        const { id, password, ...user_data } = findUser;

        await this.tokenService.create({
          token: refresh_token,
          token_type: TokenType.REFRESH_AUTH,
          usersId: `${id}`,
        });
        return { refresh_token: refresh_token, token: token_, user: user_data };
      }
      throw new NotAuthorized("email or password invalid", " something wrong!");
    } catch (error: any) {
      throw new NotAuthorized(error.message, "something wrong !");
    }
  }
}
