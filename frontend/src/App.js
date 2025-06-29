import React from 'react';
import Produtos from './components/Produtos';
import Fornecedores from './components/Fornecedores';
import Associacoes from './components/Associacoes';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '700', 
          color: '#2c3e50', 
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          letterSpacing: '2px',
          margin: 0
        }}>
          Sistema de Cadastro
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.2rem', marginTop: '8px' }}>
          Gerencie seus produtos, fornecedores e associações facilmente
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <Produtos />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <Fornecedores />
      </section>

      <section>
        <Associacoes />
      </section>
    </div>
  );
}

export default App;
