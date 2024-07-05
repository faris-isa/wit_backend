import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum EnumStatus {
  KONTRAK = 'KONTRAK',
  TETAP = 'TETAP',
  PROBATION = 'PROBATION',
}

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  nomor: string;

  @IsString()
  @IsNotEmpty()
  jabatan: string;

  @IsString()
  @IsNotEmpty()
  departemen: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal_masuk: string;

  @IsString()
  @IsOptional()
  foto: string;

  @IsEnum(EnumStatus)
  @IsNotEmpty()
  status: 'KONTRAK' | 'TETAP' | 'PROBATION';
}
