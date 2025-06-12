import { getToken } from './auth';

export async function getOngoingCelebrations() {
  const token = getToken();
  if (!token) throw new Error('Usuário não autenticado');
  const url = `${import.meta.env.REACT_APP_API_URL}/bpv/celebrations/ongoing`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }).then(async (response) => {
    const data = await response.json();
    return data;
  }).catch((error) => {
    console.log(error);
    const errorText = error.text();
    throw new Error(`Erro ao buscar celebrações: ${errorText}`);
  });
}

export async function getVolunteersByCpf(cpf) {
  const token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (!cpf) throw new Error('CPF é obrigatório');
  
  // Limpa o CPF (remove caracteres não numéricos)
  const cleanCpf = cpf.replace(/\D/g, '');
  
  const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/bpv/cpf/${cleanCpf}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ao buscar voluntários: ${res.status} ${errorText}`);
  }
  
  return await res.json();
}

export async function getVolunteerBpvByCpf(cpf) {
  const token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (!cpf) throw new Error('CPF é obrigatório');
  
  const cleanCpf = cpf.replace(/\D/g, '');
  
  const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/bpv/cpf/${cleanCpf}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ao buscar informações do BPV: ${res.status} ${errorText}`);
  }
  
  return await res.json();
}
