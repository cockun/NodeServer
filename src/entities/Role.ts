import { Helper } from "../utils/Helper";

export interface IRole {
  ID: string;
  ROLENAME: string;
  

}

export class Role implements IRole {
  public ID: string;
  public ROLENAME: string;

  



  constructor(

    ROLENAME: string,
   
  
  
  ) {
    this.ID = Helper.generateUID();
    this.ROLENAME = ROLENAME;
   
    }

}
