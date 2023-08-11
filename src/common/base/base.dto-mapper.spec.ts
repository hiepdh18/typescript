import _, { extend } from 'lodash';
import {
  DTOMapper,
  MapFrom,
  MappedDto,
  ValueMappingFailedError,
  getFromFn,
} from './base-dto-mapper';

// const a = require('./BaseDTOMapper')
class SimpleMappingDTO extends DTOMapper {
  @MapFrom()
  prop: any;
}
describe('BaseDTOMapper Test', () => {
  beforeAll(() => {});
  afterAll(() => {});

  describe('getFromFn', () => {
    test('it should return from function', () => {
      const obj = {
        name: {
          first: 'test',
          last: 'test',
        },
      };
      const fromFn = getFromFn('name')(obj, 'first');
      expect(fromFn).toBeDefined();
      expect(fromFn).toEqual({ first: 'test', last: 'test' });
    });
  });

  describe('DTOMapper', () => {
    test('it should construct without parameter', () => {
      const dto = new SimpleMappingDTO();
      expect(dto).toBeDefined();
      expect(dto).toBeInstanceOf(SimpleMappingDTO);
    });

    test('it should construct without empty array with mul false', () => {
      class MapperArrayToSimple extends DTOMapper {
        @MapFrom('vote', (x) => 1, false, 'xx')
        vote: any;
      }
      const dto = new MapperArrayToSimple({ vote: [] });

      expect(dto).toBeInstanceOf(MapperArrayToSimple);
      expect(dto).toMatchObject({ vote: 1 });
    });
    test('it should construct with empty parameter', () => {
      const dto = new SimpleMappingDTO({});
      expect(dto).toBeInstanceOf(SimpleMappingDTO);
      expect(dto).toMatchObject({});
    });
    test('it should construct with valid parameter', () => {
      const dto = new SimpleMappingDTO({ prop: 1 });
      expect(dto).toBeInstanceOf(SimpleMappingDTO);
      expect(dto).toMatchObject({ prop: 1 });
    });
    test('it should construct with zero value', () => {
      const dto = new SimpleMappingDTO({ prop: 0 });
      expect(dto).toBeInstanceOf(SimpleMappingDTO);
      expect(dto.prop).toEqual(0);
    });
    test('it should construct with default value', () => {
      class SimpleMappingWithDefaultDto extends DTOMapper {
        @MapFrom('prop', (x) => x, false, 1000)
        prop: any;
      }
      const dto = new SimpleMappingWithDefaultDto({});
      expect(dto).toMatchObject({ prop: 1000 });
    });
    test('it should construct with prop mapper function', () => {
      class SimpleMappingWithPropMapperDto extends DTOMapper {
        @MapFrom((data) => data.src)
        target: any;
      }

      const dto = new SimpleMappingWithPropMapperDto({ src: 1 });
      expect(dto).toMatchObject({ target: 1 });
    });
    test('it should construct with value mapper function', () => {
      class SimpleMappingWithValueMapperDto extends DTOMapper {
        @MapFrom('src', (value) => value * 2)
        target: any;
      }

      const dto = new SimpleMappingWithValueMapperDto({ src: 1 });
      expect(dto).toMatchObject({ target: 2 });
    });

    test('it should construct with value mapper class', () => {
      class SimpleMappingWithValueDtoMapperDto extends DTOMapper {
        @MapFrom('src', SimpleMappingDTO)
        target: any;
      }

      const dto = new SimpleMappingWithValueDtoMapperDto({ src: { prop: 1 } });
      expect(dto.target).toBeInstanceOf(SimpleMappingDTO);
      expect(dto.target).toMatchObject({ prop: 1 });
    });

    test('it should construct with value mapper class array empty value', () => {
      class SimpleMappingWithValueDtoMapperDto extends DTOMapper {
        @MapFrom('src', SimpleMappingDTO, false, {})
        target: any;
      }

      const dto = new SimpleMappingWithValueDtoMapperDto({});
      expect(dto.target).toBeDefined;
    });

    test('it should construct with value mapper class array', () => {
      class SimpleMappingWithValueDtoMapperDto extends DTOMapper {
        @MapFrom('src', SimpleMappingDTO, true)
        target: any;
      }

      const dto = new SimpleMappingWithValueDtoMapperDto({ src: [{ prop: 1 }] });

      _.values(dto.target).map((item) => {
        expect(item).toMatchObject({ prop: 1 });
      });
    });

    test('it should construct with value mapper class collection', () => {
      class SimpleMappingWithValueDtoMapperDto extends DTOMapper {
        @MapFrom('src', SimpleMappingDTO, true)
        target: any;
      }

      const dto = new SimpleMappingWithValueDtoMapperDto({ src: { a: { prop: 1 } } });

      const check = _.values(dto.target).every((item) => {
        return JSON.stringify(item) === JSON.stringify({ prop: 1 });
      });
      expect(check).toBeTruthy();
    });

    test('it should construct with from mapper class', () => {
      class SimpleMappingWithFromFnDtoMapper extends DTOMapper {
        @MapFrom((data) => data, SimpleMappingDTO)
        tgt: SimpleMappingDTO | any;
      }

      const dto = new SimpleMappingWithFromFnDtoMapper({ prop: 1, a: 2, b: 3, c: 4 });
      expect(dto.tgt.prop).toEqual(1);
    });

    test('it should deco a class', () => {
      
      @MappedDto
      class NewDTO {
        constructor(source: any){}
        // @MapFrom()
        prop: any
      }

      const instance = NewDTO
      expect(typeof instance).toBe('function')
    })
  });
});
