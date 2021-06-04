export interface IAccount {
  id?: string;
  username?: string;
  password?: string;
  fullname?: string;
  address?: string;
  phone?: number;
  authority?: string;

}

export class Account implements IAccount {
  public id?: string;
  public username?: string;
  public password?: string;
  public fullname?: string;
  public address?: string;
  public phone?: number;
  public authority?: string;



  constructor(
     username: string,
     password: string,
     fullname: string,
     address: string,
     phone: number,
     authority: string
  
  
  ) {
    this.id = '2';
    this.username = username;
    this.password= password;
    this.fullname= fullname;
    this.address= address;
    this.phone= phone;
    this.authority= authority;
    }

}
