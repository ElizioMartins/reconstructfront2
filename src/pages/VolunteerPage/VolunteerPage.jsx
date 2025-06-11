import React, { useState, useEffect } from 'react';
import './VolunteerPage.css';
import Sidebar from '../../components/Sidebar';
import { getOngoingCelebrations,  getVolunteersByCpf } from '../../services/celebration.js';

const VolunteerPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchCpf, setSearchCpf] = useState('');
  const [volunteerData, setVolunteerData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [timeData, setTimeData] = useState({ startAt: '', endAt: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await getOngoingCelebrations();
        setEvents(data || []);
      } catch (err) {
        setError('Erro ao carregar eventos.');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setCurrentStep(2);
    setError('');
    try {
      setIsLoading(true);
      if (event.locationList && event.locationList.length > 0) {
        const jobsFromLocations = event.locationList
          .flatMap(location => location.celebrationJobLocationList || [])
          .map(jobLocation => ({
            uuid: jobLocation.uuid,
            name: jobLocation.job?.name || 'Função sem nome',
            description: jobLocation.job?.description || '',
            location: location.name || '',
            staffMin: jobLocation.staffMin,
            staffMax: jobLocation.staffMax
          }));
        setJobs(jobsFromLocations);
      } else if (event.celebrationJobLocationList && event.celebrationJobLocationList.length > 0) {
        const jobsFromEvent = event.celebrationJobLocationList.map(jobLocation => ({
          uuid: jobLocation.uuid,
          name: jobLocation.job?.name || 'Função sem nome',
          description: jobLocation.job?.description || '',
          location: 'Geral',
          staffMin: jobLocation.staffMin,
          staffMax: jobLocation.staffMax
        }));

        setJobs(jobsFromEvent);
      } else {

        setJobs([]);
      }
      setIsLoading(false);
    } catch (err) {
      setError('Erro ao carregar funções do evento.');
      setIsLoading(false);
    }
  };

  const handleSearchVolunteer = async (e) => {
    e.preventDefault();

    if (!searchCpf.trim()) {
      setError('Por favor, insira um CPF válido');
      return;
    }

    setIsLoading(true);
    try {
      // Exemplo de requisição:
      const res = await getVolunteersByCpf(searchCpf);
      setVolunteerData(res);
      setCurrentStep(3);
      setError('');
    } catch (err) {
      setError('Voluntário não encontrado.');
    } finally {
      setIsLoading(false);
    }
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

  const handleConfirmAllocation = async (e) => {
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

    try {
      // Exemplo de requisição:
      // await axios.post('/api/allocations', dataToSend);
      alert('Alocação registrada com sucesso!');
      setCurrentStep(1);
      setSelectedEvent(null);
      setSearchCpf('');
      setVolunteerData(null);
      setSelectedJob(null);
      setTimeData({ startAt: '', endAt: '' });
      setError('');
    } catch (err) {
      setError('Erro ao confirmar a alocação.');
    }
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
            {isLoading ? (
              <p>Carregando eventos...</p>
            ) : (
              <div className="events-list">
                {events.length === 0 && !isLoading && <p>Nenhum evento disponível.</p>}
                {events.map((event, index) => {
                  const safeEvent = {
                    uuid: event.uuid || `event-${index}`,
                    name: event.name || 'Evento sem nome',
                    observation: event.observation || 'Sem observação',
                    shortKey: event.shortKey || 'N/A',
                    startAt: event.startAt || null,
                    endAt: event.endAt || null,
                  };
                  
                  return (
                    <div 
                      key={safeEvent.uuid} 
                      className="event-card"
                      onClick={() => handleSelectEvent(event)}
                    >
                      <h3>{safeEvent.name}</h3>
                      <div className="event-details">
                        <p><strong>Observação:</strong> {safeEvent.observation}</p>
                        <p><strong>Código:</strong> {safeEvent.shortKey}</p>
                        <p><strong>Início:</strong> {safeEvent.startAt ? formatDate(safeEvent.startAt) : 'Data não definida'}</p>
                        <p><strong>Término:</strong> {safeEvent.endAt ? formatDate(safeEvent.endAt) : 'Data não definida'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {error && <p className="error-message">{error}</p>}
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
                <p><strong>Nome:</strong> {volunteerData?.member.nomeCompleto}</p>
                <p><strong>CPF:</strong> {volunteerData?.member.cpf}</p>
                <p><strong>Cargo:</strong> {volunteerData?.member.cargo}</p>
              </div>
            </div>
            <h3 className="section-title">Funções Disponíveis</h3>
            <div className="jobs-list">
              {jobs.length === 0 && <p>Nenhuma função disponível para este evento.</p>}
              {jobs.map((job) => (
                <div 
                  key={job.uuid} 
                  className="job-card"
                  onClick={() => handleSelectJob(job)}
                >
                  <h3>{job.job.name}</h3>
                  <div className="job-details">
                    <p><strong>Local:</strong> {job.location.name}</p>
                    <p><strong>Descrição:</strong> {job.job.description}</p>
                    <div className="staff-info">
                      <p><strong>Voluntários:</strong> {job.staffList.length} de {job.staffMax}</p>
                      <div className="staff-bar">
                        <div 
                          className="staff-fill"
                          style={{ width: `${(job.staffList.length / job.staffMax) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                <p><strong>Nome:</strong> {volunteerData?.member.nomeCompleto}</p>
              </div>
              <div className="selected-job-info">
                <h3>Função</h3>
                <p><strong>Função:</strong> {selectedJob?.job.name}</p>
                <p><strong>Local:</strong> {selectedJob?.location.name}</p>
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
            <button className="back-button" onClick={handleBack}>
              Voltar
            </button>
          )}
        </div>

        <div className="volunteer-steps-indicator">
          {['Evento', 'Voluntário', 'Função', 'Horário'].map((label, i) => (
            <React.Fragment key={i}>
              <div className={`step ${currentStep >= i + 1 ? 'active' : ''}`}>
                <div className="step-number">{i + 1}</div>
                <div className="step-label">{label}</div>
              </div>
              {i < 3 && <div className="step-connector"></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="volunteer-main-container">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage;
