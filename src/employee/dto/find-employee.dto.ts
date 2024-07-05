import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsOptional,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { EnumStatus } from './create-employee.dto';

export class FindEmployeeDTO {
  @IsOptional()
  @IsString()
  filter_search?: string;

  /** Show products in this page
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  /** Show this amount of products per page
   * @example 10
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  per_page?: number;

  @IsOptional()
  @IsString()
  filter_departemen?: string;

  @IsEnum(EnumStatus)
  @IsOptional()
  filter_status?: 'KONTRAK' | 'TETAP' | 'PROBATION';
}
