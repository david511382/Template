import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { IConfig } from '../../config/interface/config.interface';

export const corsOptions = ({ http }: IConfig): CorsOptions => ({
  origin: http.cors.origins,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
});
