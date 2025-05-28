import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobCreatePage.css';
import Sidebar from '../../components/Sidebar';

const JobCreatePage = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    name: '',
    description: '',
    shortKey: '',
    printTicketJob: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newJob = {
      uuid: crypto.randomUUID(),
      ...jobData
    };
    
    console.log('Novo trabalho criado:', newJob);
    
    setJobData({
      name: '',
      description: '',
      shortKey: '',
      printTicketJob: ''
    });
    
    alert('Trabalho criado com sucesso!');
  };

  return (
    <div className="job-page-container">
      <Sidebar />
      <div className="job-content">
        <div className="job-header">
          <h1>Cadastrar Novo Trabalho</h1>
        </div>
        
        <div className="job-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome do Trabalho</label>
              <input
                type="text"
                id="name"
                name="name"
                value={jobData.name}
                onChange={handleChange}
                required
                placeholder="Digite o nome do trabalho"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
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
                value={jobData.shortKey}
                onChange={handleChange}
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
                value={jobData.printTicketJob}
                onChange={handleChange}
                required
                placeholder="Digite o ticket de impressão"
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => navigate('/dashboard')}>
                Cancelar
              </button>
              <button type="submit" className="submit-button">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobCreatePage;
