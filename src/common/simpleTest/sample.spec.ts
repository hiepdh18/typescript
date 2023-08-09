describe('TEST', () => {
  test('returns undefined by default', () => {
    // simplest way to create a Mock Function instance
    const mock = jest.fn();

    const result = mock('foo');

    expect(result).toBeUndefined();
    expect(mock).toHaveBeenCalled();
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith('foo');
  });

  test('mock implementation', () => {
    const mock = jest.fn(() => 'bar');

    expect(mock()).toBe('bar');
    expect(mock).toHaveBeenCalledWith();
  });

  test('also mock implementation', () => {
    const mock = jest.fn().mockImplementation(() => 'bar');

    expect(mock('foo')).toBe('bar');
    expect(mock).toHaveBeenCalledWith('foo');
  });

  test('mock implementation one time', () => {
    const mock = jest.fn().mockImplementationOnce(() => 'bar');

    expect(mock('foo')).toBe('bar');
    expect(mock).toHaveBeenCalledWith('foo');

    expect(mock('baz')).toBe(undefined);
    expect(mock).toHaveBeenCalledWith('baz');
  });

  test('mock return value', () => {
    const mock = jest.fn();
    mock.mockReturnValue('bar');

    expect(mock('foo')).toBe('bar');
    expect(mock).toHaveBeenCalledWith('foo');
  });

  test('mock promise resolution', () => {
    const mock = jest.fn();
    mock.mockResolvedValue('bar');

    expect(mock('foo')).resolves.toBe('bar');
    expect(mock).toHaveBeenCalledWith('foo');
  });
  /*
  jest.fn: Mock a function| reassign
jest.mock: Mock a module
jest.spyOn: Spy or mock a function
   */

  // jest.mock('axios', () => ({
  //   get: jest.fn().mockResolvedValue({ data: { foo: 'bar' } }),
  // }));

  /**
   * 
   * 
   * 
  test('kiem tra async truong thanh that bai', async () => {
    expect.assertions(1);
    try {
      await checkIsAdult(13);
    } catch (e) {
      expect(e.message).toMatch('Chua an duoc, can than boc lich');
    }
  });
   */
});
