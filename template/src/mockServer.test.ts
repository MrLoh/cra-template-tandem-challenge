import createMockServer from './mockServer';

describe('mock server', () => {
  let server: ReturnType<typeof createMockServer>;
  beforeEach(() => (server = createMockServer()));
  afterEach(() => server.shutdown());

  test('try getting missing data set', async () => {
    const res = await fetch('/data-set/123');
    expect(res.status).toBe(404);
  });

  test('get data set', async () => {
    const dataSet = server.create('dataSet');
    const res = await fetch(`/data-set/${dataSet.id}`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ id: dataSet.id, values: dataSet.values });
  });

  test('try posting to missing data set', async () => {
    const res = await fetch('/data-set/123', {
      method: 'POST',
      body: JSON.stringify({ value: 1 }),
    });
    expect(res.status).toBe(404);
  });

  test('post invalid body to data set', async () => {
    const dataSet = server.create('dataSet');
    const res = await fetch(`/data-set/${dataSet.id}`, {
      method: 'POST',
      body: 'as',
    });
    expect(res.status).toBe(400);
    const { error } = await res.json();
    expect(error).toBe('invalid json');
  });

  test('post body without value to data set', async () => {
    const dataSet = server.create('dataSet');
    const res = await fetch(`/data-set/${dataSet.id}`, {
      method: 'POST',
      body: JSON.stringify({ values: [1, 2] }),
    });
    expect(res.status).toBe(400);
    const { error } = await res.json();
    expect(error).toBe('missing value');
  });

  test('post invalid value to data set', async () => {
    const dataSet = server.create('dataSet');
    const res = await fetch(`/data-set/${dataSet.id}`, {
      method: 'POST',
      body: JSON.stringify({ value: '5.2' }),
    });
    expect(res.status).toBe(400);
    const { error } = await res.json();
    expect(error).toBe('invalid value');
  });

  test('post to data set', async () => {
    const dataSet = server.create('dataSet');
    const postRes = await fetch(`/data-set/${dataSet.id}`, {
      method: 'POST',
      body: JSON.stringify({ value: 1000 }),
    });
    expect(postRes.status).toBe(200);
    const result = await postRes.json();
    expect(result).toEqual({ value: 1000 });
    const getRes = await fetch(`/data-set/${dataSet.id}`);
    expect(getRes.status).toBe(200);
    const data = await getRes.json();
    expect(data).toEqual({ id: dataSet.id, values: [...dataSet.values, 1000] });
  });
});
