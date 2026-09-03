import { BOOKS, CATEGORIES } from '../data/books';

/**
 * Camada de abstração de API (Pronta para integração REST / Node.js)
 * 
 * Futuramente, basta trocar as Promises resolvidas localmente
 * por chamadas reais via axios / fetch:
 *   - GET /api/books
 *   - GET /api/books/:id
 *   - POST /api/orders
 *   - POST /api/chat
 */

const SIMULATE_DELAY_MS = 250;

const delay = (ms = SIMULATE_DELAY_MS) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Obter todos os livros com filtros opcionais
  async getBooks(filters = {}) {
    await delay();
    let result = [...BOOKS];

    if (filters.category && filters.category !== 'all') {
      if (filters.category === 'usados') {
        result = result.filter(b => b.condition === 'Usado');
      } else {
        result = result.filter(b => b.categorySlug === filters.category);
      }
    }

    if (filters.condition && filters.condition !== 'all') {
      result = result.filter(b => b.condition.toLowerCase() === filters.condition.toLowerCase());
    }

    if (filters.conditionState && filters.conditionState !== 'all') {
      result = result.filter(b => b.conditionState.toLowerCase() === filters.conditionState.toLowerCase());
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(b => b.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(b => b.price <= filters.maxPrice);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.replace(/-/g, '').includes(q.replace(/-/g, '')) ||
        b.category.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'bestseller':
          result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
          break;
        case 'relevance':
        default:
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return result;
  },

  // Obter livro por ID
  async getBookById(id) {
    await delay();
    const book = BOOKS.find(b => b.id === String(id));
    if (!book) {
      throw new Error('Livro não encontrado');
    }
    return book;
  },

  // Obter livros em destaque
  async getFeaturedBooks() {
    await delay();
    return BOOKS.filter(b => b.featured);
  },

  // Obter melhores achados de usados
  async getUsedBooksDeals() {
    await delay();
    return BOOKS.filter(b => b.condition === 'Usado').slice(0, 6);
  },

  // Obter categorias
  async getCategories() {
    await delay();
    return CATEGORIES;
  },

  // Simular criação de pedido
  async createOrder(orderData) {
    await delay(600);
    const orderId = 'LIV-' + Math.floor(100000 + Math.random() * 900000);
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      ...orderData,
      status: 'Confirmado / Em preparação'
    };

    // Salvar no histórico local
    try {
      const existingOrders = JSON.parse(localStorage.getItem('livra_orders') || '[]');
      existingOrders.unshift(order);
      localStorage.setItem('livra_orders', JSON.stringify(existingOrders));
    } catch (e) {
      console.error('Erro ao salvar pedido localmente:', e);
    }

    return order;
  },

  // Conexão com backend Node.js (conforme Manual Prático: POST http://localhost:3000/api/chat)
  async sendChatMessage(message) {
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mensagem: message }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          reply: data.resposta,
          suggestedBooks: []
        };
      }
    } catch (backendError) {
      // Caso o servidor Node.js ainda não esteja ligado, executa o mock inteligente
      console.info('Backend Node.js offline ou não iniciado. Utilizando resposta de demonstração local.');
    }

    await delay(700);
    const lower = message.toLowerCase();

    if (lower.includes('ficção') || lower.includes('distopia') || lower.includes('futuro') || lower.includes('orwell')) {
      return {
        reply: "Para os amantes de grandes narrativas e distopias, recomendo fortemente **1984** de George Orwell e a epopeia espacial **Duna** de Frank Herbert. Ambos exploram sociedades complexas e o espírito humano.",
        suggestedBooks: ["2", "4"]
      };
    } else if (lower.includes('filosofia') || lower.includes('existencialismo') || lower.includes('estoicismo')) {
      return {
        reply: "Em nossa seção de Filosofia, temos o clássico existencialista **O Mito de Sísifo** de Albert Camus e as reflexões estoicas eternas de **Meditações** por Marco Aurélio.",
        suggestedBooks: ["8", "21"]
      };
    } else if (lower.includes('usado') || lower.includes('barato') || lower.includes('promoção') || lower.includes('sebo')) {
      return {
        reply: "Temos excelentes achados em nosso sebo virtual! Por exemplo, **Crime e Castigo** (em estado Muito Bom por apenas R$ 34,90) e **Dom Casmurro** por R$ 24,50.",
        suggestedBooks: ["1", "3"]
      };
    } else if (lower.includes('brasileir') || lower.includes('machado') || lower.includes('brasil')) {
      return {
        reply: "A literatura brasileira tem joias inestimáveis na LIVRA. Confira o premiado **Torto Arado** de Itamar Vieira Junior e o eterno clássico **Dom Casmurro** de Machado de Assis.",
        suggestedBooks: ["3", "5"]
      };
    } else if (lower.includes('fantasia') || lower.includes('tolkien') || lower.includes('magia')) {
      return {
        reply: "Para mergulhar em mundos mágicos inesquecíveis, recomendo **O Hobbit** e **A Sociedade do Anel** de J.R.R. Tolkien. Edições primorosas com mapas e alta fidelidade.",
        suggestedBooks: ["6", "17"]
      };
    } else {
      return {
        reply: "Que ótimo interesse! Como assistente da livraria LIVRA, recomendo explorar os clássicos e destaques do nosso catálogo:",
        suggestedBooks: ["1", "19"]
      };
    }
  }
};
