import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FormatResponseInterceptor } from './core/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new FormatResponseInterceptor());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
