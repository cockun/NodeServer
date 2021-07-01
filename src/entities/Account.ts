import { Helper } from "src/utils/Helper";
import md5 from "md5";
export interface IAccount {
  ID: string;
  USERNAME: string;
  PASSWORD: string;
  

}

export class Account implements IAccount {
  public ID: string;
  public USERNAME: string;
  public PASSWORD: string;
  



  constructor(
    USERNAME: string,
    PASSWORD: string,
   
  
  
  ) {
    this.ID = Helper.generateUID();
    this.USERNAME = USERNAME;
    this.PASSWORD= md5(PASSWORD) ;
    }

}
