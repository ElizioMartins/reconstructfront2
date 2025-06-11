import { getToken } from './auth';

export async function createJob(newJobData) {
  const token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/bpv/jobs`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(newJobData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ao criar job: ${res.status} ${errorText}`);
  }
  return await res.json();
}


export async function createEvent(newEventData) {
  const token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/bpv/celebrations`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(newEventData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ao criar evento: ${res.status} ${errorText}`);
  }
  return await res.json();
}