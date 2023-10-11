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
import { UserServiceDto } from "../dto/dto";
import {
  ItokenService as TokenService,
  TokenType,
} from "@modules/token/dto/dto";
export interface IUserDto {
  id?: string;
  name: string;
  email: string;
  password: string;
  adress: string;
  contact: string;
  User?: string;
  status?: boolean;
}

export interface IUserDtoCreate {
  name: string;
  email: string;
  password: string;
  adress: string;
  contact: string;
}
export interface User {
  password: string;
  email: string;
}
enum UserType {
  admin = "admin",
  user = "user",
}

export interface TokenAuth {
  refresh?: string;
  userid?: string;
}

export type LoginResponse = {
  token: string;
  refresh_token: string;
  user: {
    id?: string;
    name: string;
    email: string;
    adress: string;
    contact: string;
    User: string;
    status: boolean;
  };
};

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
  async update(id_: string, data: User): Promise<boolean> {
    try {
      const parsedData = userParserData().parse(data);
      const id_parse = z.object({
        id: z.string(),
      });
      const { id } = id_parse.parse({ id: id_ });
      await this.Users.users.update({
        data: {
          name: parsedData.name,
          contact: parsedData.contact,
          adress: parsedData.adress,
          email: parsedData.email,
          password: parsedData.password,
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
  async magicAuth(token_auth: TokenAuth) : Promise<any> {
    try {
      const findToken = await this.tokenService.find(token_auth.refresh);
      if (!findToken) {
        throw new NotAuthorized(
          "token not valid or invalid",
          "please check your details"
        );
      }
        const { sub } = verify_token(findToken.token);
        const user = await this.Users.users.findFirst({
          where: { id: findToken.usersId },
        });
        const {id: tokenId} = findToken
        const token_ = await token(`${user.id}`);
        const refresh_token = token_refresh(user.id);

        await this.tokenService.create({
          token: refresh_token,
          token_type: TokenType.REFRESH_AUTH,
          usersId: `${user.id}`,
        });

      const { id,password ,...users } = user;
      return {token: token_, refresh:refresh_token, ...users}

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
