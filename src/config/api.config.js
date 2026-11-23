// Единый источник адреса API для всех слоёв: контроллер, фасад, спеки.
export const API_BASE_URL = process.env.API_BASE_URL ?? 'https://apichallenges.com';

export const API_URLS = {
  todos: `${API_BASE_URL}/api/todos`,
  todo: `${API_BASE_URL}/api/todo`, 
  challenger: `${API_BASE_URL}/api/challenger`,
};
