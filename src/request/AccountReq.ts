import { Helper } from "src/utils/Helper";

export interface IAccountReq {
  ID?: string;
  USERNAME?: string;
  PASSWORD?: string;
  FULLNAME?:string;
  ADDRESS?:string;
  PHONE?:string;
  ROLE?:string;
  PAGEINDEX?:number;
  PAGESIZE?:number;
  ORDERBYASC?: boolean;
  ORDERBYNAME?:string;
  

}

export class AccountReq implements IAccountReq {
  public ID?: string;
  public USERNAME?: string;
  public PASSWORD?: string;
  public FULLNAME?:string;
  public ADDRESS?:string;
  public PHONE?:string;
  public ROLE?:string;
  public PAGEINDEX?:number;
  public PAGESIZE?:number;
  public ORDERBYASC?: boolean;
  public ORDERBYNAME?:string;

  



}
