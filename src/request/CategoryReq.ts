import { Helper } from "../utils/Helper";

export interface ICategoryReq {
    ID?: string;
    CATEGORYNAME ?: string;
    PAGEINDEX?:number;
    PAGESIZE?:number;
    
  }
  export class CategoryReq implements ICategoryReq{
    public ID?: string;
    public CATEGORYNAME? : string;
    PAGEINDEX?:number;
    PAGESIZE?:number;
  
    constructor(
      
        CategoryName   : string,
    
    
    ) {
      this.ID = Helper.generateUID(); 
      this.CATEGORYNAME = CategoryName;
      
      }
  
  }