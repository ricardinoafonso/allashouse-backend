import { injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@shared/infra/database/prisma";
import {
  ItokenService as ITokenService,
  TokenDto,
  TokenResponse,
  TokenType,
} from "../dto/dto";
import { z } from "zod";
import { BadRequest } from "@errors/Errors";
import { token, token_refresh } from "@shared/util/util";

@injectable()
export class TokenService implements ITokenService {
  private TokenRepository: PrismaClient;
  constructor() {
    this.TokenRepository = prisma;
  }
  async create(data: TokenDto): Promise<TokenDto> {
    try {
      const dataParsed = z.object({
        token_type: z.string(),
        token: z.string(),
        usersId: z.string(),
      });
      const { token_type, token, usersId } = dataParsed.parse(data);
      const token_ = await this.TokenRepository.token.create({
        data: {
          token_type,
          token,
          usersId: usersId,
        },
      });
      return token_;
    } catch (error: any) {
      throw new BadRequest(error.message, "something wrong !");
    }
  }
  async update(data: TokenDto): Promise<TokenResponse> {
    try {
      const token_ = await this.TokenRepository.token.findFirst({
        where: { token: data.token },
      });

      if (!token_) {
        throw new BadRequest(
          "Invalid token, or token not found",
          "please login now"
        );
      }
      const newTokenRefresh = token_refresh(`${data.usersId}`);
      const newToken = await token(`${data.usersId}`);
      await this.TokenRepository.token.update({
        data: {
          token: newTokenRefresh,
          token_type: TokenType.REFRESH_AUTH,
        },
        where: { usersId: `${data.usersId}` },
      });
      return { token: newToken, refresh: newTokenRefresh };
    } catch (error: any) {
      throw new BadRequest(error.message, "something wrong !");
    }
  }
  async delete(id: string): Promise<boolean> {
    try {
      const deleteToken = await this.TokenRepository.token.delete({
        where: { id: id },
      });
      if (deleteToken) {
        return true;
      }
      return false;
    } catch (error: any) {
      throw new BadRequest(error.message, "something wrong !");
    }
  }
}
