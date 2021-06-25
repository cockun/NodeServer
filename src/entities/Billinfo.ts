export interface IBillinfo {
    ID: string;
    BILLID  : string;
    PRODUCTID  : string;  
    QUANTITY  : number;
    PRICE : number;
    
  }

  export class Billinfo implements IBillinfo {
    public ID: string;
    public BILLID : string;
    public PRODUCTID : string;  
    public QUANTITY : number;
    public PRICE : number;
  
  
  
    constructor(
      
      BillID  : string,
      ProductID  : string, 
      Quantity  : number,
      Price  : number,
    
    
    ) {
      this.ID = '2';
      this.BILLID = BillID;
      this.PRODUCTID= ProductID;
      this.QUANTITY= Quantity;
      this.PRICE= Price;
    
      }
  
  }