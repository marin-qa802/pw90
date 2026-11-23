import { test, expect } from '../src/fixtures/api.fixture.js';

test.describe('PATCH /api/todos @patch', () => {
  test('1. Частично обновить doneStatus @patch', async ({ todoFacade, todoController }) => {
    const createRes = await todoFacade.createDefaultTodo();
    const { id } = await createRes.json();
    const res = await todoController.patchTodo(id, { doneStatus: true });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.doneStatus).toBe(true);
    expect(body.title).toBe('Default Todo');
  });
});