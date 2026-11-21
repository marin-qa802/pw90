// global-setup.js
import { request } from '@playwright/test';
import fs from 'fs';

export default async function globalSetup() {
  const context = await request.newContext();
  
  // 1. Создаем новую сессию челленджера
  const response = await context.post('https://apichallenges.eviltester.com/api/challenger', {
    headers: { 'Accept': 'application/json' }
  });

  if (response.status() !== 201) {
    throw new Error(`Не удалось создать челленджер. Статус: ${response.status()}`);
  }

  // 2. Получаем GUID из заголовка ответа
  const challengerGuid = response.headers()['x-challenger'];
  console.log('✅ Получен X-CHALLENGER:', challengerGuid);

  // 3. Сохраняем его в файл, чтобы контроллер мог его прочитать
  fs.writeFileSync('challenger.json', JSON.stringify({ guid: challengerGuid }));
  
  await context.dispose();
}