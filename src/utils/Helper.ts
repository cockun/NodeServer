import UUID from "uuid-js"

export class Helper {
 

  public static generateUID() : string{
      const uid = UUID.create();
      return uid.toString()
  }
}

