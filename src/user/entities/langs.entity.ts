import { LangEnum } from '../enum/lang.enum';

export class Langs {
  public static readonly LIST: (readonly [string, LangEnum])[] = [
    ['Korean', LangEnum.Korean],
    ['English', LangEnum.En],
    ['简体中文', LangEnum.ZhCn],
    ['繁體中文', LangEnum.ZhTw],
    ['Japanese', LangEnum.Jp],
  ];

  private static readonly langMap: Map<string, string> = new Map(Langs.LIST);

  static get(): Map<string, string> {
    return this.langMap;
  }
}
