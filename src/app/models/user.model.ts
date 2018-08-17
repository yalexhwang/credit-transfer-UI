import { Type, Expose, Exclude } from "class-transformer";

export class User {

  id: number;
  username: string;
  gtID: number;
  name: string;
  email: string;
  role: {
    id: number;
    key: string;
    dept: boolean;
    registrar: boolean;
    student: boolean;
  }
  deptID: number;
  department: any;

  @Expose({name: 'created_at'})
  @Type(() => Date)
  created: Date;

  @Expose({name: 'updated_at'})
  @Type(() => Date)
  updated: Date;

  @Exclude()
  models;

  get isStudent() {
    return this.role.student ? true : false;
  }

  get isRegistrar() {
    return this.role.registrar ? true : false;
  }

  get isDept() {
    return this.role.dept ? true: false;
  }

  get lastName() {
    const arr = this.name.split(" ");
    return arr[arr.length - 1];
  }

}
