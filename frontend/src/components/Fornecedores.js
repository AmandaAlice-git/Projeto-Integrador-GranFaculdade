import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    contato: ''
  });
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);

  const buscarFornecedores = async () => {
    try {
      const res = await axios.get('http://localhost:3000/fornecedores');
      setFornecedores(res.data);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
    }
  };

  const cadastrarOuAtualizarFornecedor = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.cnpj) {
      setError('Nome e CNPJ são obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editandoId) {
        await axios.put(`http://localhost:3000/fornecedores/${editandoId}`, form);
      } else {
        await axios.post('http://localhost:3000/fornecedores', form);
      }

      setForm({ nome: '', cnpj: '', endereco: '', contato: '' });
      setEditandoId(null);
      buscarFornecedores();
    } catch (err) {
      setError('Erro ao salvar fornecedor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const solicitarExclusao = (fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setShowModal(true);
  };

  const excluirFornecedor = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/fornecedores/${id}`);
      buscarFornecedores();
    } catch (err) {
      console.error('Erro ao excluir fornecedor:', err);
    }
  };

  const confirmarExclusao = () => {
    if (fornecedorSelecionado) {
      excluirFornecedor(fornecedorSelecionado.id);
    }
    setShowModal(false);
    setFornecedorSelecionado(null);
  };

  const iniciarEdicao = (fornecedor) => {
    setEditandoId(fornecedor.id);
    setForm({
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      endereco: fornecedor.endereco,
      contato: fornecedor.contato
    });
  };

  useEffect(() => {
    buscarFornecedores();
  }, []);

  const styles = {
    container: {
      maxWidth: '700px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '30px'
    },
    input: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '16px'
    },
    buttonPrimary: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '12px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '16px',
      transition: 'background-color 0.3s'
    },
    buttonPrimaryDisabled: {
      backgroundColor: '#9CCC9C',
      cursor: 'not-allowed'
    },
    buttonSecondary: {
      backgroundColor: '#f44336',
      color: 'white',
      padding: '8px 12px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginLeft: '10px',
      fontSize: '14px'
    },
    lista: {
      listStyle: 'none',
      paddingLeft: '0'
    },
    listaItem: {
      padding: '12px',
      backgroundColor: 'white',
      borderRadius: '5px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
    },
    botoesLista: {
      display: 'flex',
      gap: '8px'
    },
    modalBackdrop: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalBox: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '10px',
      width: '320px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      fontSize: '16px',
      textAlign: 'center'
    },
    modalButtons: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      gap: '15px'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gerenciar Fornecedores</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form style={styles.form} onSubmit={cadastrarOuAtualizarFornecedor}>
        <input
          style={styles.input}
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="CNPJ"
          value={form.cnpj}
          onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Endereço"
          value={form.endereco}
          onChange={(e) => setForm({ ...form, endereco: e.target.value })}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Contato"
          value={form.contato}
          onChange={(e) => setForm({ ...form, contato: e.target.value })}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.buttonPrimary,
              ...(loading ? styles.buttonPrimaryDisabled : {})
            }}
          >
            {loading ? 'Salvando...' : editandoId ? 'Atualizar Fornecedor' : 'Cadastrar Fornecedor'}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setForm({ nome: '', cnpj: '', endereco: '', contato: '' });
                setError(null);
              }}
              style={styles.buttonSecondary}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Lista de Fornecedores</h3>
      <ul style={styles.lista}>
        {fornecedores.map((f) => (
          <li key={f.id} style={styles.listaItem}>
            <div>
              <strong>{f.nome}</strong> - CNPJ: {f.cnpj} | Endereço: {f.endereco} | Contato: {f.contato}
            </div>
            <div style={styles.botoesLista}>
              <button onClick={() => iniciarEdicao(f)} style={styles.buttonPrimary}>
                Editar
              </button>
              <button
                onClick={() => solicitarExclusao(f)}
                style={styles.buttonSecondary}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalBox}>
            <p>Tem certeza que deseja excluir <strong>{fornecedorSelecionado?.nome}</strong>?</p>
            <div style={styles.modalButtons}>
              <button onClick={confirmarExclusao} style={styles.buttonPrimary}>
                Confirmar
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={styles.buttonSecondary}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
