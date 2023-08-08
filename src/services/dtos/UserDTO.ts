import { DTOMapper, MapFrom } from '../../common/base/BaseDTOMapper';

export class UserDTO extends DTOMapper {
  @MapFrom()
  name!: string;
}
