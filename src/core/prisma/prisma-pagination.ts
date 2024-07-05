import { ClassConstructor, plainToClass } from 'class-transformer';
import { env } from 'process';

export interface PaginatedResult<T> {
  data: T[];
  params: any;
  current_page: number;
  last_page: number;
  total: number;
  first_page_url: string | null;
  last_page_url: string | null;
  next_page_url: string | null;
  prev_page_url: string | null;
  per_page: number;
}

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
  entity?: ClassConstructor<any>;
};
export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
  params?: any,
) => Promise<PaginatedResult<T>>;

export type PaginateRawFunction = <T>(
  query: string,
  params: any,
  model?: ClassConstructor<any>,
) => Promise<PaginatedResult<T>>;

export const paginator = (
  defaultOptions: PaginateOptions,
): PaginateFunction => {
  return async (model, args: any = { where: undefined }, options, params) => {
    const page = Number(options?.page || defaultOptions?.page) || 1;
    const perPage = Number(options?.perPage || defaultOptions?.perPage) || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;

    // eslint-disable-next-line prefer-const
    let [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage == -1 ? undefined : perPage,
        skip: perPage == -1 ? undefined : skip,
      }),
    ]);

    const lastPage = Math.ceil(total / (perPage === -1 ? total : perPage));
    let parameter = '';

    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'page' && key !== 'per_page') {
        parameter += `?${key}=${value}`;
      }
    });

    if (defaultOptions.entity) {
      data = plainToClass(defaultOptions.entity, data);
    }

    return {
      data,
      params,
      current_page: page,
      last_page: lastPage,
      total,
      first_page_url: env.URL + '?page=1&per_page=' + perPage + parameter,
      last_page_url:
        env.URL + '?page=' + lastPage + '&per_page=' + perPage + parameter,
      next_page_url:
        page < lastPage
          ? env.URL + '?page=' + (page + 1) + '&per_page=' + perPage + parameter
          : null,
      prev_page_url:
        page > 1
          ? env.URL + '?page=' + (page - 1) + '&per_page=' + perPage + parameter
          : null,
      per_page: perPage,
    };
  };
};
