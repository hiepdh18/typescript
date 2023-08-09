import { extend } from 'lodash';
import { DTOMapper, MapFrom, MappedDto, ValueMappingFailedError, getFromFn } from './base-dto-mapper';

// const a = require('./BaseDTOMapper')
describe('BaseDTOMapper', () => {
  beforeAll(() => {
    // Error.captureStackTrace = jest.fn(() => console.log('error'))
  });

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
    test('it should return new instance of DTOMapper', () => {
      const obj = {
        name: {
          first: 'test',
          last: 'test',
        },
      };
      const map = new DTOMapper(obj);
      expect(map).toBeDefined();
      expect(map).toEqual({});
    });

    test('it should return new instance of DTOMapper with properties', () => {
      class TestClass extends DTOMapper {
        @MapFrom()
        name!: any;
      }
      const obj = {
        name: {
          first: 'test',
          last: 'test',
        },
      };
      const test = new TestClass(obj);
      expect(test).toBeDefined();
      expect(test).toEqual({
        name: {
          first: 'test',
          last: 'test',
        },
      });
    });

    test('it should return new instance of DTOMapper with mapper function', () => {
      class TestClass extends DTOMapper {
        @MapFrom((data) => data.name.first)
        name!: any;
      }
      const obj = {
        name: {
          first: 'test',
          last: 'test',
        },
      };
      const test = new TestClass(obj);
      expect(test).toBeDefined();
      expect(test).toEqual({
        name: 'test',
      });
    });

    test('it should throw ValueMappingFailedError', () => {
      class TestClass extends DTOMapper {
        @MapFrom('name', (data) => data.name.first, true, [])
        name!: any;
      }
      const obj = {
        name: {
          first: 'test',
          last: 'test',
        },
      };
      try {
        new TestClass(obj);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('it should throw ValueMappingFailedError', () => {
      class Mapper {
        name;
        constructor() {
          this.name = 'test';
        }
      }
      class TestClass extends DTOMapper {
        @MapFrom('name', Mapper)
        name!: any;
      }
      const obj = {
        name: {
          first: 'test',
          last: 'test',
        },
      };
      const res = new TestClass(obj);
      console.log('🐋🐋🐋  res =>', res);
      expect(res).toBeDefined();
    });
  });
});
