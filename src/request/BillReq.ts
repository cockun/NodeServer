export interface IBillReq {

    ID?: string;
    TOTAL?: number;
    DATEBUY?: string;
    FULLNAME?: string;
    PHONE?: string;
    ADDRESS?: string;
    ACCOUNTID?: string;
    BILLSTATUS? : string
    
}
export class BillReq implements IBillReq {

    public ID?: string;
    public TOTAL?: number;
    public DATEBUY?: string;
    public FULLNAME?: string;
    public PHONE?: string;
    public ADDRESS?: string;
    public ACCOUNTID?: string;
    public BILLSTATUS? : string
  
}