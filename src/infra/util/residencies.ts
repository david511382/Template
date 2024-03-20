export class Residencies {
  private static readonly codeMap: Map<string, boolean> = new Map();

  static exists(code: string): boolean {
    this.sureInited();

    return this.codeMap.has(code);
  }

  private static init() {
    // 4 char
    const countryCodes = require('country-codes-list');
    const countrys = countryCodes.customArray();
    countrys.forEach((c) => {
      this.codeMap.set(c.value, true);
    });
  }

  private static sureInited() {
    if (this.codeMap.size === 0) this.init();
  }
}
