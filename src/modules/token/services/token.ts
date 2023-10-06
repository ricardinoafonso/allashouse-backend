import { injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@shared/infra/database/prisma";
import { ItokenService as ITokenService, TokenDto } from "../dto/dto";
import { z } from "zod";
import { BadRequest } from "@errors/Errors";

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
        userId: z.string(),
      });
      const { token_type, token, userId } = dataParsed.parse(data);
      const token_ = await this.TokenRepository.token.create({
        data: {
          token_type,
          token,
          usersId: userId,
        },
      });
      return token_;
    } catch (error: any) {
      throw new BadRequest(error.message, "something wrong !");
    }
  }
  update(id: string, data: string): Promise<TokenDto> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
