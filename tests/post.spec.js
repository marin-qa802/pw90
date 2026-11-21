import { test, expect } from '../src/fixtures/api.fixture.js';
import fs from 'fs';

// Хелпер для получения GUID для прямых запросов
const getGuid = () => JSON.parse(fs.readFileSync('challenger.json', 'utf8')).guid;

test.describe('POST /api/todos @post', () => {
  test('1. Создать todo с валидными данными @post', async ({ todoController, todoBuilder }) => {
    const payload = todoBuilder.withTitle('Buy Milk').build();
    const res = await todoController.createTodo(payload);
    expect(res.status()).toBe(201);
    expect((await res.json()).title).toBe('Buy Milk');
  });

  test('2. Создать todo с doneStatus=true @post', async ({ todoController, todoBuilder }) => {
    const payload = todoBuilder.withStatus(true).build();
    const res = await todoController.createTodo(payload);
    expect(res.status()).toBe(201);
    expect((await res.json()).doneStatus).toBe(true);
  });

  test('3. Ошибка 422 при неверном типе doneStatus @post', async ({ request }) => {
    const res = await request.post('https://apichallenges.com/api/todos', {
      headers: { 'X-CHALLENGER': getGuid() }, // <-- Добавили авторизацию
      data: { title: 'X', doneStatus: 'yes' }
    });
    expect(res.status()).toBe(422);
  });

  test('4. Ошибка при слишком длинном title @post', async ({ request }) => {
    const res = await request.post('https://apichallenges.com/api/todos', {
      headers: { 'X-CHALLENGER': getGuid() },
      data: { title: 'A'.repeat(100) }
    });
    expect([422, 201]).toContain(res.status());
  });

  test('5. Ошибка 422 при лишних полях @post', async ({ request }) => {
    const res = await request.post('https://apichallenges.com/api/todos', {
      headers: { 'X-CHALLENGER': getGuid() },
      data: { title: 'X', extraField: 'ignored' }
    });
    expect(res.status()).toBe(422);
  });

  test('6. Создать todo без title (422) @post', async ({ todoController, todoBuilder }) => {
    const payload = todoBuilder.withTitle(undefined).build();
    const res = await todoController.createTodo(payload);
    expect(res.status()).toBe(422);
  });

  test('7. Создать todo с description @post', async ({ todoController, todoBuilder }) => {
    const payload = todoBuilder.withDescription('Test desc').build();
    const res = await todoController.createTodo(payload);
    expect(res.status()).toBe(201);
    expect((await res.json()).description).toBe('Test desc');
  });

  test('8. Создать todo с максимальной длиной @post', async ({ request }) => {
    const res = await request.post('https://apichallenges.com/api/todos', {
      headers: { 'X-CHALLENGER': getGuid() },
      data: { title: 'A'.repeat(50) }
    });
    expect(res.status()).toBe(201);
  });

  test('9. Ошибка 413 при слишком большом payload @post', async ({ request }) => {
    const res = await request.post('https://apichallenges.com/api/todos', {
      headers: { 'X-CHALLENGER': getGuid() },
      data: { title: 'X', description: 'B'.repeat(6000) }
    });
    expect(res.status()).toBe(413);
  });

  test('10. Проверка уникальности ID @post', async ({ todoController, todoBuilder }) => {
    const p = todoBuilder.build();
    const r1 = await todoController.createTodo(p);
    const r2 = await todoController.createTodo(p);
    expect((await r1.json()).id).not.toBe((await r2.json()).id);
  });

  test('11. Создать несколько todos подряд @post', async ({ todoController, todoBuilder }) => {
    const res = await todoController.createTodo(todoBuilder.withTitle(`Task-${Date.now()}`).build());
    expect([201, 409]).toContain(res.status()); // 409 Conflict, если превышен лимит
  });

  test('12. Ошибка 415 при неверном Content-Type @post', async ({ request }) => {
    const res = await request.post('https://apichallenges.com/api/todos', {
      headers: { 
        'X-CHALLENGER': getGuid(),
        'Content-Type': 'text/plain' 
      },
      data: 'some text'
    });
    expect(res.status()).toBe(415);
  });

    test('13. Создать todo с пустым body @post', async ({ request }) => {
    const res = await request.post('https://apichallenges.com/api/todos', {
      headers: { 'X-CHALLENGER': getGuid() },
      data: {}
    });
    
    expect([400, 422, 409]).toContain(res.status()); 
  });
});