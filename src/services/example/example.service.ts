import { BackendLogger } from '../../common/logger/backend.logger';
import { ExampleRepository } from './example.repository';

export class ExampleService {
  private readonly logger = new BackendLogger(ExampleService.name);

  constructor(private readonly exampleRepository: ExampleRepository) {}
}
