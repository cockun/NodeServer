import { ProductReq } from "src/request/ProductReq";
import { Helper } from "src/utils/Helper";

export interface IProduct {
    ID: string;
    NAME: string;
    PRICE: number;
    CATEGORY: string;
    IMGSRC: string;
    DISCOUNT: number;
    DESCRIPTION: string;
    SOLD : number
  
  }
  
  export class Product implements IProduct {
    public ID: string;
    public NAME: string;
    public PRICE: number;
    public CATEGORY: string;
    public IMGSRC: string;
    public DISCOUNT: number;
    public DESCRIPTION: string;
    public SOLD : number
  
  
  
    constructor(

     productReq : ProductReq
    
    
    ) {
        this.ID = Helper.generateUID();
        this.NAME = productReq.NAME?productReq.NAME:"";
        this.PRICE = productReq.PRICE?productReq.PRICE:0;
        this.CATEGORY = productReq.CATEGORY?productReq.CATEGORY:"";
        this.IMGSRC = productReq.IMGSRC?productReq.IMGSRC:"";
        this.DISCOUNT = productReq.DISCOUNT?productReq.DISCOUNT:0;
        this.DESCRIPTION = productReq.DESCRIPTION?productReq.DESCRIPTION:"";
        this.SOLD  = productReq.SOLD?productReq.SOLD:0;
      }
  
  }
  