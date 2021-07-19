export interface IMomoReq {
  accessKey: string;
  partnerCode: string;
  requestType?: string;
  notifyUrl: string;
  returnUrl: string;
  orderId: string;
  amount: string;
  orderInfo: string;
  requestId: string;
  extraData: string;
  signature?: string;
}
export class MomoReq implements IMomoReq {
  public accessKey: string;
  public partnerCode: string;
  public requestType?: string;
  public notifyUrl: string;
  public returnUrl: string;
  public orderId: string;
  public amount: string;
  public orderInfo: string;
  public requestId: string;
  public extraData: string;
  public signature?: string;

  constructor(data: IMomoReq) {
    this.accessKey = data.accessKey;
    this.partnerCode = data.partnerCode;
    this.requestType = data.requestType;
    this.notifyUrl = data.notifyUrl;
    this.returnUrl = data.returnUrl;
    this.orderId = data.orderId;
    this.amount = data.amount;
    this.orderInfo = data.orderInfo;
    this.requestId = data.requestId;
    this.extraData = data.extraData;
    this.signature = data.signature;
  }

  public getString(): string {
    // eslint-disable-next-line max-len
    return `partnerCode=${this.partnerCode}&accessKey=${this.accessKey}&requestId=${this.requestId}&amount=${this.amount}&orderId=${this.orderId}&orderInfo=${this.orderInfo}&returnUrl=${this.returnUrl}&notifyUrl=${this.notifyUrl}&extraData=${this.extraData}`;

  }
}
