# LIVRA — E-commerce de Livros Novos e Usados & Assistente IA

Plataforma completa de e-commerce de livros novos e usados com identidade visual editorial moderna e assistente de inteligência artificial integrado via **Google Gemini API** e **Node.js**.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** (Componentização e reatividade)
- **Vite 6** (Build tool e servidor rápido)
- **Tailwind CSS 3** (Design system responsivo e estilização editorial)
- **React Router v6** (Navegação SPA e sincronização de filtros na URL)
- **Lucide React** (Ícones vetoriais modernos)

### Backend & IA
- **Node.js** com **Express** (API REST e ES Modules)
- **@google/genai** (SDK oficial do Google Gemini com modelo `gemini-3.7-flash`)
- **dotenv** (Proteção de chaves de API)
- **cors** (Segurança de requisições de origem cruzada)

---

## 📁 Estrutura do Projeto

```
LIVRA/
├── src/
│   ├── components/       # Componentes modulares (AI, Book, Catalog, Common, UI)
│   ├── context/          # Context API (Cart, Favorites, Auth, Toast)
│   ├── data/             # Catálogo com 24 livros reais e capas oficiais
│   ├── layouts/          # Layout principal com Header, Footer e Assistente IA
│   ├── pages/            # 10 Páginas completas (Home, Catálogo, Livro, Carrinho, Checkout, etc.)
│   ├── services/         # Camada de comunicação com a API REST
│   └── utils/            # Formatadores de moeda, CPF, CEP e cálculos
├── backend-gemini/
│   ├── server.js         # Servidor Express com rota POST /api/chat e ancoragem de estoque
│   ├── catalog.json      # Base de grounding para a IA consultar o acervo real
│   ├── .env.example      # Exemplo de configuração de variáveis de ambiente
│   └── package.json
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🛠️ Como Executar o Projeto

### 1. Iniciar o Frontend
```bash
npm install
npm run dev
```
Acesse em: `http://localhost:5173`

### 2. Iniciar o Backend com a Gemini API
```bash
cd backend-gemini
npm install
node server.js
```
*(Certifique-se de configurar sua `GEMINI_API_KEY` no arquivo `.env` dentro de `backend-gemini/`)*
Servidor ativo em: `http://localhost:3000`

---

## ✨ Funcionalidades Principais
- 📖 **Catálogo Completo**: Filtros por categoria, preço, condição (novo/usado), estado de conservação e ordenações dinâmicas.
- 🔍 **Busca em Tempo Real**: Por título, autor, ISBN ou gênero.
- 🛒 **Carrinho e Checkout em 4 Etapas**: Frete grátis automático acima de R$ 120, cupom `LIVRA10`, simulação Pix com QR Code, Cartão e Boleto.
- 🤖 **Assistente LIVRA com IA**: Chat com grounding no acervo real da livraria para tirar dúvidas e recomendar livros.
- ❤️ **Favoritos & Perfil**: Histórico de pedidos e dados cadastrais persistidos no navegador.
