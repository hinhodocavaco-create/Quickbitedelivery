const express = require('express');
const app = express();

// ─────────────────────────────────────────────
//  Middlewares
// ─────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// ─────────────────────────────────────────────
//  Arrays em memória
// ─────────────────────────────────────────────
const empresas = [];
const pedidos  = [];

// ═════════════════════════════════════════════
//  FASE 2 — Cadastro de Empresa
// ═════════════════════════════════════════════

// POST /empresa — Cadastra uma nova empresa
app.post('/empresa', (req, res) => {
  const { nome, cnpj, endereco, culinaria, taxaEntrega } = req.body;

  if (!nome || !cnpj || !endereco || !culinaria || !taxaEntrega) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  const novaEmpresa = {
    id: Date.now(),
    nome,
    cnpj,
    endereco,
    culinaria,
    taxaEntrega: parseFloat(taxaEntrega),
    produtos: []          // cada empresa começa sem produtos
  };

  empresas.push(novaEmpresa);
  res.json({ mensagem: 'Empresa cadastrada!', empresa: novaEmpresa });
});

// GET /empresas — Retorna todas as empresas
app.get('/empresas', (req, res) => {
  res.json(empresas);
});

// ═════════════════════════════════════════════
//  FASE 3 — Cadastro de Produto
// ═════════════════════════════════════════════

// POST /produto/:empresaId — Cadastra produto na empresa informada
app.post('/produto/:empresaId', (req, res) => {
  // find() para localizar a empresa pelo ID
  const empresa = empresas.find(e => e.id === parseInt(req.params.empresaId));

  if (!empresa) {
    return res.status(404).json({ erro: 'Empresa não encontrada.' });
  }

  const { nome, descricao, preco, categoria } = req.body;

  if (!nome || !descricao || !preco || !categoria) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  const produto = {
    id: Date.now(),
    nome,
    descricao,
    preco: parseFloat(preco),
    categoria,
    disponivel: true
  };

  empresa.produtos.push(produto);
  res.json({ mensagem: 'Produto cadastrado!', produto });
});

// ═════════════════════════════════════════════
//  FASE 4 — Relatórios (map / filter / reduce / for...of)
// ═════════════════════════════════════════════

// ── .map() ──────────────────────────────────
// GET /relatorio/cardapio/:empresaId
// Retorna nome, preço formatado e categoria de cada produto
app.get('/relatorio/cardapio/:empresaId', (req, res) => {
  const empresa = empresas.find(e => e.id === parseInt(req.params.empresaId));
  if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada.' });

  const cardapio = empresa.produtos.map(p => ({
    nome: p.nome,
    preco: `R$ ${p.preco.toFixed(2)}`,
    categoria: p.categoria
  }));

  res.json({ empresa: empresa.nome, cardapio });
});

// ── .filter() ───────────────────────────────
// GET /relatorio/categoria/:empresaId/:categoria
// Retorna apenas os produtos de uma categoria específica e disponíveis
app.get('/relatorio/categoria/:empresaId/:categoria', (req, res) => {
  const empresa = empresas.find(e => e.id === parseInt(req.params.empresaId));
  if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada.' });

  const produtosFiltrados = empresa.produtos.filter(
    p =>
      p.categoria.toLowerCase() === req.params.categoria.toLowerCase() &&
      p.disponivel === true
  );

  res.json({
    empresa: empresa.nome,
    categoria: req.params.categoria,
    produtos: produtosFiltrados
  });
});

// ── .reduce() ───────────────────────────────
// GET /relatorio/total/:empresaId
// Calcula o valor total somando os preços de todos os produtos
app.get('/relatorio/total/:empresaId', (req, res) => {
  const empresa = empresas.find(e => e.id === parseInt(req.params.empresaId));
  if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada.' });

  // O 0 no final evita erros quando o array estiver vazio
  const total = empresa.produtos.reduce((acc, p) => acc + p.preco, 0);

  res.json({
    empresa: empresa.nome,
    totalProdutos: empresa.produtos.length,
    valorTotal: `R$ ${total.toFixed(2)}`
  });
});

// ── for...of ────────────────────────────────
// GET /relatorio/resumo
// Percorre todas as empresas e retorna nome, qtd de produtos e preço médio
app.get('/relatorio/resumo', (req, res) => {
  const resumo = [];

  for (const empresa of empresas) {
    const total = empresa.produtos.reduce((acc, p) => acc + p.preco, 0);
    const media =
      empresa.produtos.length > 0 ? total / empresa.produtos.length : 0;

    resumo.push({
      empresa: empresa.nome,
      totalProdutos: empresa.produtos.length,
      precoMedio: `R$ ${media.toFixed(2)}`
    });
  }

  res.json(resumo);
});

// ═════════════════════════════════════════════
//  FASE 5 — Simulação de Pedido (bônus)
// ═════════════════════════════════════════════

// POST /pedido
// Recebe empresaId e array de produtoIds, monta o pedido e calcula o total
app.post('/pedido', (req, res) => {
  const { empresaId, produtoIds } = req.body;

  const empresa = empresas.find(e => e.id === parseInt(empresaId));
  if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada.' });

  // .filter() — seleciona apenas os produtos pedidos e que estejam disponíveis
  const produtosSelecionados = empresa.produtos.filter(
    p => produtoIds.includes(p.id.toString()) && p.disponivel === true
  );

  if (produtosSelecionados.length === 0) {
    return res.status(400).json({ erro: 'Nenhum produto válido no pedido.' });
  }

  // .map() — gera a lista de itens com nome e preço
  const itens = produtosSelecionados.map(p => ({
    nome: p.nome,
    preco: p.preco
  }));

  // .reduce() — calcula o subtotal dos itens
  const subtotal     = itens.reduce((acc, item) => acc + item.preco, 0);
  const taxaEntrega  = empresa.taxaEntrega;
  const total        = subtotal + taxaEntrega;

  const pedido = {
    id: Date.now(),
    empresa: empresa.nome,
    itens,
    subtotal:     parseFloat(subtotal.toFixed(2)),
    taxaEntrega,
    total:        parseFloat(total.toFixed(2))
  };

  pedidos.push(pedido);
  res.json(pedido);
});

// ─────────────────────────────────────────────
//  Subir o servidor
// ─────────────────────────────────────────────
app.listen(3000, () => {
  console.log('🚀 Servidor QuickBite rodando em http://localhost:3000');
});
