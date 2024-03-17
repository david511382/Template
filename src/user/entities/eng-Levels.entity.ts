import { EngLevelEnum } from '../enum/eng-level.enum';

export class EngLevels {
  public static readonly LIST: (readonly [string, EngLevelEnum])[] = [
    ['TOEIC < 650', EngLevelEnum.LOW],
    ['TOEIC 650-750', EngLevelEnum.AFD],
    ['TOEIC 750-860', EngLevelEnum.MID],
    ['TOEIC 860+', EngLevelEnum.ADV],
    ['IELTS 7.5+ / TOEFL 100+', EngLevelEnum.HADV],
    ['Native Speaker', EngLevelEnum.NativeSpeaker],
  ];

  private static readonly engLevelMap: Map<string, string> = new Map(
    EngLevels.LIST,
  );

  static get(): Map<string, string> {
    return this.engLevelMap;
  }
}
