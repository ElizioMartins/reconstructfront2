import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventSearchPage.css';
import Sidebar from '../../components/Sidebar';
import { createEvent } from '../../services/event';

const EventSearchPage = () => {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEventData, setNewEventData] = useState({
    name: '',
    observation: '',
    shortKey: '',
    startAt: '',
    endAt: '',
    printTicketCelebration: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      setError('Por favor, insira um ID válido');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setShowCreateForm(false);
    
    setTimeout(() => {
      if (searchId === '3fa85f64-5717-4562-b3fc-2c963f66afa6' || searchId === '123') {
        setEventData({
          uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'Evento de Demonstração',
          observation: 'Este é um evento de demonstração para fins de teste',
          shortKey: 'EVT-001',
          startAt: '2025-05-25T10:00:00.000Z',
          endAt: '2025-05-25T18:00:00.000Z',
          printTicketCelebration: 'TICKET-EVT-2025-001'
        });
      } else {
        setError('Evento não encontrado');
        setEventData(null);
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const handleCreateButtonClick = () => {
    setShowCreateForm(true);
    setEventData(null);
    setError('');
  };
  
  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setNewEventData({
      name: '',
      observation: '',
      shortKey: '',
      startAt: '',
      endAt: '',
      printTicketCelebration: ''
    });
  };
  
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewEventData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
 const handleCreateSubmit = async (e) => {
  e.preventDefault();

  const newEvent = {
    uuid: crypto.randomUUID(),
    name: newEventData.name,
    observation: newEventData.observation,
    shortKey: newEventData.shortKey,
    startAt: new Date(newEventData.startAt).toISOString(),
    endAt: new Date(newEventData.endAt).toISOString(),
    printTicketCelebration: newEventData.printTicketCelebration,
  };

  try {
    console.log('Novo evento:', newEvent);
    const created = await createEvent(newEvent);
    console.log('Evento criado com sucesso:', created);

    alert('Evento criado com sucesso!');
    setNewEventData({
      name: '',
      observation: '',
      shortKey: '',
      startAt: '',
      endAt: '',
      printTicketCelebration: ''
    });
    setShowCreateForm(false);
    navigate('/eventos');
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    alert(`Erro ao criar evento: ${error.message}`);
  }
};

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="event-page-container">
      <Sidebar />
      <div className="event-content">
        <div className="event-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{showCreateForm ? 'Novo Evento' : 'Eventos'}</h1>
          <div>
            {!showCreateForm ? (
              <button 
                className="create-button" 
                onClick={handleCreateButtonClick}
              >
                Novo Evento
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
        </div>
        
        <div className="event-search-container">
          {!showCreateForm && (
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Digite o ID do evento"
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
          )}
          
          {eventData && !showCreateForm && (
            <div className="event-result">
              <h2>Detalhes do Evento</h2>
              <div className="event-details">
                <div className="detail-item">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{eventData.uuid}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nome:</span>
                  <span className="detail-value">{eventData.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Observação:</span>
                  <span className="detail-value">{eventData.observation}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Chave Curta:</span>
                  <span className="detail-value">{eventData.shortKey}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Início:</span>
                  <span className="detail-value">{formatDate(eventData.startAt)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Término:</span>
                  <span className="detail-value">{formatDate(eventData.endAt)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ticket de Impressão:</span>
                  <span className="detail-value">{eventData.printTicketCelebration}</span>
                </div>
              </div>
              
            </div>
          )}
          
          {!showCreateForm && (
            <div className="search-tip">
              <p>Dica: Você pode usar o ID completo ou a chave curta para buscar um evento.</p>
              <p>Para teste, use o ID: 3fa85f64-5717-4562-b3fc-2c963f66afa6 ou 123</p>
            </div>
          )}
          
          {showCreateForm && (
            <div className="create-event-form">
              <h2>Cadastrar Novo Evento</h2>
              <form onSubmit={handleCreateSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nome do Evento</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newEventData.name}
                    onChange={handleCreateChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="shortKey">Chave Curta</label>
                  <input
                    type="text"
                    id="shortKey"
                    name="shortKey"
                    value={newEventData.shortKey}
                    onChange={handleCreateChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startAt">Data/Hora de Início</label>
                    <input
                      type="datetime-local"
                      id="startAt"
                      name="startAt"
                      value={newEventData.startAt}
                      onChange={handleCreateChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endAt">Data/Hora de Término</label>
                    <input
                      type="datetime-local"
                      id="endAt"
                      name="endAt"
                      value={newEventData.endAt}
                      onChange={handleCreateChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="observation">Observação</label>
                  <textarea
                    id="observation"
                    name="observation"
                    value={newEventData.observation}
                    onChange={handleCreateChange}
                    rows="4"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="printTicketCelebration">Ticket de Impressão</label>
                  <input
                    type="text"
                    id="printTicketCelebration"
                    name="printTicketCelebration"
                    value={newEventData.printTicketCelebration}
                    onChange={handleCreateChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={handleCancelCreate}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="submit-button">
                    Salvar
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

export default EventSearchPage;
