export interface IProduct {
    id?: string;
    name?: string;
    price?: number;
    category?: string;
    imgsrc?: string;
    discount?: number;
    description?: string;
    sold ?: number
  
  }
  
  export class Product implements IProduct {
    public id?: string;
    public name?: string;
    public price?: number;
    public category?: string;
    public imgsrc?: string;
    public discount?: number;
    public description?: string;
    public sold ?: number
  
  
  
    constructor(
     id: string,
     name: string,
     price: number,
     category: string,
     imgsrc: string,
     discount: number,
     description: string,
     sold : number
    
    
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.imgsrc = imgsrc;
        this.discount = discount;
        this.description = description;
        this.sold  = sold
      }
  
  }
  