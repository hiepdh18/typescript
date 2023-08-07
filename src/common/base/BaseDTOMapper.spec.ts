import { DTOMapper } from './BaseDTOMapper';

// const a = require('./BaseDTOMapper')

describe('BaseDTOMapper', () => {
  describe('getFromFn', () => {

    test("it should filter by a search term (link)", () => {
      const test = new DTOMapper({});
      expect(test).toBeDefined();
    });
  });
});