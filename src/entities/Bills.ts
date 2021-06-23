export interface IBill {
    id: string;
    total ?: number;
    dateBuy ?: string;  
    fullname ?: string;
    phone ?: number;
    address ?: string;
    username ?: string;  
  }
  export class Bill implements IBill {
    public id: string;
    public total ?: number;
    public dateBuy ?: string;  
    public fullname ?: string;
    public phone ?: number;
    public address ?: string;
    public username ?: string;  
  
  
  
    constructor(
        total : number,
        dateBuy : string,
        fullname : string,
        phone : number,
        address : string,
        username : string,  
    
    
    ) {
      this.id = '2';
      this.total = total;
      this.dateBuy= dateBuy;
      this.fullname= fullname;
      this.phone= phone;
      this.address= address;
      this.username= username;
      }
  
  }