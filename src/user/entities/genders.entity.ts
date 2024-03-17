import { PairDto } from '../../common/dto/pair.dto';
import { GenderEnum } from '../enum/gender.enum';

export class Genders {
  public static readonly LIST: (readonly [string, GenderEnum])[] = [
    ['Male', GenderEnum.Male],
    ['Female', GenderEnum.Female],
    ['Other', GenderEnum.Other],
  ];

  private static readonly genderMap: Map<string, GenderEnum> = new Map(
    Genders.LIST,
  );

  static get(): Map<string, string> {
    return this.genderMap;
  }
}
