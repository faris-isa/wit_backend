import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class DashboardsService {
  constructor(private prisma: PrismaService) {}

  async dashboardEmployee() {
    // const groupByDepartment = await this.prisma.employee.groupBy({
    //   by: ['departemen'],
    //   _count: {
    //     _all: true,
    //   },
    // });

    const findAllEmployee = await this.prisma.employee.findMany();

    const countContract = findAllEmployee.filter(
      (item) => item.status === 'KONTRAK',
    ).length;

    const countProbation = findAllEmployee.filter(
      (item) => item.status === 'PROBATION',
    ).length;

    const countDepartment = findAllEmployee.reduce((acc, curr) => {
      if (!acc[curr.departemen]) {
        acc[curr.departemen] = 0;
      }
      acc[curr.departemen] += 1;
      return acc;
    }, {});

    // Transforming countDepartment into labels and values arrays
    const labels = Object.keys(countDepartment);
    const values = Object.values(countDepartment);

    return {
      counter: {
        all: findAllEmployee.length,
        contract: countContract,
        probation: countProbation,
      },
      department: {
        labels,
        values,
      },
    };

    // return `This action removes a #${id} dashboard`;
  }
}
