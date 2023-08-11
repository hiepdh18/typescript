import { ModelType, Typegoose } from 'typegoose';
import { IRepository } from '../interfaces/repository.interface';
import { BackendLogger } from '../logger/backend.logger';

export class BaseTypegooseRepository<T extends Typegoose> implements IRepository<T> {
  public logger: BackendLogger;

  constructor(private readonly model: ModelType<T>) {
    this.logger = new BackendLogger(model.name);
  }

  // Write
  public async insertOne(dto: any): Promise<T> {
    const newRecord = new this.model(dto);
    return await this.model.insertOne(newRecord);
  }

  public async insertMany(dtos: any[]): Promise<T[]> {
    const newRecords = dtos.map((dto) => new this.model(dto));
    return await this.model.insertMany(newRecords);
  }

  public async findByIdAndUpdate(id: string, opts: any = {}, isNew: boolean = true): Promise<T> {
    return await this.model.findByIdAndUpdate(id, opts, { useFindAndModify: false, new: isNew });
  }

  public async findOneAndUpdate(
    filter: any = {},
    opts: any = {},
    isNew: boolean = true,
  ): Promise<T> {
    return await this.model.findOneAndUpdate(filter, opts, {
      upsert: true,
      useFindAndModify: false,
      new: isNew,
    });
  }

  public async deleteOne(dtos: any): Promise<void> {
    await this.model.deleteOne(dtos);
  }

  public async deleteById(id: string): Promise<void> {
    await this.model.deleteById(id);
  }

  public async deleteMany(opts: any): Promise<void> {
    await this.model.deleteMany(opts);
  }

  public async deleteManyByIds(ids: string[] | number[]): Promise<void> { }
  
  // Read
  public async findOneById(id: string): Promise<T> {
    return await this.findOneById(id);
  }
  public async findOne(opts: any): Promise<T> {
    return await this.model.findOne(opts);
  }
  public async findAll(opts: any): Promise<T[]> {
    return await this.model.find(opts);
  }
  public async count(opts: any): Promise<number> {
    return await this.model.countDocuments(opts);
  }
}
