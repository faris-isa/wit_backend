import { Controller, Get, Param, Res } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { ExcludeGlobalGuard } from '../decorator/exclude-global-decorator';

@Controller('uploads')
export class UploadController {
  @ExcludeGlobalGuard()
  @Get('/employee/:filename')
  getFileImages(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(
      __dirname,
      '../../../uploads/employee/',
      filename,
    );

    const fileExt = path.extname(filename).toLowerCase();

    if (!fs.existsSync(filePath)) {
      return { message: 'File not found' };
    }

    let contentType = '';

    switch (fileExt) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    res.setHeader('Content-Type', contentType);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}
