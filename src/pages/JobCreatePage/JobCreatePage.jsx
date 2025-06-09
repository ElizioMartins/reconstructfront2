import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobCreatePage.css';
import Sidebar from '../../components/Sidebar';
import { createJob } from '../../services/event';

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
    setJobData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
};

  return (
    <div className="job-page-container">
      <Sidebar />
      <main className="job-content">
        <header className="job-header">
          <h1>Cadastrar Novo Trabalho</h1>
        </header>

        <section className="job-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome do Trabalho</label>
              <input
                id="name"
                name="name"
                type="text"
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
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="shortKey">Chave Curta</label>
              <input
                id="shortKey"
                name="shortKey"
                type="text"
                value={jobData.shortKey}
                onChange={handleChange}
                required
                placeholder="Digite a chave curta"
              />
            </div>

            <div className="form-group">
              <label htmlFor="printTicketJob">Ticket de Impressão</label>
              <input
                id="printTicketJob"
                name="printTicketJob"
                type="text"
                value={jobData.printTicketJob}
                onChange={handleChange}
                required
                placeholder="Digite o ticket de impressão"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="submit-button"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default JobCreatePage;
