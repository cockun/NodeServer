export interface IProdctReq {

    ID?: string;
    NAME?: string;
    PRICE?: number;
    CATEGORY?: string;
    IMGSRC?: string;
    DISCOUNT?: number;
    DESCRIPTION?: string;
    SOLD? : number;
    
}
export class ProductReq implements IProdctReq {

    public ID?: string;
    public NAME?: string;
    public PRICE?: number;
    public CATEGORY?: string;
    public IMGSRC?: string;
    public DISCOUNT?: number;
    public DESCRIPTION?: string;
    public SOLD? : number

    
}