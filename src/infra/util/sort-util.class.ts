export class SortUtil {
  static compare(a: any, b: any): number {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    const as = JSON.stringify(a);
    const bs = JSON.stringify(b);
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
  }
}
