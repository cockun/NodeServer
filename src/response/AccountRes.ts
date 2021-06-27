import { Helper } from "src/utils/Helper";

export interface IAccountRes {
  ID?: string;
  USERNAME?: string;
  FULLNAME?: string;
  ADDRESS?: string;
  PHONE?: string;
  ROLE?: string;
  POINTS?: number;
  CREATEDATE?: Date;
}

export class AccountRes implements IAccountRes {
  public ID?: string;
  public USERNAME?: string;
  public FULLNAME?: string;
  public ADDRESS?: string;
  public PHONE?: string;
  public ROLE?: string;
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
    this.ID = ID;
    this.USERNAME = USERNAME;
    this.FULLNAME = FULLNAME;
    this.ADDRESS = ADDRESS;
    this.PHONE = PHONE;
    this.ROLE = ROLE;
    this.POINTS = POINTS;
    this.CREATEDATE = CREATEDATE;
  }
}
