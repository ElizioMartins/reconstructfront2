import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobSearchPage.css';
import Sidebar from '../../components/Sidebar';
import { searchJobById } from '../../services/auth'; 
import { createJob } from '../../services/event';

const JobSearchPage = () => {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [jobData, setJobData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newJobData, setNewJobData] = useState({
    name: '',
    description: '',
    shortKey: '',
    printTicketJob: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando ID:', searchId);
    if (!searchId.trim()) {
      setError('Por favor, insira um ID válido');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setShowCreateForm(false);
    
    setTimeout(async () => {
      try {
        const response = await searchJobById(searchId);
        console.log('Trabalho encontrado:', response);
        setJobData(response);
      } catch (error) {
        console.log('Erro ao buscar o trabalho:', error);
        setError('Trabalho nao encontrado');
        setJobData(null);
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const handleCreateButtonClick = () => {
    setShowCreateForm(true);
    setJobData(null);
    setError('');
  };
  
  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setNewJobData({
      name: '',
      description: '',
      shortKey: '',
      printTicketJob: ''
    });
  };
  
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewJobData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleCreateSubmit = async (e) => {
  e.preventDefault();

  try {
    const createdJob = await createJob(newJobData);
    console.log('Novo trabalho criado:', createdJob);
    setNewJobData({
      name: '',
      description: '',
      shortKey: '',
      printTicketJob: ''
    });
    setShowCreateForm(false);
    alert('Trabalho criado com sucesso!');
    setJobData(createdJob); // para mostrar detalhes, se quiser
  } catch (error) {
    console.error(error);
    alert('Erro ao criar trabalho: ' + error.message);
  }
};


  return (
    <div className="job-page-container">
      <Sidebar />
      <div className="job-content">
        <div className="job-header">
          <h1>{showCreateForm ? 'Novo Trabalho' : 'Trabalhos'}</h1>
          {!showCreateForm ? (
            <button 
              className="create-button" 
              onClick={handleCreateButtonClick}
            >
              Novo Trabalho
            </button>
          ) : (
            <button 
              className="back-to-search-button" 
              onClick={() => setShowCreateForm(false)}
            >
              Voltar para Busca
            </button>
          )}
        </div>
        
        <div className="job-search-container">
          {!showCreateForm && (
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Digite o ID do trabalho"
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
          )}
          
          {jobData && !showCreateForm && (
            <div className="job-result">
              <h2>Detalhes do Trabalho</h2>
              <div className="job-details">
                <div className="detail-item">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{jobData.uuid}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nome:</span>
                  <span className="detail-value">{jobData.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Descrição:</span>
                  <span className="detail-value">{jobData.description}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Chave Curta:</span>
                  <span className="detail-value">{jobData.shortKey}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ticket de Impressão:</span>
                  <span className="detail-value">{jobData.printTicketJob}</span>
                </div>
              </div>
            </div>
          )}
          
          {!showCreateForm && (
            <div className="search-tip">
              <p>Dica: Você pode usar o ID completo ou a chave curta para buscar um trabalho.</p>
              <p>Para teste, use o ID: 3fa85f64-5717-4562-b3fc-2c963f66afa6 ou 123</p>
            </div>
          )}
          
          {showCreateForm && (
            <div className="create-job-form">
              <h2>Cadastrar Novo Trabalho</h2>
              <form onSubmit={handleCreateSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nome do Trabalho</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newJobData.name}
                    onChange={handleCreateChange}
                    required
                    placeholder="Digite o nome do trabalho"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newJobData.description}
                    onChange={handleCreateChange}
                    required
                    placeholder="Digite a descrição do trabalho"
                    rows="4"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="shortKey">Chave Curta</label>
                  <input
                    type="text"
                    id="shortKey"
                    name="shortKey"
                    value={newJobData.shortKey}
                    onChange={handleCreateChange}
                    required
                    placeholder="Digite a chave curta"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="printTicketJob">Ticket de Impressão</label>
                  <input
                    type="text"
                    id="printTicketJob"
                    name="printTicketJob"
                    value={newJobData.printTicketJob}
                    onChange={handleCreateChange}
                    required
                    placeholder="Digite o ticket de impressão"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={handleCancelCreate}>
                    Cancelar
                  </button>
                  <button type="submit" className="submit-button">
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
