import { ICategory } from "../entities/Categories";

export interface IProdctReq {

    ID?: string;
    NAME?: string;
    PRICE?: number;
    CATEGORY?: ICategory;
    IMGSRC?: string;
    DISCOUNT?: number;
    DESCRIPTION?: string;
    SOLD? : number;
    PAGEINDEX?:number;
    PAGESIZE?:number;
    ORDERBYASC?: boolean;
    ORDERBYNAME?:string;
    
}
export class ProductReq implements IProdctReq {

    public ID?: string;
    public NAME?: string;
    public PRICE?: number;
    public CATEGORY?: ICategory;
    public IMGSRC?: string;
    public DISCOUNT?: number;
    public DESCRIPTION?: string;
    public SOLD? : number;
    public PAGEINDEX?:number;
    public PAGESIZE?:number;
    public ORDERBYASC?: boolean;
    public ORDERBYNAME?:string;

    
}