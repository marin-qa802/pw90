import { test, expect } from '../src/fixtures/api.fixture.js';
import { TodoBuilder } from '../src/builders/todo.builder.js';

test.describe('PUT /api/todos @put', () => {
  
  test('1. Обновить существующий todo @put', async ({ todoFacade }) => {
    // 1. Создаем задачу через фасад
    const createRes = await todoFacade.createDefaultTodo();
    const { id } = await createRes.json();
    
    // 2. Готовим данные через билдер (снаружи фасада, так как данные специфичны)
    const payload = new TodoBuilder().withTitle('Updated').withStatus(true).build();
    
    // 3. Обновляем через фасад (он внутри дергает контроллер)
    const res = await todoFacade.updateTodoWithData(id, payload);
    
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Updated');
    expect(body.doneStatus).toBe(true);
  });

  test('2. Обновить несуществующий todo (404) @put', async ({ todoFacade }) => {
    const payload = new TodoBuilder().build();
    const res = await todoFacade.updateTodoWithData(999999, payload);
    expect(res.status()).toBe(404);
  });

  test('3. PUT без title (422) @put', async ({ todoFacade }) => {
    const createRes = await todoFacade.createDefaultTodo();
    const { id } = await createRes.json();
    
    // Отправляем невалидные данные
    const res = await todoFacade.updateTodoWithData(id, { doneStatus: true }); 
    expect(res.status()).toBe(422);
  }); 

  test('4. Полное обновление PUT с description @put', async ({ todoFacade }) => {
    const createRes = await todoFacade.createDefaultTodo();
    const { id } = await createRes.json();
    
    const payload = new TodoBuilder()
      .withTitle('Full Update')
      .withDescription('New Description')
      .withStatus(true)
      .build();
      
    const res = await todoFacade.updateTodoWithData(id, payload);
    expect(res.status()).toBe(200);
    
    const body = await res.json();
    expect(body.title).toBe('Full Update');
    expect(body.description).toBe('New Description');
    expect(body.doneStatus).toBe(true);
  });
});