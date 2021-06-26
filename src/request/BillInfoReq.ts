import { Helper } from "../utils/Helper";

export interface IBillinfo {
   
    BILLID  : string;
    PRODUCTID  : string;  
    QUANTITY  : number;
    
  }

  export class Billinfo implements IBillinfo {

    public BILLID : string;
    public PRODUCTID : string;  
    public QUANTITY : number;
  
  
  
    constructor(
      
      BillID  : string,
      ProductID  : string, 
      Quantity  : number,
     
    
    
    ) {
    
      this.BILLID = BillID;
      this.PRODUCTID= ProductID;
      this.QUANTITY= Quantity;
      this.PRICE= Price;
    
      }
  
  }