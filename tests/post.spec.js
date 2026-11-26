import { test, expect } from '../src/fixtures/api.fixture.js';
import { TodoBuilder } from '../src/builders/todo.builder.js';
import { API_URLS } from '../src/config/api.config.js';
test.describe('POST /api/todos @post', () => {
  test.beforeEach(async ({ todoFacade }) => {
    await todoFacade.deleteAllTodos(); // Добавь этот метод в фасад, если нет
  });

  test('1. Создать todo с валидными данными @post', async ({ todoFacade }) => {
    const payload = new TodoBuilder().withTitle('Buy Milk').build();
    const res = await todoFacade.createTodo(payload);
    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.title).toBe('Buy Milk');
    expect(typeof body.id).toBe('number');
  });

  test('2. Создать todo с doneStatus=true @post', async ({ todoFacade }) => {
    const payload = new TodoBuilder().withStatus(true).build();
    const res = await todoFacade.createTodo(payload);
    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.doneStatus).toBe(true);
    expect(body.title).toBe(payload.title);
  });

  test('3. Ошибка 422 при неверном типе doneStatus @post', async ({ request, challengerGuid }) => {
    const res = await request.post(API_URLS.todos, {
      headers: { 'X-CHALLENGER': challengerGuid },
      data: { title: 'X', doneStatus: 'yes' },
    });
    expect(res.status()).toBe(422);

    const body = await res.json();
    expect(body.errorMessages.some((m) => m.toLowerCase().includes('donestatus'))).toBeTruthy();
  });

  test('4. Ошибка 422 при слишком длинном title (>50) @post', async ({ request, challengerGuid }) => {
    const res = await request.post(API_URLS.todos, {
      headers: { 'X-CHALLENGER': challengerGuid },
      data: { title: 'A'.repeat(51) },
    });
    expect(res.status()).toBe(422);

    const body = await res.json();
    expect(body.errorMessages.some((m) => m.toLowerCase().includes('title'))).toBeTruthy();
  });

  test('5. Ошибка 422 при лишних полях @post', async ({ request, challengerGuid }) => {
    const res = await request.post(API_URLS.todos, {
      headers: { 'X-CHALLENGER': challengerGuid },
      data: { title: 'X', extraField: 'ignored' },
    });
    expect(res.status()).toBe(422);
  });

  test('6. Создать todo без title (422) @post', async ({ todoController, todoBuilder }) => {
    const payload = todoBuilder.withTitle(undefined).build();
    const res = await todoController.createTodo(payload);
    expect(res.status()).toBe(422);

    const body = await res.json();
    expect(body.errorMessages.some((m) => m.toLowerCase().includes('title'))).toBeTruthy();
  });

  test('7. Создать todo с description @post', async ({ todoController, todoBuilder }) => {
    const payload = todoBuilder.withDescription('Test desc').build();
    const res = await todoController.createTodo(payload);
    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.description).toBe('Test desc');
  });

  test('8. Создать todo с максимальной длиной title (50 символов) @post', async ({ request, challengerGuid }) => {
    const title = 'A'.repeat(50);
    const res = await request.post(API_URLS.todos, {
      headers: { 'X-CHALLENGER': challengerGuid },
      data: { title },
    });
    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.title).toBe(title);
  });

  test('9. Ошибка 413 при слишком большом payload @post', async ({ request, challengerGuid }) => {
    const res = await request.post(API_URLS.todos, {
      headers: { 'X-CHALLENGER': challengerGuid },
      data: { title: 'X', description: 'B'.repeat(6000) },
    });
    expect(res.status()).toBe(413);
  });

  test('10. Проверка уникальности ID @post', async ({ todoController, todoBuilder }) => {
    const p = todoBuilder.build();
    const r1 = await todoController.createTodo(p);
    const r2 = await todoController.createTodo(p);

    expect(r1.status()).toBe(201);
    expect(r2.status()).toBe(201);
    expect((await r1.json()).id).not.toBe((await r2.json()).id);
  });

  test('11. Создать несколько todos подряд @post', async ({ todoController, todoBuilder }) => {
    const res1 = await todoController.createTodo(todoBuilder.withTitle(`Task-${Date.now()}-1`).build());
    const res2 = await todoController.createTodo(todoBuilder.withTitle(`Task-${Date.now()}-2`).build());

    expect(res1.status()).toBe(201);
    expect(res2.status()).toBe(201);
  });

  test('12. Ошибка 415 при неверном Content-Type @post', async ({ request, challengerGuid }) => {
    const res = await request.post(API_URLS.todos, {
      headers: {
        'X-CHALLENGER': challengerGuid,
        'Content-Type': 'text/plain',
      },
      data: 'some text',
    });
    expect(res.status()).toBe(415);
  });

  test('13. Ошибка 422 при пустом body @post', async ({ request, challengerGuid }) => {
    const res = await request.post(API_URLS.todos, {
      headers: { 'X-CHALLENGER': challengerGuid },
      data: {},
    });
    expect(res.status()).toBe(422);

    const body = await res.json();
    expect(body.errorMessages.some((m) => m.toLowerCase().includes('title'))).toBeTruthy();
  });

});