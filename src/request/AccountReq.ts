import { Helper } from "src/utils/Helper";

export interface IAccountReq {
  ID?: string;
  USERNAME?: string;
  PASSWORD?: string;
  FULLNAME?:string;
  ADDRESS?:string;
  PHONE?:string;
  ROLE?:string;
  
  
  

  

}

export class AccountReq implements IAccountReq {
  public ID?: string;
  public USERNAME?: string;
  public PASSWORD?: string;
  public FULLNAME?:string;
  public ADDRESS?:string;
  public PHONE?:string;
  public ROLE?:string;
  



  constructor(
    USERNAME: string,
    PASSWORD: string,
   
  
  
  ) {
    this.ID = Helper.generateUID();
    this.USERNAME = USERNAME;
    this.PASSWORD= PASSWORD;
    }

}
