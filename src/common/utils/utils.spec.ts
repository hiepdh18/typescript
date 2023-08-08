import {
  getRandomFloat,
  getRandomInt,
  isDevEnv,
  context,
  randomInt,
  randomStr,
  randomIntFromInterval,
  replaceAllNonDigits,
  getExternalPath,
  deepFind,
  isEmpty,
} from './utils';

describe('Utils functions', () => {
  test('It should return true', () => {
    expect(isDevEnv()).toBe(true);
  });

  test('It should return a random integer between 100 and 500', () => {
    expect(getRandomInt(100, 500)).toBeGreaterThan(100);
    expect(getRandomInt(100, 500)).toBeLessThan(500);
  });

  test('It should return a random float between 100 and 500', () => {
    expect(getRandomFloat(100, 500)).toBeGreaterThan(100);
    expect(getRandomFloat(100, 500)).toBeLessThan(500);
  });

  test('It should return context', () => {
    expect(
      context({
        req: 'test',
        connection: {
          context: 'test',
        },
      }),
    ).toBeDefined();
    expect(
      context({
        req: 'test',
      }),
    ).toBeDefined();
  });

  test('It should return a random string', () => {
    expect(randomStr(100).length).toBe(100);
  });

  test('It should return a random integer', () => {
    const number = randomInt(7);
    expect((number + '').length).toBe(7);
  });

  test('It should return a random integer from interval', () => {
    const test = randomIntFromInterval(100, 200);
    expect(test).toBeDefined();
  });

  test('It should return a string that not includes non digits', () => {
    const test = replaceAllNonDigits('12sdo34');
    expect(test).toBeDefined();
    expect(test).toBe(1234);
    // line 55 not cover
    expect(replaceAllNonDigits('')).toBe(0);
  });

  test('It should check if input is empty', () => {
    expect(isEmpty('')).toBeTruthy();
    expect(isEmpty([])).toBeTruthy();
    expect(isEmpty({})).toBeTruthy();
    expect(isEmpty(undefined)).toBeTruthy();
    expect(isEmpty(null)).toBeTruthy();
    expect(isEmpty('hello')).toBeFalsy();
    expect(isEmpty(2)).toBeFalsy();
    expect(isEmpty([1, 3])).toBeFalsy();
    expect(isEmpty({ name: 'test' })).toBeFalsy();
  });

  test('It should internal path', () => {
    // have to mock process.env.EXT_HOST + '/' + process.env.EXT_MIDDLEWARE
    expect(getExternalPath('hello')).toBeDefined();
  });

  test('It should return value from object', () => {
    const obj = {
      name: {
        first: 'test1',
        last: 'test2',
      },
    };
    const obj2 = {
      name: {
        first: undefined,
        last: 'test2',
      },
    };
    expect(deepFind(obj, 'name.last')).toBe('test2');
    expect(deepFind(obj2, 'name.first')).toBe(undefined);
  });
});
