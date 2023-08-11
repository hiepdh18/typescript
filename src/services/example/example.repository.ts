import { ModelType } from 'typegoose';
import { BaseTypegooseRepository } from '../../common/base/base-typegoose.repository';
import { Example } from './schemas/example.shema';

export class ExampleRepository extends BaseTypegooseRepository<Example> {
  constructor(private readonly exampleModel: ModelType<Example>) {
    super(exampleModel);
  }
}
