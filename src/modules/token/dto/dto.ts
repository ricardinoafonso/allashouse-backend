export interface TokenDto {
  id?: string;
  token_type?: string;
  token: string;
  usersId: String;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ItokenService {
  create(data: TokenDto): Promise<TokenDto>;
  update(id: string, data: string): Promise<TokenDto>;
  delete(id: string): Promise<boolean>;
}
