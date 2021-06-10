import { Helper } from "src/utils/Helper";

export interface IAccount {
  id: string;
  username: string;
  password: string;
  

}

export class Account implements IAccount {
  public id: string;
  public username: string;
  public password: string;
  



  constructor(
    username: string,
    password: string,
   
  
  
  ) {
    this.id = Helper.generateUID();
    this.username = username;
    this.password= password;
    }

}
