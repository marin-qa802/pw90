// src/controllers/todo.controller.js
import fs from 'fs';
import { API_URLS } from '../config/api.config.js';

export class TodoController {
  constructor(request) {
    this.request = request;

    // Читаем сохраненный GUID
    let guid = '';
    try {
      const data = fs.readFileSync('challenger.json', 'utf8');
      guid = JSON.parse(data).guid;
    } catch (e) {
      console.warn('Внимание: challenger.json не найден. Запустите тесты, чтобы создать сессию.');
    }

    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CHALLENGER': guid,
    };
  }

  async getAllTodos(params = {}) {
    return await this.request.get(API_URLS.todos, {
      params,
      headers: this.headers,
    });
  }

  async getTodoById(id) {
    return await this.request.get(`${API_URLS.todos}/${id}`, { headers: this.headers });
  }

  async createTodo(payload) {
    return await this.request.post(API_URLS.todos, {
      data: payload,
      headers: this.headers,
    });
  }

  async updateTodo(id, payload) {
    return await this.request.put(`${API_URLS.todos}/${id}`, {
      data: payload,
      headers: this.headers,
    });
  }

  async patchTodo(id, payload) {
    return await this.request.patch(`${API_URLS.todos}/${id}`, {
      data: payload,
      headers: this.headers,
    });
  }

  async deleteTodo(id) {
    return await this.request.delete(`${API_URLS.todos}/${id}`, { headers: this.headers });
  }

  async deleteAllTodos() {
    const res = await this.getAllTodos();
    const body = await res.json();
    const todos = body.todos || [];

    for (const todo of todos) {
      await this.deleteTodo(todo.id);
    }
  }
}
