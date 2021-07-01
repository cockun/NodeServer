import { Helper } from "../utils/Helper";

export interface IBillinfo {
    ID: string;
    BILLID  : string;
    PRODUCTID  : string;  
    PRODUCTNAME: string;
    QUANTITY  : number;
    PRICE : number;
    
  }

  export class Billinfo implements IBillinfo {
    public ID: string;
    public BILLID : string;
    public PRODUCTID : string;  
    public PRODUCTNAME: string;
    public QUANTITY : number;
    public PRICE : number;
  
  
  
    constructor(
      
      BillID  : string,
      ProductID  : string, 
      PRODUCTNMAE:string,
      Quantity  : number,
      Price  : number,

    
    
    ) {
      
      this.ID = Helper.generateUID();
      this.BILLID = BillID;
      this.PRODUCTID= ProductID;
      this.PRODUCTNAME = PRODUCTNMAE;
      this.QUANTITY= Quantity;
      this.PRICE= Price;
    
      }
  
  }