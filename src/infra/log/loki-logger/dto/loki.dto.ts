export class LokiStreamsDto {
    stream: Record<string, string>
    values: string[][]
}

export class LokiDto {
    streams: LokiStreamsDto[]
}
