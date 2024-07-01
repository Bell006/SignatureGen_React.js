import React, { useState } from 'react';
import './App.css';
import { api } from './services/api';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    city: '',
    state: ''
  });

  const [downloadLink, setDownloadLink] = useState('');
  const [loading, setLoading] = useState(false);

  console.log(downloadLink)

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
        console.error('Error:', error);
        alert('Erro ao criar a assinatura. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
    };
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
          <label>
            Cidade:
          </label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder='Ex: Goiânia' required />
        </div>

        <div className="inputWrapper">
          <label>
            Estado:
          </label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder='Ex: Goiás' required />
        </div>

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