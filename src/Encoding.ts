/* tslint:disable max-classes-per-file */
import { decompressJson } from './utils';

import AllEncodingsCompressed from './all-encodings.compressed.json';

const decompressedEncodings = decompressJson(AllEncodingsCompressed);

type EncodingCharCode = number;
type EncodingCharName = string;
interface IUnicodeMappings {
  [unicodeCodePoint: number]: [EncodingCharCode, EncodingCharName];
}

const allUnicodeMappings: {
  symbol: IUnicodeMappings;
  zapfdingbats: IUnicodeMappings;
  win1252: IUnicodeMappings;
} = JSON.parse(decompressedEncodings);

type EncodingNames = 'Symbol' | 'ZapfDingbats' | 'WinAnsi';

class Encoding {
  name: EncodingNames;
  private unicodeMappings: IUnicodeMappings;

  constructor(name: EncodingNames, unicodeMappings: IUnicodeMappings) {
    this.name = name;
    this.unicodeMappings = unicodeMappings;
  }

  canEncodeUnicodeCodePoint = (codePoint: number) =>
    codePoint in this.unicodeMappings;

  encodeUnicodeCodePoint = (codePoint: number) => {
    const mapped = this.unicodeMappings[codePoint];
    if (!mapped) {
      const str = String.fromCharCode(codePoint);
      const msg = `${this.name} cannot encode "${str}" (0x${codePoint.toString(16).padStart(2, '0')})`;
      throw new Error(msg);
    }
    return { code: mapped[0], name: mapped[1] };
  };
}

export type IEncoding = Encoding;

export const Encodings = {
  Symbol: new Encoding('Symbol', allUnicodeMappings.symbol),
  ZapfDingbats: new Encoding('ZapfDingbats', allUnicodeMappings.zapfdingbats),
  WinAnsi: new Encoding('WinAnsi', allUnicodeMappings.win1252),
};
