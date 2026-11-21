import { test, expect } from '../src/fixtures/api.fixture.js';

test.describe('PUT /api/todos @put', () => {
  test('1. Обновить существующий todo @put', async ({ todoFacade, todoController, todoBuilder }) => {
    const createRes = await todoFacade.createDefaultTodo();
    const { id } = await createRes.json();
    const payload = todoBuilder.withTitle('Updated').withStatus(true).build();
    const res = await todoController.updateTodo(id, payload);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Updated');
    expect(body.doneStatus).toBe(true);
  });

  test('2. Обновить несуществующий todo (404) @put', async ({ todoController, todoBuilder }) => {
    const res = await todoController.updateTodo(999999, todoBuilder.build());
    expect(res.status()).toBe(404);
  });

    test('3. PUT без title (422) @put', async ({ todoFacade, todoController }) => {
    const createRes = await todoFacade.createDefaultTodo();
    const { id } = await createRes.json();
    const res = await todoController.updateTodo(id, { doneStatus: true }); // Нет title
    expect(res.status()).toBe(422);
  }); 

  test('4. Полное обновление PUT с description @put', async ({ todoFacade, todoController, todoBuilder }) => {
    const createRes = await todoFacade.createDefaultTodo();
    const { id } = await createRes.json();
    
    const payload = todoBuilder
      .withTitle('Full Update')
      .withDescription('New Description')
      .withStatus(true)
      .build();
      
    const res = await todoController.updateTodo(id, payload);
    expect(res.status()).toBe(200);
    
    const body = await res.json();
    expect(body.title).toBe('Full Update');
    expect(body.description).toBe('New Description');
    expect(body.doneStatus).toBe(true);
  });
});