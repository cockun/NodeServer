import { Helper } from "../utils/Helper";

export interface ICategory {
    ID: string;
    CATEGORYNAME : string;
    
  }
  export class Category implements ICategory{
    public ID: string;
    public CATEGORYNAME : string;
  
  
    constructor(
      
        CategoryName   : string,
    
    
    ) {
      this.ID = Helper.generateUID(); 
      this.CATEGORYNAME = CategoryName;
      
      }
  
  }