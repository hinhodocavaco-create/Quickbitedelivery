# 🍔 QuickBite — Sistema de Delivery

Projeto desenvolvido para o Curso Técnico de Node.js.  
Back-end com Express, arrays em memória e métodos modernos de array.

---

## ▶️ Como rodar

### 1. Pré-requisito
Tenha o **Node.js** instalado. Verifique com:
```
node -v
```

### 2. Instale as dependências
Abra o terminal na pasta `quickbite` e rode:
```
npm install
```

### 3. Inicie o servidor
```
npm start
```
Você verá: `🚀 Servidor QuickBite rodando em http://localhost:3000`

### 4. Acesse no navegador
```
http://localhost:3000
```

---

## 📁 Estrutura do projeto

```
quickbite/
├── package.json        ← dependências e scripts
├── server.js           ← servidor Express com todas as rotas
└── public/
    └── index.html      ← interface web (formulários + relatórios)
```

---

## 🗺️ Rotas da API

| Método | Rota                                    | Fase | Descrição                         |
|--------|-----------------------------------------|------|-----------------------------------|
| POST   | /empresa                                | 2    | Cadastra nova empresa             |
| GET    | /empresas                               | 2    | Lista todas as empresas           |
| POST   | /produto/:empresaId                     | 3    | Cadastra produto em uma empresa   |
| GET    | /relatorio/cardapio/:empresaId          | 4    | Relatório com `.map()`            |
| GET    | /relatorio/categoria/:empresaId/:cat    | 4    | Relatório com `.filter()`         |
| GET    | /relatorio/total/:empresaId             | 4    | Relatório com `.reduce()`         |
| GET    | /relatorio/resumo                       | 4    | Relatório com `for...of`          |
| POST   | /pedido                                 | 5    | Simula um pedido completo         |

---

## ✅ Critérios de entrega atendidos

- [x] Servidor Express na porta 3000
- [x] Formulário HTML enviando dados via POST
- [x] Array de empresas com cadastros em memória
- [x] Produtos cadastrados por empresa
- [x] Relatório com `.map()`
- [x] Relatório com `.filter()`
- [x] Relatório com `.reduce()`
- [x] Resumo com `for...of`
- [x] Bônus: simulação de pedido (Fase 5)
