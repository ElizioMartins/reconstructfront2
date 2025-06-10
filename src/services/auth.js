export async function login(username, password) {
  console.log('calling login at: ', username, password);

  const url = `${import.meta.env.REACT_APP_API_URL}/auth/login`;
  console.log('calling login at', url);

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then(async (response) => {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data.token;
    })
    .catch((error) => {
      console.log(error);
      throw new Error('Login falhou');
    });
}

export function getToken() {
  return localStorage.getItem('token');
}

export async function searchJobById(id) {
  const token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  const response = await fetch(
    `${import.meta.env.REACT_APP_API_URL}/bpv/jobs/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    throw new Error('Trabalho não encontrado');
  }

  return response.json();
}
