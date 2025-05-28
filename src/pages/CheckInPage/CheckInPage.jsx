import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckInPage.css';
import logoIssi from '../../assets/logo/logo-issi.svg';

const CheckInPage = () => {
  const navigate = useNavigate();
  
  // Dados de exemplo para os postos e suas ocupações
  const posts = [
    { id: 1, name: 'Posto 1', current: 5, total: 20, selected: true },
    { id: 2, name: 'Posto 2', current: 9, total: 10, selected: false },
    { id: 3, name: 'Posto 3', current: 50, total: 30, selected: false },
    { id: 4, name: 'Posto 4', current: 12, total: 15, selected: false },
    { id: 5, name: 'Posto 5', current: 3, total: 8, selected: false },
    { id: 6, name: 'Posto 6', current: 7, total: 10, selected: false }
  ];
  
  // Dados de exemplo para o posto selecionado
  const selectedPost = {
    name: 'Posto XYZ',
    person: 'Fulano de tal',
    division: 'Regional / Divisão'
  };
  
  const handleStart = () => {
    // Lógica para iniciar o trabalho no posto
    console.log('Iniciando trabalho no posto');
    // Navegação para a próxima página após iniciar
    navigate('/dashboard');
  };
  
  const handleBack = () => {
    // Voltar para a página de seleção de posto
    navigate('/post-selection');
  };
  
  const getStatusColor = (current, total) => {
    const ratio = current / total;
    if (ratio < 0.5) return '#4caf50'; // Verde para menos de 50%
    if (ratio < 0.9) return '#ff9800'; // Laranja para 50-90%
    return '#f44336'; // Vermelho para mais de 90%
  };
  
  const handleSelectPost = (postId) => {
    console.log('Posto selecionado:', postId);
    // Aqui você pode implementar a lógica para selecionar o posto
    // e atualizar os dados do posto selecionado
  };

  return (
    <div className="checkin-container">
      <div className="checkin-background">
        <div className="photo-credit">Foto: Acervo Insanos M.C.</div>
      </div>
      <div className="checkin-form-container">
        <div className="checkin-header">
          <div className="logo-title-container">
            <img src={logoIssi} alt="Logo" className="logo" />
            <div className="title-container">
              <h1>Sistema de Gestão</h1>
              <h2>de Staff</h2>
            </div>
          </div>
          <h2 className="staff-text">STAFF XYZ</h2>
        </div>

        <div className="checkin-content">
          <div className="posts-status-container">
            {posts.map(post => (
              <div 
                key={post.id} 
                className={`post-status-card ${post.selected ? 'selected' : ''}`}
                onClick={() => handleSelectPost(post.id)}
              >
                <div className="post-status-count">
                  #{post.current}/{post.total}
                </div>
                <div className="post-status-name">{post.name}</div>
              </div>
            ))}
          </div>

          <div className="selected-post-info">
            <h3>{selectedPost.name}</h3>
            <p>{selectedPost.person}</p>
            <p>{selectedPost.division}</p>
          </div>
          
          <div className="action-buttons-container">
            <button 
              className="action-button"
              onClick={handleStart}
            >
              Aceitar / Iniciar
            </button>
            <button 
              className="back-button"
              onClick={handleBack}
            >
              Trocar Posto
            </button>
          </div>
          
          <div className="support-contact">
            <button className="support-button">Contato com o suporte</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
