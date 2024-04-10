import { LogLevelNameEnum } from "../enum/log-level.enum"

export class MsgDto {
    level: LogLevelNameEnum
    msg: string
    optionalParams: any[]
}

export class ParserDto {
    msgs: MsgDto[]
}
