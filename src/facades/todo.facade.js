import { TodoBuilder } from '../builders/todo.builder';

export class TodoFacade {
  constructor(todoController) {
    this.todoController = todoController;
  }

  async createDefaultTodo() {
    const payload = new TodoBuilder().build();
    return await this.todoController.createTodo(payload);
  }

  async createTodoWithTitle(title) {
    const payload = new TodoBuilder().withTitle(title).build();
    return await this.todoController.createTodo(payload);
  }

  async createAndGetTodo(title) {
    const createRes = await this.createTodoWithTitle(title);
    const body = await createRes.json();
    return await this.todoController.getTodoById(body.id);
  }
}