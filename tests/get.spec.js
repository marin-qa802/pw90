import { test, expect } from '../src/fixtures/api.fixture.js';
import { TodoBuilder } from '../src/builders/todo.builder.js';

test.describe('GET /api/todos @get', () => {
  test.beforeEach(async ({ todoFacade }) => {
    await todoFacade.deleteAllTodos(); // Убедись, что метод есть в фасаде
  });

  test('1. Получить все todos @get', async ({ todoFacade }) => {
    const res = await todoFacade.getAllTodos();
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.todos)).toBeTruthy();
  });

  test('2. Получить todo по ID @get', async ({ todoFacade }) => {
    const payload = new TodoBuilder().build();
    const createRes = await todoFacade.createTodo(payload);
    const { id } = await createRes.json();

    const res = await todoFacade.getTodoById(id);
    expect(res.status()).toBe(200);

    const body = await res.json();
    const todo = Array.isArray(body) ? body[0] : (body.todos ? body.todos[0] : body);
    expect(todo.id).toBe(id);
    expect(todo.title).toBe(payload.title);
  });

  test('3. Получить несуществующий todo (404) @get', async ({ todoFacade }) => {
    const res = await todoFacade.getTodoById(999999);
    expect(res.status()).toBe(404);
  });

  test('4. GET /api/todo (404) неверный эндпоинт @get', async ({ request }) => {
    const res = await request.get(`${process.env.API_BASE_URL ?? 'https://apichallenges.com'}/api/todo`);
    expect(res.status()).toBe(404);
  });

  test('5. Проверить Content-Type ответа @get', async ({ todoController }) => {
    const res = await todoController.getAllTodos();
    expect(res.headers()['content-type']).toContain('application/json');
  });

  test('6. Фильтрация по doneStatus @get', async ({ todoController }) => {
    // создаём запись под фильтр и запись не под фильтр — и читаем через тот же контроллер,
    const doneRes = await todoController.createTodo(new TodoBuilder().withStatus(true).build());
    expect(doneRes.status()).toBe(201);
    const doneId = (await doneRes.json()).id;

    const notDoneRes = await todoController.createTodo(new TodoBuilder().withStatus(false).build());
    expect(notDoneRes.status()).toBe(201);
    const notDoneId = (await notDoneRes.json()).id;

    const res = await todoController.getAllTodos({ doneStatus: 'true' });
    expect(res.status()).toBe(200);

    const body = await res.json();
    const todos = body.todos || [];
    const ids = todos.map((t) => t.id);

    expect(ids).toContain(doneId);
    expect(ids).not.toContain(notDoneId);
    for (const t of todos) {
      expect(t.doneStatus).toBe(true);
    }
  });

  test('7. Фильтрация по id @get', async ({ todoController, todoBuilder }) => {
    const payload = todoBuilder.build();
    const createRes = await todoController.createTodo(payload);
    expect(createRes.status()).toBe(201);
    const { id } = await createRes.json();

    const res = await todoController.getAllTodos({ id: String(id) });
    expect(res.status()).toBe(200);

    const body = await res.json();
    const todos = body.todos || [];

    expect(todos).toHaveLength(1);
    expect(todos[0].id).toBe(id);
    expect(todos[0].title).toBe(payload.title);
  });

  test('8. Получение с лимитом (_limit=2) @get', async ({ todoController }) => {
    const res = await todoController.getAllTodos({ _limit: 2 });
    expect(res.status()).toBe(200);

    const body = await res.json();
    const todos = body.todos || [];
    expect(todos.length).toBeLessThanOrEqual(2);
  });

  test('9. Проверить сортировку по id (_sortBy) @get', async ({ todoController }) => {
    const res = await todoController.getAllTodos({ _sortBy: 'id' });
    expect(res.status()).toBe(200);

    const body = await res.json();
    const ids = (body.todos || []).map((t) => t.id);

    for (let i = 1; i < ids.length; i++) {
      expect(ids[i]).toBeGreaterThanOrEqual(ids[i - 1]);
    }
  });

  test('10. OPTIONS /api/todos @options', async ({ request }) => {
    const res = await request.fetch(
      `${process.env.API_BASE_URL ?? 'https://apichallenges.com'}/api/todos`,
      { method: 'OPTIONS' },
    );
    expect(res.status()).toBe(200);
    expect(res.headers()['allow']).toContain('GET');
  });

});