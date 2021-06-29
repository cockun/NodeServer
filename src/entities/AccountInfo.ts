import RoleDao from "@daos/Account/Role";
import { AccountReq } from "src/request/AccountReq";
import { Helper } from "src/utils/Helper";

export interface IAccountInfo {
  ID: string;
  ACCOUNTID : string ;
  ROLEID:string ;
  FULLNAME: string;
  ADDRESS: string;
  PHONE: string;
  POINTS: number;
  CREATEDATE: Date;
}

export class AccountInfo implements IAccountInfo {
  public ID: string;
  public ROLEID : string ;
  public ACCOUNTID : string ;
  public FULLNAME: string;
  public ADDRESS: string;
  public PHONE: string;
  public POINTS: number;
  public CREATEDATE: Date;

  constructor(accountReq : AccountReq) {
    this.ACCOUNTID  = accountReq.ID?accountReq.ID:"";
    this.ID=Helper.generateUID()
    this.FULLNAME=accountReq.FULLNAME?accountReq.FULLNAME:"";
    this.ADDRESS=accountReq.ADDRESS?accountReq.ADDRESS:"";
    this.PHONE  = accountReq.PHONE?accountReq.PHONE:"";
    this.POINTS = 0;
    this.ROLEID = accountReq.ROLE??"";
    this.CREATEDATE= new Date(Date.now());
    
  

  }
}
