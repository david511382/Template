import { ParserDto } from "../dto/parser.dto";

export type ParserFn = (dto: ParserDto) => void

export interface IParserFactory {
  create(meta: Record<string, string>): ParserFn
}

export const IParserFactoryType = Symbol('IParserFactory');
