import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FormatResponseInterceptor } from './core/interceptors';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

function errorFormatter(
  errors: ValidationError[],
  errMessage?: any,
  parentField?: string,
) {
  const message = errMessage || [];
  let errField = '';
  let validationList: any;

  errors.forEach((error) => {
    errField = parentField
      ? `${parentField}.${error.property}`
      : error?.property;
    if (!error?.constraints && error?.children?.length) {
      errorFormatter(error.children, message, errField);
    } else {
      validationList = Object.values(error?.constraints ?? {});
      if (validationList.length > 0) {
        message.push({
          property: errField,
          message: validationList.pop(),
        });
      } else {
        message.push({
          message: 'Invalud value!',
        });
      }
    }
  });

  return message;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errorFormatter(errors);
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  app.useGlobalInterceptors(new FormatResponseInterceptor());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
