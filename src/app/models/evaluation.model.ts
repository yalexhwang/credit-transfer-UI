import { Type } from "class-transformer";
import { Award } from './award.model';

export class Evaluation {

  id: number;
  requestID: number;
  proposedAwardIDs: string;
  finalAwardIDs: string;

  @Type(() => Award)
  proposed: Award[];
  @Type(() => Award)
  final: Award[];

}
