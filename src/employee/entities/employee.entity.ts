import { Expose, Type } from 'class-transformer';

export class EmployeeEntity {
  foto: string;

  @Type(() => Number)
  nomor: number;

  @Expose({ name: 'foto_url' })
  getPhotoUrl() {
    return `${process.env.URL}${this.foto}`;
  }
}
