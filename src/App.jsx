import React, { useState } from 'react';
import InputMask from "react-input-mask";
import './App.css';
import { api } from './services/api';

function App() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    department: '',
    city: '',
    state: '',
    regional: ''
  });

  const [downloadLink, setDownloadLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [isState, setIsState] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const states = ['Acre', 'Alagoas', 'Bahia', 'Ceará', 'Goiás', 'Mato Grosso', 'Maranhão', 'Minas Gerais', 'Pará', 'Rio de Janeiro', 'São Paulo', 'Tocantins', 'Amapá', 'Rio Grande do Sul', 'Roraima', 'Rondônia', 'Espírito Santo'];
  const regionals = ['Norte', 'Nordeste', 'Sul', 'Sudeste', 'Centro-Oeste'];
  const departments = ['Administrativo', 'Ambiental', 'Assessoria', 'Auditoria', 'Comercial', 'Contabilidade', 'Controladoria', 'Engenharia', 'Financeiro', 'Gente e Gestão', 'Gerente de Unidade', 'Jurídico', 'Manutenção', 'Marketing', 'Obras', 'Projetos', 'Projetos e Obras Corporativas', 'Recepção', 'SAC', 'Suprimentos', 'T.I'];

  let digit = /[0-9]/;
  let mobileMask = ['(', digit, digit, ')', ' ', '9', ' ', digit, digit, digit, digit, '-', digit, digit, digit, digit];

  const handleNumberBtn = (e) => {
    e.preventDefault();
    setIsMobile(!isMobile);

    setFormData(prevState => ({
      ...prevState,
      phone: ''
    }));
  }

  const handleDownload = () => {
    if (downloadLink) {
      window.open(downloadLink, '_blank'); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = () => {
    setIsState(!isState);
    setFormData({
      ...formData,
      state: '',
      regional: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
  
    try {
      setDownloadLink('');
      
      const response = await api.post('/create_signature', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const fileLink = response.data.image_url;
        setDownloadLink(fileLink);
      } else {
        alert(`${response.data.message}`);
      }
    } catch (error) {
      console.log('Error details:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else if (error.request) {
        alert('A requisição foi feita, mas não houve resposta. Verifique a configuração do servidor.');
      } else {
        alert('Erro ao criar a assinatura. Por favor, tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <h1>Gerador de assinaturas</h1>
      <form onSubmit={handleSubmit}>

        <div className="inputWrapper">
          <label>
            Email:
          </label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder='usuário@buritiempreendimentos.com.br' required />
        </div>

        <div className="inputWrapper">
          <label>
            Nome e sobrenome:
          </label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Ex: Maria da Silva' required />
        </div>

        <div className="inputWrapper">
          <label>
            {isMobile ? 'Celular com DDD:' : 'Telefone fixo com DDD:'}
          </label>
          <div className="phoneWrapper">
            <InputMask type='text' name='phone' value={formData.phone} onChange={handleChange} mask={isMobile ? mobileMask : '(99) 9999-9999'} required/>
            <button onClick={handleNumberBtn}>{isMobile ? 'Fixo' : 'Celular'}</button>
          </div>
        </div>

        <div className="inputWrapper">
          <label>
            Departamento:
          </label>
          <select 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled>Departamento</option>
              {departments.sort().map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
        </div>

        <div className="inputWrapper">

          <div className="checkWrapper">
            <label>
              Selecione para alternar entre estado e regional:
            </label>
            <input 
              type='checkbox'
              checked={isState}
              onChange={handleCheckboxChange}
            />
          </div>
          
          <label>{isState ? 'Estado' : 'Regional'}</label>

          {isState ? (
            <select 
              name="state" 
              value={formData.state} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled>Selecione o estado</option>
              {states.sort().map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          ) : (
            <select 
              name="regional" 
              value={formData.regional} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled>Selecione a regional</option>
              {regionals.map((regional) => (
                <option key={regional} value={regional}>{regional}</option>
              ))}
            </select>
          )}
        </div>

        {isState && (
          <div className="inputWrapper">
            <label>
              Cidade:
            </label>
            <input 
              type="text" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              placeholder='Ex: Goiânia' 
              required 
            />
          </div>
        )}

        <button type="submit" className="createButton" disabled={loading}>
          {loading ? 'Aguarde...' : 'Criar assinatura'}
        </button>

        {downloadLink && (
          <button type="button" onClick={handleDownload} className="downloadButton">
            Baixar
          </button>
        )}
      </form>
    </div>
  );
}

export default App;