export interface IRead<T> {
  findOneById(id: string | number): Promise<T>;
  findOne(opts: any): Promise<T>;
  findAll(opts: any): Promise<T[]>;
  count(opts: any): Promise<number>;
}
