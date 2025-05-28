import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostSelectionPage.css';
import logoIssi from '../../assets/logo/logo-issi.svg';

const PostSelectionPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePostSelection = (post) => {
    setSelectedPost(post);
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    // Lógica para iniciar com o posto selecionado
    console.log('Posto selecionado:', selectedPost);
    // Navegação para a página de check-in
    navigate('/check-in');
  };

  // Dados de exemplo para os postos
  const posts = [
    { id: 1, name: 'Posto 1' },
    { id: 2, name: 'Posto 2' },
    { id: 3, name: 'Posto 3' },
    { id: 4, name: 'Posto 4' },
    { id: 5, name: 'Posto 5' },
    { id: 6, name: 'Posto 6' },
  ];

  // Dados de exemplo para o posto selecionado
  const postDetails = {
    name: 'Fulano de tal',
    division: 'Divisão XYZ',
    phone: 'Telefone'
  };

  return (
    <div className="post-selection-container">
      <div className="post-selection-background">
        <div className="photo-credit">Foto: Acervo Insanos M.C.</div>
      </div>
      <div className="post-selection-form-container">
        <div className="post-selection-header">
          <div className="logo-title-container">
            <img src={logoIssi} alt="Logo" className="logo" />
            <div className="title-container">
              <h1>Sistema de Gestão</h1>
              <h2>de Staff</h2>
            </div>
          </div>
          <h2 className="staff-text">STAFF XYZ</h2>
        </div>

        <div className="post-selection-form">
          <div className="form-group">
            <label>Selecione o Posto</label>
            <div className="dropdown-container">
              <div className="dropdown-header" onClick={toggleDropdown}>
                <span>{selectedPost ? selectedPost.name : 'Selecione o Posto'}</span>
                <span className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}>▼</span>
              </div>
              
              {isDropdownOpen && (
                <div className="dropdown-options">
                  {posts.map(post => (
                    <div 
                      key={post.id} 
                      className="dropdown-option"
                      onClick={() => handlePostSelection(post)}
                    >
                      {post.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedPost && (
            <div className="post-details">
              <h3>Posto XYZ</h3>
              <p>{postDetails.name}</p>
              <p>{postDetails.division}</p>
              <p>{postDetails.phone}</p>
            </div>
          )}
          
          <button 
            className="action-button"
            onClick={handleSubmit}
            disabled={!selectedPost}
          >
            Aceitar / Iniciar
          </button>
          
          <div className="support-contact">
            <button className="support-button">Contato com o suporte</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSelectionPage;
