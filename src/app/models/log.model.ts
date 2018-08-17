import { Type, Expose } from "class-transformer";

export class Log {

  id: number;
  requestID: number;
  logTemplateID: number;
  stepID: number;
  description: string;
  itemString: string;
  note: string;

  @Expose()
  get detail() {
    if (!this.itemString) {
      return null;
    }
    return this.itemString.split("!");
  }

  @Expose({name: 'created_at'})
  @Type(() => Date)
  date: Date;

}
