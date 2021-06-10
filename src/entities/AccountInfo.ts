import RoleDao from "@daos/Account/Role";
import { AccountReq } from "src/request/AccountReq";
import { Helper } from "src/utils/Helper";

export interface IAccountInfo {
  id: string;
  accountId : string ;
  roleId:string ;
  fullname: string;
  address: string;
  phone: string;
  points: number;
  createDate: Date;
}

export class AccountInfo implements IAccountInfo {
  public id: string;
  public roleId : string ;
  public accountId : string ;
  public fullname: string;
  public address: string;
  public phone: string;
  public points: number;
  public createDate: Date;

  constructor(accountReq : AccountReq) {
    this.accountId  = accountReq.id?accountReq.id:"";
    this.id=Helper.generateUID()
    this.fullname=accountReq.fullname?accountReq.fullname:"";
    this.address=accountReq.address?accountReq.address:"";
    this.phone  = accountReq.phone?accountReq.phone:"";
    this.points = 0;
    this.roleId = "";
    this.createDate= new Date(Date.now());
    
  

  }
}
