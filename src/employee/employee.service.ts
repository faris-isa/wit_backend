import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginateFunction, paginator } from 'src/core/prisma/prisma-pagination';
import { FindEmployeeDTO } from './dto/find-employee.dto';
import { EmployeeEntity } from './entities/employee.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  create(createEmployeeDto: CreateEmployeeDto, file: Express.Multer.File) {
    return this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        foto: `uploads/employee/${file.filename}`,
        tanggal_masuk: new Date(createEmployeeDto.tanggal_masuk),
      },
    });
  }

  findAll(findEmployeeDTO: FindEmployeeDTO) {
    const paginate: PaginateFunction = paginator({
      perPage: findEmployeeDTO.per_page,
      page: findEmployeeDTO.page,
      entity: EmployeeEntity,
    });
    const params = findEmployeeDTO;
    return paginate(
      this.prisma.employee,
      {
        where: {
          OR: [
            {
              nomor: {
                equals: findEmployeeDTO.filter_search ?? undefined,
                mode: 'insensitive',
              },
            },
            {
              nama: {
                contains: findEmployeeDTO.filter_search ?? undefined,
                mode: 'insensitive',
              },
            },
            {
              departemen: {
                contains: findEmployeeDTO.filter_search ?? undefined,
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: { created_at: 'desc' },
      },
      {},
      params,
    );
  }

  async findOne(id: number) {
    const foundOne = await this.prisma.employee.findFirst({
      where: {
        id,
      },
    });

    return plainToClass(EmployeeEntity, foundOne);
  }

  update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
    file: Express.Multer.File,
  ) {
    return this.prisma.employee.update({
      where: {
        id,
      },
      data: {
        ...updateEmployeeDto,
        tanggal_masuk: updateEmployeeDto.tanggal_masuk
          ? new Date(updateEmployeeDto.tanggal_masuk)
          : undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.employee.delete({
      where: {
        id,
      },
    });
  }
}
