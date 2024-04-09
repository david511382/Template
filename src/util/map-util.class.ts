export class MapUtil {
  static checkMapEqual<K, V>(actualMap: Map<K, V>, expectMap: Map<K, V>) {
    const actuals = this.parseMapToArrays(actualMap);
    const f = (a, b) => {
      const as = String(a.key);
      const bs = String(b.key);
      const cfn = (i: number) => {
        const av = i < as.length ? as.charCodeAt(i) : 0;
        const bv = i < bs.length ? bs.charCodeAt(i) : 0;
        return av - bv;
      };
      let i = 0;
      for (; i < as.length; i++) {
        const r = cfn(i);
        if (r === 0) continue;
        return r;
      }
      for (; i < bs.length; i++) {
        const r = cfn(i);
        if (r === 0) continue;
        return r;
      }
      return 0;
    };
    actuals.sort(f);
    const expects = this.parseMapToArrays(expectMap);
    expects.sort(f);
    expect(actuals).toStrictEqual(expects);
  }

  static parseMapToArrays<K, V>(map: Map<K, V>): { key: K; value: V }[] {
    const pairs = [];
    map.forEach((v, k) => {
      pairs.push({ key: k, value: v });
    });
    return pairs;
  }
}
