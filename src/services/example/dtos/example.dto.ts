import { DTOMapper, MapFrom } from '../../../common/base/base-dto-mapper';

export class ExampleDTO extends DTOMapper {
  @MapFrom()
  name?: string;

  @MapFrom()
  description?: string;

}
