import { IRead } from './read.interface';
import { IWrite } from './write.interface';

export interface PaginateOptions {
  select?: string | {};
  sort?: string | {};
  populate?: string | {} | [];
  lean?: boolean;
  leanWithId?: boolean;
  offset?: number;
  page?: number;
  limit?: number;
}

export interface IRepository<T> extends IRead<T>, IWrite<T> {}
