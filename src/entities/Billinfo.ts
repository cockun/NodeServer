import { Helper } from "../utils/Helper";

export interface IBillInfo {
    ID: string;
    BILLID  : string;
    PRODUCTID  : string;  
    PRODUCTNAME: string;
    QUANTITY  : number;
    PRICE : number;
    
  }

  export class BillInfo implements IBillInfo {
    public ID: string;
    public BILLID : string;
    public PRODUCTID : string;  
    public PRODUCTNAME: string;
    public QUANTITY : number;
    public PRICE : number;
  
  
  
    constructor(
      
      BillID  : string,
      ProductID  : string, 
      PRODUCTNAME:string,
      Quantity  : number,
      Price  : number,

    
    
    ) {
      
      this.ID = Helper.generateUID();
      this.BILLID = BillID;
      this.PRODUCTID= ProductID;
      this.PRODUCTNAME = PRODUCTNAME;
      this.QUANTITY= Quantity;
      this.PRICE= Price;
    
      }
  
  }