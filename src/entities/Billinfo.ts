export interface IBillinfo {
    id?: string;
    BillID  ?: string;
    ProductID  ?: string;  
    Quantity  ?: number;
    Price  ?: number;
    
  }

  export class Billinfo implements IBillinfo {
    public id?: string;
    public BillID  ?: string;
    public ProductID  ?: string;  
    public Quantity  ?: number;
    public Price  ?: number;
  
  
  
    constructor(
      
      BillID  : string,
      ProductID  : string, 
      Quantity  : number,
      Price  : number,
    
    
    ) {
      this.id = '2';
      this.BillID = BillID;
      this.ProductID= ProductID;
      this.Quantity= Quantity;
      this.Price= Price;
    
      }
  
  }