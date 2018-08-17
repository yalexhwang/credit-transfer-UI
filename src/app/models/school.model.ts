import { Expose } from "class-transformer";

export class School {
  id: number;
  international: boolean;
  name: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
  website: string;
}
