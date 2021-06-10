import { Helper } from "src/utils/Helper";

export interface IRole {
  id: string;
  roleName: string;
  

}

export class Role implements IRole {
  public id: string;
  public roleName: string;

  



  constructor(

    roleName: string,
   
  
  
  ) {
    this.id = Helper.generateUID();
    this.roleName = roleName;
   
    }

}
