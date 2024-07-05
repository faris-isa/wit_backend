import { diskStorage } from 'multer';
import fs from 'fs';
import { promisify } from 'util';

// export const storage = diskStorage({
//   destination: './uploads/image',
//   filename: (req, file, cb) => {
//     const filename: string = file.originalname
//       .split('.')[0]
//       .replace(/\s+/g, '-');
//     const extension: string = extname(file.originalname);
//     const randomName: string = new Date().toISOString().substring(0, 10);
//     cb(null, `${filename}-${randomName}${extension}`);
//   },
// });

export const storage = (dir: string) =>
  diskStorage({
    destination: `./uploads/${dir}`,
    filename: (req, file, cb) => {
      const originalExtension = file.originalname.split('.').pop();
      const timestamp = Date.now();
      const filenameWithTimestamp = `${dir}_${timestamp}.${originalExtension}`;
      cb(null, `${filenameWithTimestamp}`);
    },
  });

export const checkIfFileOrDirectoryExists = (path: string): boolean => {
  return fs.existsSync(path);
};

export const getFile = async (
  path: string,
  encoding: any,
): Promise<string | Buffer> => {
  const readFile = promisify(fs.readFile);

  return encoding ? readFile(path, encoding) : readFile(path, {});
};
export const createFile = async (
  path: string,
  fileName: string,
  data: string,
): Promise<void> => {
  if (!checkIfFileOrDirectoryExists(path)) {
    fs.mkdirSync(path);
  }

  const writeFile = promisify(fs.writeFile);

  return await writeFile(`${path}/${fileName}`, data, 'utf8');
};

export const deleteFile = async (path: string): Promise<void> => {
  const unlink = promisify(fs.unlink);

  return await unlink(path);
};
