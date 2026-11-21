// src/controllers/todo.controller.js
import fs from 'fs';

export class TodoController {
  constructor(request) {
    this.request = request;
    this.baseUrl = 'https://apichallenges.eviltester.com';
    
    // Читаем сохраненный GUID
    let guid = '';
    try {
      const data = fs.readFileSync('challenger.json', 'utf8');
      guid = JSON.parse(data).guid;
    } catch (e) {
      console.warn('Внимание: challenger.json не найден. Запустите тесты, чтобы создать сессию.');
    }

    // Формируем заголовки
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CHALLENGER': guid // <-- Передаем GUID
    };
  }

  async getAllTodos() {
    return await this.request.get(`${this.baseUrl}/api/todos`, { headers: this.headers });
  }

  async getTodoById(id) {
    return await this.request.get(`${this.baseUrl}/todos/${id}`, { headers: this.headers });
  }

  async createTodo(payload) {
    return await this.request.post(`${this.baseUrl}/todos`, { 
      data: payload,
      headers: this.headers 
    });
  }

  async updateTodo(id, payload) {
    return await this.request.put(`${this.baseUrl}/todos/${id}`, { 
      data: payload,
      headers: this.headers 
    });
  }

  async patchTodo(id, payload) {
    return await this.request.patch(`${this.baseUrl}/todos/${id}`, { 
      data: payload,
      headers: this.headers 
    });
  }

  async deleteTodo(id) {
    return await this.request.delete(`${this.baseUrl}/todos/${id}`, { headers: this.headers });
  }
}