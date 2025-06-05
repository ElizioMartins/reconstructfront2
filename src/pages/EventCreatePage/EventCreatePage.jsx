import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventCreatePage.css';
import Sidebar from '../../components/Sidebar';

const EventCreatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    observation: '',
    shortKey: '',
    startAt: '',
    endAt: '',
    printTicketCelebration: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Evento criado:', {
        ...eventData,
        uuid: crypto.randomUUID()
      });
      
      setIsSubmitting(false);
      alert('Evento criado com sucesso!');
      navigate('/eventos'); 
    }, 1500);
  };
  
  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
      navigate('/eventos'); 
    }
  };
  
  return (
    <div className="event-page-container">
      <Sidebar />
      <div className="event-content">
        <div className="event-header">
          <h1>Novo Evento</h1>
        </div>
        
        <div className="event-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome do Evento</label>
              <input
                type="text"
                id="name"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                placeholder="Digite o nome do evento"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="shortKey">Chave Curta</label>
              <input
                type="text"
                id="shortKey"
                name="shortKey"
                value={eventData.shortKey}
                onChange={handleChange}
                placeholder="Ex: EVT-001"
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
                  value={eventData.startAt}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endAt">Data/Hora de Término</label>
                <input
                  type="datetime-local"
                  id="endAt"
                  name="endAt"
                  value={eventData.endAt}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="observation">Observação</label>
              <textarea
                id="observation"
                name="observation"
                value={eventData.observation}
                onChange={handleChange}
                placeholder="Detalhes adicionais sobre o evento"
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="printTicketCelebration">Ticket de Impressão</label>
              <input
                type="text"
                id="printTicketCelebration"
                name="printTicketCelebration"
                value={eventData.printTicketCelebration}
                onChange={handleChange}
                placeholder="Ex: TICKET-EVT-2025-001"
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventCreatePage;
