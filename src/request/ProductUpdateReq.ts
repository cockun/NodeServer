import { ICategory } from "../entities/Categories";
import { ProductReq } from "./ProductReq";

export interface IProductUpdateReq {

 
    NAME?: string;
    PRICE?: number;
    CATEGORYID?: string;
    IMGSRC?: string;
    DISCOUNT?: number;
    DESCRIPTION?: string;
    
    
}
export class ProductUpdateReq implements IProductUpdateReq {

   
    public NAME?: string;
    public PRICE?: number;
    public CATEGORYID?: string;
    public IMGSRC?: string;
    public DISCOUNT?: number;
    public DESCRIPTION?: string;
    
    constructor(productReq : ProductReq){
        this.NAME = productReq.NAME;
        this.PRICE = productReq.PRICE;
        this.CATEGORYID = productReq.CATEGORYID;
        this.IMGSRC = productReq.IMGSRC;
        this.DISCOUNT = productReq.DISCOUNT;
        this.DESCRIPTION  = productReq.DESCRIPTION;
    }
    
}