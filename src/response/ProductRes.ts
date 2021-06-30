import { ICategory } from "../entities/Categories";

import { IProduct } from "../entities/Product";
export interface IProductRes {
    ID: string;
    NAME: string;
    PRICE: number;
    CATEGORY: ICategory;
    IMGSRC: string;
    DISCOUNT: number;
    DESCRIPTION: string;
    SOLD : number

  }
  
  export class ProductRes implements IProductRes {
    public ID: string;
    public NAME: string;
    public PRICE: number;
    public CATEGORY: ICategory;
    public IMGSRC: string;
    public DISCOUNT: number;
    public DESCRIPTION: string;
    public SOLD : number

  
    constructor (
      product: IProduct,
      category:ICategory
    ) 
    {
        this.ID = product.ID;
        this.NAME= product.NAME;
        this.PRICE=  product.PRICE;
        this.CATEGORY= category ;
        this.IMGSRC= product.IMGSRC ;
        this.DISCOUNT=  product.DISCOUNT;
        this.DESCRIPTION=  product.DESCRIPTION;
        this.SOLD =  product.SOLD
      
    }
  
    
  }
  