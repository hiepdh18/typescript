import { DTOMapper, MapFrom } from '../../common/base/base-dto-mapper';

export class UserDTO extends DTOMapper {
  @MapFrom()
  name!: string;
}
