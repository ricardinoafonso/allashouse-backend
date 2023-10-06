import { IUserDto } from "../service/user.services";

export interface UserServiceDto {
  update(id: string, data: IUserDto): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  create (data:IUserDto) : Promise<IUserDto>
}
