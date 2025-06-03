import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VolunteerPage.css';
import Sidebar from '../../components/Sidebar';

const VolunteerPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchCpf, setSearchCpf] = useState('');
  const [volunteerData, setVolunteerData] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [timeData, setTimeData] = useState({
    startAt: '',
    endAt: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mockEvents = [
    {
      uuid: "1",
      name: "Evento 1",
      observation: "Descrição do evento",
      shortKey: "EV-01",
      startAt: "2025-06-05T08:00:00.000Z",
      endAt: "2025-06-05T18:00:00.000Z"
    }
  ];

  const mockVolunteerData = {
    uuid: "1",
    member: {
      cpf: "12345678900",
      nomeCompleto: "Nome do Voluntário",
      cargo: "Cargo"
    }
  };

  const mockJobs = [
    {
      uuid: "1",
      location: { name: "Local 1" },
      job: {
        name: "Função 1",
        description: "Descrição da função"
      },
      staffMax: 3,
      staffList: []
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setCurrentStep(2);
    setError('');
  };

  const handleSearchVolunteer = (e) => {
    e.preventDefault();
    
    if (!searchCpf.trim()) {
      setError('Por favor, insira um CPF válido');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      setVolunteerData(mockVolunteerData);
      setCurrentStep(3);
      setIsLoading(false);
    }, 300);
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    
    if (selectedEvent) {
      const eventStart = new Date(selectedEvent.startAt);
      const eventEnd = new Date(selectedEvent.endAt);
      
      const formatDateForInput = (date) => {
        return date.toISOString().slice(0, 16);
      };
      
      setTimeData({
        startAt: formatDateForInput(eventStart),
        endAt: formatDateForInput(eventEnd)
      });
    }
    
    setCurrentStep(4);
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const updatedTimeData = {
      ...timeData,
      [name]: value
    };
    
    setTimeData(updatedTimeData);
    
    if (updatedTimeData.startAt && updatedTimeData.endAt) {
      if (updatedTimeData.startAt >= updatedTimeData.endAt) {
        setError('A hora de início deve ser anterior à hora de término');
      } else {
        setError('');
      }
    }
  };

  const handleConfirmAllocation = (e) => {
    e.preventDefault();
    
    if (timeData.startAt >= timeData.endAt) {
      setError('A hora de início deve ser anterior à hora de término');
      return;
    }
    
    const dataToSend = {
      eventId: selectedEvent?.uuid,
      volunteerId: volunteerData?.uuid,
      jobId: selectedJob?.uuid,
      startAt: timeData.startAt,
      endAt: timeData.endAt
    };
    
    console.log('Dados prontos para envio:', dataToSend);
    
    alert('Funcionalidade preparada para integração');
    
    setCurrentStep(1);
    setSelectedEvent(null);
    setSearchCpf('');
    setVolunteerData(null);
    setSelectedJob(null);
    setTimeData({ startAt: '', endAt: '' });
    setError('');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="volunteer-events">
            <h2>Selecione um Evento</h2>
            <div className="events-list">
              <div 
                key="1" 
                className="event-card"
                onClick={() => handleSelectEvent(mockEvents[0])}
              >
                <h3>Evento 1</h3>
                <div className="event-details">
                  <p><strong>Observação:</strong> Descrição do evento</p>
                  <p><strong>Código:</strong> EV-01</p>
                  <p><strong>Início:</strong> {formatDate(mockEvents[0].startAt)}</p>
                  <p><strong>Término:</strong> {formatDate(mockEvents[0].endAt)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="volunteer-search">
            <h2>Buscar Voluntário</h2>
            <div className="selected-event-info">
              <h3>Evento Selecionado</h3>
              <p><strong>Nome:</strong> {selectedEvent.name}</p>
              <p><strong>Código:</strong> {selectedEvent.shortKey}</p>
              <p><strong>Período:</strong> {formatDate(selectedEvent.startAt)} até {formatDate(selectedEvent.endAt)}</p>
            </div>
            
            <form onSubmit={handleSearchVolunteer} className="search-form">
              <div className="search-input-group">
                <input
                  type="text"
                  value={searchCpf}
                  onChange={(e) => setSearchCpf(e.target.value)}
                  placeholder="Digite o CPF do voluntário"
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
            
            <div className="search-tip">
              <p>Digite o CPF do voluntário para continuar</p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="volunteer-job-selection">
            <h2>Selecionar Função</h2>
            
            <div className="selected-info">
              <div className="selected-event-info">
                <h3>Evento</h3>
                <p><strong>Nome:</strong> {selectedEvent.name}</p>
                <p><strong>Código:</strong> {selectedEvent.shortKey}</p>
              </div>
              
              <div className="selected-volunteer-info">
                <h3>Voluntário</h3>
                <p><strong>Nome:</strong> {volunteerData.member.nomeCompleto}</p>
                <p><strong>CPF:</strong> {volunteerData.member.cpf}</p>
                <p><strong>Cargo:</strong> {volunteerData.member.cargo}</p>
              </div>
            </div>
            
            <h3 className="section-title">Funções Disponíveis</h3>
            <div className="jobs-list">
              <div 
                key="1" 
                className="job-card"
                onClick={() => handleSelectJob(mockJobs[0])}
              >
                <h3>Função 1</h3>
                <div className="job-details">
                  <p><strong>Local:</strong> Local 1</p>
                  <p><strong>Descrição:</strong> Descrição da função</p>
                  <div className="staff-info">
                    <p><strong>Voluntários:</strong> 0 de 3</p>
                    <div className="staff-bar">
                      <div 
                        className="staff-fill"
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="volunteer-time-selection">
            <h2>Definir Horário</h2>
            
            <div className="selected-info">
              <div className="selected-event-info">
                <h3>Evento</h3>
                <p><strong>Nome:</strong> {selectedEvent.name}</p>
              </div>
              
              <div className="selected-volunteer-info">
                <h3>Voluntário</h3>
                <p><strong>Nome:</strong> {volunteerData.member.nomeCompleto}</p>
              </div>
              
              <div className="selected-job-info">
                <h3>Função</h3>
                <p><strong>Função:</strong> {selectedJob.job.name}</p>
                <p><strong>Local:</strong> {selectedJob.location.name}</p>
              </div>
            </div>
            
            <form onSubmit={handleConfirmAllocation} className="time-form">
              <h3 className="section-title">Definir Período de Atuação</h3>
              
              <div className="form-group">
                <label htmlFor="startAt">Horário de Início</label>
                <input
                  type="datetime-local"
                  id="startAt"
                  name="startAt"
                  value={timeData.startAt}
                  onChange={handleTimeChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endAt">Horário de Término</label>
                <input
                  type="datetime-local"
                  id="endAt"
                  name="endAt"
                  value={timeData.endAt}
                  onChange={handleTimeChange}
                  required
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="confirm-button"
                  disabled={!!error || !timeData.startAt || !timeData.endAt}
                >
                  Confirmar Alocação
                </button>
              </div>
            </form>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="volunteer-page-container">
      <Sidebar />
      <div className="volunteer-content">
        <div className="volunteer-header">
          <h1>Voluntariado</h1>
          {currentStep > 1 && (
            <button 
              className="back-button" 
              onClick={handleBack}
            >
              Voltar
            </button>
          )}
        </div>
        
        <div className="volunteer-steps-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Evento</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Voluntário</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Função</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Horário</div>
          </div>
        </div>
        
        <div className="volunteer-main-container">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage;
