import { BillInfo } from "../entities/Billinfo";
import { BillinfoReq } from "./BillInfoReq";

export interface IBillReq {
  ID?: string;
  TOTAL?: number;
  DATEBUY?: Date;
  FULLNAME?: string;
  PHONE?: string;
  ADDRESS?: string;
  ACCOUNTID?: string;
  BILLSTATUS?: string;
  BILLINFOS?: BillinfoReq[];
  PAGEINDEX?: number;
  PAGESIZE?: number;
  ORDERBYASC?: boolean;
  ORDERBYNAME?: string;
  FROMDATE?: Date;
  TODATE?: Date;
}
export class BillReq implements IBillReq {
  public ID?: string;
  public TOTAL?: number;
  public DATEBUY?: Date;
  public FULLNAME?: string;
  public PHONE?: string;
  public ADDRESS?: string;
  public ACCOUNTID?: string;
  public BILLSTATUS?: string;
  public BILLINFOS?: BillinfoReq[];
  public PAGEINDEX?: number;
  public PAGESIZE?: number;
  public ORDERBYASC?: boolean;
  public ORDERBYNAME?: string;
  public FROMDATE?: Date;
  public TODATE?: Date;
}
