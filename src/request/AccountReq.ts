import { Helper } from "../utils/Helper";

export interface IAccountReq {
  ID?: string;
  USERNAME?: string;
  PASSWORD?: string;
  FULLNAME?: string;
  ADDRESS?: string;
  PHONE?: string;
  ROLE?: string;
  SEX?: string;
  EMAIL?: string;
  BIRTHDAY?: Date | string;
  PAGEINDEX?: number;
  PAGESIZE?: number;
  ORDERBYASC?: boolean;
  ORDERBYNAME?: string;
  WALLET?: string;


}

export class AccountReq implements IAccountReq {
  public ID?: string;
  public USERNAME?: string;
  public PASSWORD?: string;
  public FULLNAME?: string;
  public ADDRESS?: string;
  public PHONE?: string;
  public ROLE?: string;
  public SEX?: string;
  public EMAIL?: string;
  public BIRTHDAY?: Date | string;
  public PAGEINDEX?: number;
  public PAGESIZE?: number;
  public ORDERBYASC?: boolean;
  public ORDERBYNAME?: string;




}
