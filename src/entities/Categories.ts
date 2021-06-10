export interface ICategory {
    id?: string;
    CategoryName   ?: string;
    
  }
  export class Category implements ICategory{
    public id?: string;
    public CategoryName   ?: string;
  
  
    constructor(
      
        CategoryName   : string,
    
    
    ) {
      this.id = '2';
      this.CategoryName = CategoryName;
      
      }
  
  }