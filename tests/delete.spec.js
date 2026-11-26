import { test, expect } from '../src/fixtures/api.fixture.js';

test.describe('DELETE /api/todos @delete', () => {
  test('1. Удалить существующий todo @delete', async ({ todoFacade }) => {
    const createRes = await todoFacade.createDefaultTodo();
    const { id } = await createRes.json();
    
    // Вместо todoController.deleteTodo(id)
    const res = await todoFacade.deleteTodo(id);
    expect(res.status()).toBe(204);
  });

  test('2. Удалить несуществующий todo (404) @delete', async ({ todoFacade }) => {
    const res = await todoFacade.deleteTodo(999999);
    expect(res.status()).toBe(404);
  });

  test('3. Повторное удаление (404) @delete', async ({ todoFacade }) => {
    const createRes = await todoFacade.createDefaultTodo();
    const { id } = await createRes.json();
    
    await todoFacade.deleteTodo(id);
    const res = await todoFacade.deleteTodo(id);
    expect(res.status()).toBe(404);
  });
});