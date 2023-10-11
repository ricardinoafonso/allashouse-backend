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
  update(data: TokenDto): Promise<TokenResponse>;
  delete(id: string): Promise<boolean>;
  find(id: string) : Promise<any>;
}
export interface TokenResponse {
  token: string;
  refresh: string;
}

export enum TokenType {
  REFRESH_AUTH = "REFRESH_AUTH",
  VERIFICATION = "VERIFICATION",
  TOKEN_AUTH = "TOKEN_AUTH",
}
