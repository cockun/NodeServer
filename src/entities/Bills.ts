import { BillReq } from "src/request/BillReq";
import { Helper } from "src/utils/Helper";

export interface IBill {
    ID: string;
    TOTAL ?: number;
    DATEBUY ?: string;  
    FULLNAME ?: string;
    PHONE ?: string;
    ADDRESS ?: string;
    ACCOUNTID ?: string;
    BILLSTATUS ?: string;    
  }
  export class Bill implements IBill {
    public ID: string;
    public TOTAL ?: number;
    public DATEBUY ?: string;  
    public FULLNAME ?: string;
    public PHONE ?: string;
    public ADDRESS ?: string;
    public ACCOUNTID ?: string;
    public BILLSTATUS ?: string;  
  
    
  
  
    constructor(
      billReq : BillReq
    
    ) {
        this.ID = Helper.generateUID();
        this.TOTAL = billReq.TOTAL?billReq.TOTAL:0;
        this.DATEBUY = billReq.DATEBUY?billReq.DATEBUY:"";
        this.FULLNAME = billReq.FULLNAME?billReq.FULLNAME:"";
        this.PHONE = billReq.PHONE?billReq.PHONE:"";
        this.ADDRESS = billReq.ADDRESS?billReq.ADDRESS:"";
        this.ACCOUNTID = billReq.ACCOUNTID?billReq.ACCOUNTID:"";
        this.BILLSTATUS = billReq.BILLSTATUS?billReq.BILLSTATUS:"";
    }
  
  }