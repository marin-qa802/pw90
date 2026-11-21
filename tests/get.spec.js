import { test, expect } from '../src/fixtures/api.fixture.js';

test.describe('GET /api/todos @get', () => {
  test('1. Получить все todos @get', async ({ todoController }) => {
    const res = await todoController.getAllTodos();
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.todos)).toBeTruthy();
  });

    test('2. Получить todo по ID @get', async ({ todoFacade, todoController }) => {
    const createRes = await todoFacade.createDefaultTodo();
    const { id } = await createRes.json();
    
    const res = await todoController.getTodoById(id);
    expect(res.status()).toBe(200);
    
    const body = await res.json();
    // В этом API GET /todos/{id} возвращает объект, но иногда может обернуть в массив
    // Проверим оба варианта:
    const todo = Array.isArray(body) ? body[0] : (body.todos ? body.todos[0] : body);
    expect(todo.id).toBe(id);
  });

  test('3. Получить несуществующий todo (404) @get', async ({ todoController }) => {
    const res = await todoController.getTodoById(999999);
    expect(res.status()).toBe(404);
  });

  test('4. GET /api/todo (404) неверный эндпоинт @get', async ({ request }) => {
    const res = await request.get('https://apichallenges.com/api/todo');
    expect(res.status()).toBe(404);
  });

  test('5. Проверить Content-Type ответа @get', async ({ todoController }) => {
    const res = await todoController.getAllTodos();
    expect(res.headers()['content-type']).toContain('application/json');
  });

  test('6. Фильтрация по doneStatus @get', async ({ request }) => {
    const res = await request.get('https://apichallenges.com/api/todos?doneStatus=true');
    expect(res.status()).toBe(200);
  });

  test('7. Фильтрация по id (id=1) @get', async ({ request }) => {
    const res = await request.get('https://apichallenges.com/api/todos?id=1');
    expect(res.status()).toBe(200);
  });

    test('8. Получение с лимитом (_limit=2) @get', async ({ request }) => {
    const res = await request.get('https://apichallenges.com/api/todos?_limit=2');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.todos.length).toBeLessThanOrEqual(2);
  }); // <-- ВОТ ЭТА СКОБКА ЗАКРЫВАЕТ ТЕСТ №8

  test('9. Проверить сортировку по id (_sortBy) @get', async ({ request }) => {
    const res = await request.get('https://apichallenges.com/api/todos?_sortBy=id');
    expect(res.status()).toBe(200);
    const body = await res.json();
    if (body.todos.length > 1) {
      expect(body.todos[0].id).toBeLessThanOrEqual(body.todos[1].id);
    }
  });
}); 