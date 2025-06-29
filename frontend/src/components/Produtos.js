import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    codigo_barras: ''
  });
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const buscarProdutos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/produtos');
      setProdutos(res.data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  const cadastrarOuAtualizarProduto = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.preco) {
      setError('Nome e preço são obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editandoId) {
        await axios.put(`http://localhost:3000/produtos/${editandoId}`, {
          ...form,
          preco: parseFloat(form.preco)
        });
      } else {
        await axios.post('http://localhost:3000/produtos', {
          ...form,
          preco: parseFloat(form.preco)
        });
      }

      setForm({ nome: '', descricao: '', preco: '', codigo_barras: '' });
      setEditandoId(null);
      buscarProdutos();
    } catch (err) {
      setError('Erro ao salvar produto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const solicitarExclusao = (produto) => {
    setProdutoSelecionado(produto);
    setShowModal(true);
  };

  const excluirProduto = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/produtos/${id}`);
      buscarProdutos();
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
    }
  };

  const confirmarExclusao = () => {
    if (produtoSelecionado) {
      excluirProduto(produtoSelecionado.id);
    }
    setShowModal(false);
    setProdutoSelecionado(null);
  };

  const iniciarEdicao = (produto) => {
    setEditandoId(produto.id);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      codigo_barras: produto.codigo_barras
    });
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  // Seus estilos continuam os mesmos, apenas removi o checkbox do modal
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
      justifyContent: 'center'
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
      <h2 style={styles.title}>Gerenciar Produtos</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form style={styles.form} onSubmit={cadastrarOuAtualizarProduto}>
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
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Preço"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
          step="0.01"
          min="0"
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Código de Barras"
          value={form.codigo_barras}
          onChange={(e) => setForm({ ...form, codigo_barras: e.target.value })}
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
            {loading
              ? 'Salvando...'
              : editandoId
              ? 'Atualizar Produto'
              : 'Cadastrar Produto'}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setForm({ nome: '', descricao: '', preco: '', codigo_barras: '' });
                setError(null);
              }}
              style={styles.buttonSecondary}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Lista de Produtos</h3>
      <ul style={styles.lista}>
        {produtos.map((p) => (
          <li key={p.id} style={styles.listaItem}>
            <div>
              <strong>{p.nome}</strong> - {p.descricao} | R$ {p.preco.toFixed(2)} | Código: {p.codigo_barras}
            </div>
            <div style={styles.botoesLista}>
              <button onClick={() => iniciarEdicao(p)} style={styles.buttonPrimary}>
                Editar
              </button>
              <button
                onClick={() => solicitarExclusao(p)}
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
            <p>Tem certeza que deseja excluir <strong>{produtoSelecionado?.nome}</strong>?</p>
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
