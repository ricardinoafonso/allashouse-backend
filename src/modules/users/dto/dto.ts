import { IUserDto, LoginResponse, TokenAuth, User } from "../service/user.services";

export interface UserServiceDto {
  update(id: string, data: IUserDto): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  create (data:IUserDto) : Promise<IUserDto>
  magicAuth(token_auth: TokenAuth) : Promise<any>
  login(user: User): Promise<LoginResponse>
}
