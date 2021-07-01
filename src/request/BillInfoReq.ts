import { Helper } from "../utils/Helper";

export interface IBillinfoReq {

  PRODUCTID: string;
  QUANTITY: number;
}

export class BillinfoReq implements IBillinfoReq {
  public PRODUCTID: string;
  public QUANTITY: number;

  constructor(ProductID: string, Quantity: number) {
    this.PRODUCTID = ProductID;
    this.QUANTITY = Quantity;
  }
}
