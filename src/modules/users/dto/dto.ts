export interface UserServiceDto {
  update(id: string, data: IUserDto): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  create (data:IUserDto) : Promise<IUserDto>
  magicAuth(token_auth: TokenAuth) : Promise<any>
  login(user: User): Promise<LoginResponse>
}
export interface IMagicAuth {
  token:string
} 

export interface IUserDto {
  id?: string;
  name: string;
  email: string;
  password: string;
  adress: string;
  contact: string;
  User?: string;
  status?: boolean;
  photo: string;
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
}

export type LoginResponse = {
  token: string;
  refresh_token: string;
  user: {
    id?: string;
    name: string;
    email: string;
    adress: string;
    photo: string;
    contact: string;
    User: string;
    status: boolean;
  };
};
