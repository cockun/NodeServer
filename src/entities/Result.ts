import { Helper } from "src/utils/Helper";
import { isBuffer } from "util";

export class Result<T> {
  public err?: string | null;
  public data: T | null;
  public count: number | null;

  constructor(data: T | undefined | null, err?: string | undefined, count = 0) {
    this.err = err;
    this.count = count;
    if (data) {
      this.data = data;
    } else {
      this.data = null;
    }
  }
}
