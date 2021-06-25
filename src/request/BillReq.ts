import { Billinfo } from "../entities/Billinfo";

export interface IBillReq {

    ID?: string;
    TOTAL?: number;
    DATEBUY?: string;
    FULLNAME?: string;
    PHONE?: string;
    ADDRESS?: string;
    ACCOUNTID?: string;
    BILLSTATUS? : string
    BILLINFO? : Billinfo[]
    PAGEINDEX?:number;
    PAGESIZE?:number;
    ORDERBYASC?: boolean;
    ORDERBYNAME?:string;
}
export class BillReq implements IBillReq {

    public ID?: string;
    public TOTAL?: number;
    public DATEBUY?: string;
    public FULLNAME?: string;
    public PHONE?: string;
    public ADDRESS?: string;
    public ACCOUNTID?: string;
    public BILLSTATUS? : string;
    public BILLINFO? : Billinfo[]
    public PAGEINDEX?:number;
    public PAGESIZE?:number;
    public ORDERBYASC?: boolean;
    public ORDERBYNAME?:string;

    
  
  
  
}