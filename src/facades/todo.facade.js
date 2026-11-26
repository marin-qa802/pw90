import { TodoBuilder } from '../builders/todo.builder.js';

export class TodoFacade {
  constructor(todoController) {
    this.todoController = todoController;
  }

  async deleteAllTodos() {
    return this.todoController.deleteAllTodos(); 
  }

  async createDefaultTodo() {
    const payload = new TodoBuilder().build();
    return this.todoController.createTodo(payload);
  }

  async createTodoWithTitle(title) {
    const payload = new TodoBuilder().withTitle(title).build();
    return this.todoController.createTodo(payload);
  }

  async createTodo(payload) {
    return this.todoController.createTodo(payload);
  }


  async getAllTodos(params = {}) {
    return this.todoController.getAllTodos(params);
  }

  async getTodoById(id) {
    return this.todoController.getTodoById(id);
  }

  // ОБНОВЛЕНИЕ (PUT) 

  async updateTodoWithData(id, payload) {
    return this.todoController.updateTodo(id, payload);
  }

  async updateExistingTodo(id, title, status) {
    const payload = new TodoBuilder()
      .withTitle(title)
      .withStatus(status)
      .build();
    return this.todoController.updateTodo(id, payload);
  }

  // ЧАСТИЧНОЕ ОБНОВЛЕНИЕ (PATCH) 

  async patchTodo(id, data) {
    return this.todoController.patchTodo(id, data);
  }

  // УДАЛЕНИЕ (DELETE) 

  async deleteTodo(id) {
    return this.todoController.deleteTodo(id);
  }
}