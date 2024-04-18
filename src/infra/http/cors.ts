import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { IConfig } from '../../config/interface/config.interface';

export const corsOptions = ({ http }: IConfig): CorsOptions => ({
    origin: http.cors.origins,
    credentials: true,
});