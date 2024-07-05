import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadModule } from './core/upload/upload.module';
import { DashboardsModule } from './dashboards/dashboards.module';

@Module({
  imports: [PrismaModule, EmployeeModule, UploadModule, DashboardsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
