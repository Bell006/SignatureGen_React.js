import React, { useState } from 'react';
import './App.css';
import { api } from './services/api';

function App() {
  const [formData, setFormData] = useState({
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

  const states = ['Acre', 'Alagoas', 'Bahia', 'Ceará', 'Goiás', 'Mato Grosso', 'Minas Gerais', 'Pará', 'Rio de Janeiro', 'São Paulo', 'Tocantins'];
  const regionals = ['Norte', 'Nordeste', 'Sul', 'Sudeste', 'Centro-Oeste'];

  const handleDownload = () => {
    if (downloadLink) {
      window.open(downloadLink, '_blank'); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
    setLoading(true); // Ativa o estado de loading
  
    try {
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
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
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
            Nome e sobrenome:
          </label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Ex: Maria da Silva' required />
        </div>

        <div className="inputWrapper">
          <label>
            Celular com DDD:
          </label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder='xx x xxxx-xxxx' required />
        </div>

        <div className="inputWrapper">
          <label>
            Departamento:
          </label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder='Ex: Administrativo' required />
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
              {states.map((state) => (
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