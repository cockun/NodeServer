import UUID from "uuid-js"

export class Helper {
  public static upcaseKey(obj: any) {
    let result = {} as any;
    for (let key in obj) {
      result[key.toUpperCase()] = obj[key];
    }
    return result;
  }
  public static generateUID() : string{
      let uid = UUID.create();
      return uid.toString()
  }
}

