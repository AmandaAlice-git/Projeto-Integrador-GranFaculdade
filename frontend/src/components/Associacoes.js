import React, { useState, useEffect } from "react";
import axios from "axios";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div style={{ marginTop: 10 }}>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            marginRight: 5,
            padding: "5px 10px",
            backgroundColor: p === currentPage ? "#007bff" : "#eee",
            color: p === currentPage ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

export default function Associacoes() {
  // Dados globais
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  // Selecao
  const [produtoId, setProdutoId] = useState("");
  const [fornecedorId, setFornecedorId] = useState("");

  // Mensagem status
  const [mensagem, setMensagem] = useState("");

  // Dados associados
  const [fornecedoresDoProduto, setFornecedoresDoProduto] = useState([]);
  const [produtosDoFornecedor, setProdutosDoFornecedor] = useState([]);

  // Buscas dropdown
  const [buscaProdutoDropdown, setBuscaProdutoDropdown] = useState("");
  const [buscaFornecedorDropdown, setBuscaFornecedorDropdown] = useState("");

  // Buscas tabelas
  const [buscaFornecedoresTabela, setBuscaFornecedoresTabela] = useState("");
  const [buscaProdutosTabela, setBuscaProdutosTabela] = useState("");

  // Paginação
  const ITEMS_PER_PAGE = 5;

  // Páginas atuais
  const [paginaFornecedores, setPaginaFornecedores] = useState(1);
  const [paginaProdutos, setPaginaProdutos] = useState(1);

  // Buscar produtos e fornecedores para dropdown
  useEffect(() => {
    axios
      .get("http://localhost:3000/produtos")
      .then((res) => setProdutos(res.data))
      .catch((e) => console.error("Erro ao buscar produtos:", e));

    axios
      .get("http://localhost:3000/fornecedores")
      .then((res) => setFornecedores(res.data))
      .catch((e) => console.error("Erro ao buscar fornecedores:", e));
  }, []);

  // Buscar associações
  const buscarAssociacoes = () => {
    if (produtoId) {
      axios
        .get(`http://localhost:3000/produtos/${produtoId}/fornecedores`)
        .then((res) => {
          const ordenados = res.data.sort((a, b) =>
            a.nome.localeCompare(b.nome)
          );
          setFornecedoresDoProduto(ordenados);
          setPaginaFornecedores(1);
          setBuscaFornecedoresTabela("");
        })
        .catch((e) => console.error("Erro ao buscar fornecedores do produto:", e));
    } else {
      setFornecedoresDoProduto([]);
    }

    if (fornecedorId) {
      axios
        .get(`http://localhost:3000/fornecedores/${fornecedorId}/produtos`)
        .then((res) => {
          const ordenados = res.data.sort((a, b) => a.nome.localeCompare(b.nome));
          setProdutosDoFornecedor(ordenados);
          setPaginaProdutos(1);
          setBuscaProdutosTabela("");
        })
        .catch((e) => console.error("Erro ao buscar produtos do fornecedor:", e));
    } else {
      setProdutosDoFornecedor([]);
    }
  };

  useEffect(() => {
    buscarAssociacoes();
  }, [produtoId, fornecedorId]);

  // Associar produto a fornecedor
  const associar = async () => {
    if (!produtoId || !fornecedorId) {
      setMensagem("Selecione um produto e um fornecedor.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/associacoes", {
        produto_id: produtoId,
        fornecedor_id: fornecedorId,
      });
      setMensagem("Associação feita com sucesso!");
      buscarAssociacoes();
    } catch (err) {
      setMensagem("Erro ao associar.");
      console.error(err);
    }
  };

  // Desassociar com confirmação
  const desassociar = async (produto_id, fornecedor_id) => {
    if (
      !window.confirm(
        "Tem certeza que deseja desassociar este produto e fornecedor?"
      )
    )
      return;

    try {
      await axios.delete("http://localhost:3000/associacoes", {
        data: { produto_id, fornecedor_id },
      });
      setMensagem("Associação removida com sucesso!");
      buscarAssociacoes();
    } catch (err) {
      setMensagem("Erro ao desassociar.");
      console.error(err);
    }
  };

  // Filtrar dropdowns
  const produtosFiltradosDropdown = produtos.filter((p) =>
    p.nome.toLowerCase().includes(buscaProdutoDropdown.toLowerCase())
  );
  const fornecedoresFiltradosDropdown = fornecedores.filter((f) =>
    f.nome.toLowerCase().includes(buscaFornecedorDropdown.toLowerCase())
  );

  // Filtrar tabelas
  const fornecedoresFiltradosTabela = fornecedoresDoProduto.filter((f) =>
    f.nome.toLowerCase().includes(buscaFornecedoresTabela.toLowerCase())
  );
  const produtosFiltradosTabela = produtosDoFornecedor.filter((p) =>
    p.nome.toLowerCase().includes(buscaProdutosTabela.toLowerCase())
  );

  // Paginar resultados tabelas
  const paginaMaxFornecedores = Math.ceil(
    fornecedoresFiltradosTabela.length / ITEMS_PER_PAGE
  );
  const paginaMaxProdutos = Math.ceil(
    produtosFiltradosTabela.length / ITEMS_PER_PAGE
  );

  const fornecedoresPag = fornecedoresFiltradosTabela.slice(
    (paginaFornecedores - 1) * ITEMS_PER_PAGE,
    paginaFornecedores * ITEMS_PER_PAGE
  );
  const produtosPag = produtosFiltradosTabela.slice(
    (paginaProdutos - 1) * ITEMS_PER_PAGE,
    paginaProdutos * ITEMS_PER_PAGE
  );

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20, fontFamily: "Arial" }}>
      <h2>Associar Produto a Fornecedor</h2>

      {mensagem && (
        <p
          style={{
            color: mensagem.includes("Erro") ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {mensagem}
        </p>
      )}

      {/* Seleção Produto */}
      <div style={{ marginBottom: 15 }}>
        <label>
          Buscar Produto:
          <input
            type="text"
            value={buscaProdutoDropdown}
            onChange={(e) => setBuscaProdutoDropdown(e.target.value)}
            placeholder="Filtrar produtos..."
            style={{ marginLeft: 8, padding: 5, width: "60%" }}
          />
        </label>
        <br />
        <select
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          style={{ marginTop: 5, width: "100%", padding: 8 }}
        >
          <option value="">Selecione um produto</option>
          {produtosFiltradosDropdown.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Seleção Fornecedor */}
      <div style={{ marginBottom: 20 }}>
        <label>
          Buscar Fornecedor:
          <input
            type="text"
            value={buscaFornecedorDropdown}
            onChange={(e) => setBuscaFornecedorDropdown(e.target.value)}
            placeholder="Filtrar fornecedores..."
            style={{ marginLeft: 8, padding: 5, width: "60%" }}
          />
        </label>
        <br />
        <select
          value={fornecedorId}
          onChange={(e) => setFornecedorId(e.target.value)}
          style={{ marginTop: 5, width: "100%", padding: 8 }}
        >
          <option value="">Selecione um fornecedor</option>
          {fornecedoresFiltradosDropdown.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={associar}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          marginBottom: 30,
        }}
      >
        Associar
      </button>

      {/* Lista fornecedores do produto */}
      {produtoId && (
        <div>
          <h3>Fornecedores do Produto Selecionado</h3>
          <input
            type="text"
            placeholder="Buscar fornecedores na lista..."
            value={buscaFornecedoresTabela}
            onChange={(e) => setBuscaFornecedoresTabela(e.target.value)}
            style={{
              padding: 5,
              marginBottom: 10,
              width: "100%",
              boxSizing: "border-box",
            }}
          />

          {fornecedoresPag.length > 0 ? (
            <>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: 10,
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th style={{ border: "1px solid #ddd", padding: 8 }}>
                      Nome
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: 8 }}>
                      CNPJ
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: 8 }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedoresPag.map((f) => (
                    <tr key={f.id}>
                      <td style={{ border: "1px solid #ddd", padding: 8 }}>
                        {f.nome}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: 8 }}>
                        {f.cnpj}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: 8 }}>
                        <button
                          onClick={() => desassociar(produtoId, f.id)}
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Desassociar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={paginaFornecedores}
                totalPages={paginaMaxFornecedores}
                onPageChange={setPaginaFornecedores}
              />
            </>
          ) : (
            <p>Nenhum fornecedor associado.</p>
          )}
        </div>
      )}

      {/* Lista produtos do fornecedor */}
      {fornecedorId && (
        <div style={{ marginTop: 40 }}>
          <h3>Produtos do Fornecedor Selecionado</h3>
          <input
            type="text"
            placeholder="Buscar produtos na lista..."
            value={buscaProdutosTabela}
            onChange={(e) => setBuscaProdutosTabela(e.target.value)}
            style={{
              padding: 5,
              marginBottom: 10,
              width: "100%",
              boxSizing: "border-box",
            }}
          />

          {produtosPag.length > 0 ? (
            <>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: 10,
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th style={{ border: "1px solid #ddd", padding: 8 }}>
                      Nome
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: 8 }}>
                      Preço
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: 8 }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {produtosPag.map((p) => (
                    <tr key={p.id}>
                      <td style={{ border: "1px solid #ddd", padding: 8 }}>
                        {p.nome}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: 8 }}>
                        R$ {p.preco}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: 8 }}>
                        <button
                          onClick={() => desassociar(p.id, fornecedorId)}
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Desassociar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={paginaProdutos}
                totalPages={paginaMaxProdutos}
                onPageChange={setPaginaProdutos}
              />
            </>
          ) : (
            <p>Nenhum produto associado.</p>
          )}
        </div>
      )}
    </div>
  );
}
