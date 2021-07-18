import { BillReq } from "src/request/BillReq";
import { Helper } from "../utils/Helper";
import { IBillInfo } from "../entities/Billinfo";

export interface IBillRes {
    ID: string;
    TOTAL : number;
    DATEBUY : Date;  
    FULLNAME : string;
    PHONE : string;
    ADDRESS : string;
    ACCOUNTID : string;
    BILLSTATUS : string;    
  }
  export class BillRes implements IBillRes {
    public ID: string;
    public TOTAL : number;
    public DATEBUY : Date;  
    public FULLNAME : string;
    public PHONE : string;
    public ADDRESS : string;
    public ACCOUNTID : string;
    public BILLSTATUS : string;  
    public BILLINFOS: IBillInfo[];
    
  
  
    constructor(
      billReq : BillReq
    
    ) {
        this.ID = Helper.generateUID();
        this.TOTAL = billReq.TOTAL?billReq.TOTAL:0;
        this.DATEBUY = billReq.DATEBUY?billReq.DATEBUY:new Date(Date.now());
        this.FULLNAME = billReq.FULLNAME?billReq.FULLNAME:"";
        this.PHONE = billReq.PHONE?billReq.PHONE:"";
        this.ADDRESS = billReq.ADDRESS?billReq.ADDRESS:"";
        this.ACCOUNTID = billReq.ACCOUNTID?billReq.ACCOUNTID:"";
        this.BILLSTATUS = billReq.BILLSTATUS?billReq.BILLSTATUS:"";
        this.BILLINFOS =[];
    }
  
  }