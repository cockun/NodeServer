import { Helper } from "src/utils/Helper";

export interface IAccountReq {
  id?: string;
  username?: string;
  password?: string;
  fullname?:string;
  address?:string;
  phone?:string;
  role?:string;
  
  
  

  

}

export class AccountReq implements IAccountReq {
  public id?: string;
  public username?: string;
  public password?: string;
  public fullname?:string;
  public address?:string;
  public phone?:string;
  public role?:string;
  



  constructor(
    username: string,
    password: string,
   
  
  
  ) {
    this.id = Helper.generateUID();
    this.username = username;
    this.password= password;
    }

}
