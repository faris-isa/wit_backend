import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');
    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          status: status,
          error: 'Bad Request',
          message: [
            {
              property: (exception.meta as { target: string[] }).target[0],
              message: (exception.meta?.target || '') + ' is already exists',
            },
          ],
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          status: status,
          message: message,
        });
        break;
      }
      case 'P2023': {
        const status = HttpStatus.BAD_REQUEST;
        const extendedMessage = message.includes('uuid')
          ? 'Invalid ID field'
          : message;
        response.status(status).json({
          status: status,
          message: extendedMessage,
        });
        break;
      }
      case 'P2003': {
        const status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          status: status,
          message: 'Invalid ID field',
        });
        break;
      }
      case 'P2021': {
        const status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          status: status,
          message: message,
        });
        break;
      }
      case 'P2007': {
        const status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          status: status,
          message: message,
        });
        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }
}
