import { ProductReq } from "src/request/ProductReq";
import { Helper } from "../utils/Helper";
import { Category, ICategory } from "./Categories";

export interface IProduct {
    ID: string;
    NAME: string;
    PRICE: number;
    CATEGORYID: string;
    IMGSRC: string;
    DISCOUNT: number;
    DESCRIPTION: string;
    SOLD : number
  
  }
  
  export class Product implements IProduct {
    public ID: string;
    public NAME: string;
    public PRICE: number;
    public CATEGORYID: string;
    public IMGSRC: string;
    public DISCOUNT: number;
    public DESCRIPTION: string;
    public SOLD : number;
    public CREATEDATE : Date; 
  
  
  
    constructor(

     productReq : ProductReq
    
    
    ) {
    
        this.ID = Helper.generateUID();
        this.NAME = productReq.NAME?productReq.NAME:"";
        this.PRICE = productReq.PRICE?productReq.PRICE:0;
        this.CATEGORYID = productReq.CATEGORYID?productReq.CATEGORYID:'';
      
        this.IMGSRC = productReq.IMGSRC?productReq.IMGSRC:"";
        this.DISCOUNT = productReq.DISCOUNT?productReq.DISCOUNT:0;
        this.DESCRIPTION = productReq.DESCRIPTION?productReq.DESCRIPTION:"";
        this.SOLD  =0;
        this.CREATEDATE = new Date(Date.now());
      }
  
  }
  