import { Module } from '@nestjs/common';
import { FirewallModule } from '../../infra/firewall/firewall.module';
import { HttpModule } from '@nestjs/axios';
import { CommonService } from './common.service';
import { DbModule } from '../../infra/db/db.module';
import { LoginRequirementFactory } from '../login-requirement-factory';

@Module({
  imports: [HttpModule, FirewallModule, DbModule],
  providers: [LoginRequirementFactory, CommonService],
  exports: [CommonService],
})
export class CommonModule {}
