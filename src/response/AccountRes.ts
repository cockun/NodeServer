import { Helper } from "src/utils/Helper";

export interface IAccountRes {
  ACCOUNTID?: string;
  USERNAME?: string;
  FULLNAME?: string;
  ADDRESS?: string;
  PHONE?: string;
  ROLENAME?: string;
  POINTS?: number;
  CREATEDATE?: Date;
}

export class AccountRes implements IAccountRes {
  public ACCOUNTID?: string;
  public USERNAME?: string;
  public FULLNAME?: string;
  public ADDRESS?: string;
  public PHONE?: string;
  public ROLENAME?: string;
  public POINTS?: number;
  public CREATEDATE?: Date;

  constructor(
    ID?: string,
    USERNAME?: string,
    FULLNAME?: string,
    ADDRESS?: string,
    PHONE?: string,
    ROLE?: string,
    POINTS?: number,
    CREATEDATE?: Date
  ) {
    this.ACCOUNTID = ID;
    this.USERNAME = USERNAME;
    this.FULLNAME = FULLNAME;
    this.ADDRESS = ADDRESS;
    this.PHONE = PHONE;
    this.ROLENAME = ROLE;
    this.POINTS = POINTS;
    this.CREATEDATE = CREATEDATE;
  }
}
