import { test as base } from '@playwright/test';
import { TodoController } from '../controllers/todo.controller';
import { TodoFacade } from '../facades/todo.facade';
import { TodoBuilder } from '../builders/todo.builder';

export const test = base.extend({
  todoController: async ({ request }, use) => {
    await use(new TodoController(request));
  },
  todoFacade: async ({ todoController }, use) => {
    await use(new TodoFacade(todoController));
  },
  todoBuilder: async ({}, use) => {
    await use(new TodoBuilder());
  },
});

export { expect } from '@playwright/test';