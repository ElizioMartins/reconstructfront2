import { getToken } from './auth';

/**
 * Cadastra um novo colaborador (staff)
 * @param {Object} staffData - Dados do colaborador a ser cadastrado
 * @returns {Promise} - Promise com o resultado da operação
 */
export async function createStaff(staffData) {
  const token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  const url = `${import.meta.env.REACT_APP_API_URL}/bpv/staffs`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(staffData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao cadastrar colaborador: ${response.status} ${errorText}`);
  }

  return await response.json();
}
