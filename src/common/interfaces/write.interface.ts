export interface IWrite<T> {
  findByIdAndUpdate(id: string | number, opts: any, isNew: boolean): Promise<T>;
  findOneAndUpdate(filter: any, opts: any, isNew: boolean): Promise<T>;
  deleteOne(opts: any): Promise<void | boolean>;
  deleteById(id: string | number): Promise<void | boolean>;
  deleteMany(opts: any): Promise<void>;
  deleteManyByIds(ids: string[] | number[]): Promise<void>;
  insertMany(dtos: any[]): Promise<T[]>;
  insertOne(dto: any): Promise<T>;
}
