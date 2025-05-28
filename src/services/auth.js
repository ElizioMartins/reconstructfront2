export function login(username, password) {
  return fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  }).then(response => {
    if (!response.ok) {
      throw new Error('Login falhou');
    }
    return response.json(); 
  });
}