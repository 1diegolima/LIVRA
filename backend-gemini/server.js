import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega o catálogo real da livraria LIVRA para grounding da IA
let catalog = [];
try {
  const rawCatalog = readFileSync(join(__dirname, 'catalog.json'), 'utf-8');
  catalog = JSON.parse(rawCatalog);
} catch (e) {
  console.error('Aviso: Não foi possível carregar catalog.json', e);
}

const app = express();

// Configuração do CORS (permite requisições do frontend Vite em desenvolvimento)
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000']
}));

app.use(express.json());

// Inicialização do cliente oficial Google Gen AI com a chave protegida no .env
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

app.post('/api/chat', async (req, res) => {
  try {
    const { mensagem } = req.body;

    // Validação de entrada
    if (!mensagem || typeof mensagem !== 'string' || mensagem.trim().length === 0) {
      return res.status(400).json({
        erro: 'Envie uma mensagem válida.',
      });
    }

    // Limite de caracteres para segurança (Desafio Prático do Manual)
    if (mensagem.length > 500) {
      return res.status(400).json({
        erro: 'A mensagem excede o limite máximo de 500 caracteres.',
      });
    }

    // Resumo dos livros disponíveis no estoque real da LIVRA
    const catalogSummary = catalog.map(b => 
      `- "${b.title}" por ${b.author} | Condição: ${b.condition} (${b.conditionState}) | Preço: R$ ${b.price.toFixed(2)} | Categoria: ${b.category}`
    ).join('\n');

    // Prompt com Grounding estrito no acervo real da LIVRA
    const prompt = [
      'Você é o Assistente Virtual oficial da livraria e sebo "LIVRA".',
      'Seu papel é orientar leitores de forma acolhedora, clara, elegante e precisa sobre os livros disponíveis no site.',
      '',
      '--- REGRAS MANDATÓRIAS SOBRE O ACERVO DA LIVRA ---',
      '1. Abaixo está a lista COMPLETA de livros cadastrados em nosso estoque atual:',
      catalogSummary,
      '',
      '2. VERIFICAÇÃO DE ESTOQUE:',
      '   - Se o usuário perguntar se temos um livro ESPECÍFICO (por exemplo "Noites Brancas", "Harry Potter", "Capitães da Areia", etc.) e esse título NÃO constar expressamente na lista acima:',
      '     * Diga claramente e com gentileza que NO MOMENTO NÃO TEMOS esse título em estoque na LIVRA.',
      '     * NUNCA afirme que temos em estoque um livro que não esteja na lista.',
      '     * Se tivermos outro livro do MESMO AUTOR ou do MESMO GÊNERO na lista acima (exemplo: se ele perguntar de "Noites Brancas", cite que temos "Crime e Castigo" do mesmo autor Fiódor Dostoiévski por R$ 34,90 em estado Muito Bom), ofereça-o como sugestão!',
      '   - Se o livro PERGUNTADO ESTIVER na lista, confirme que temos e informe o valor exato, a condição (Novo ou Usado) e o estado de conservação.',
      '',
      '3. Responda em português brasileiro bem pontuado, amigável e conciso.',
      '',
      `Pergunta do cliente: "${mensagem}"`
    ].join('\n');

    let outputText = '';

    // Utiliza a API de Interações / Modelos recomendada pelo SDK oficial
    try {
      if (ai.interactions && typeof ai.interactions.create === 'function') {
        const interaction = await ai.interactions.create({
          model: 'gemini-3.7-flash',
          input: prompt,
        });
        outputText = interaction.output_text || interaction.text;
      } else if (ai.models && typeof ai.models.generateContent === 'function') {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        outputText = response.text;
      }
    } catch (apiError) {
      console.error('Erro na chamada da Gemini API:', apiError);
      return res.status(500).json({
        erro: 'Falha ao consultar a Gemini API. Verifique sua GEMINI_API_KEY no arquivo .env.',
      });
    }

    res.json({
      resposta: outputText || 'Olá! Como posso ajudar você a encontrar sua próxima leitura na LIVRA?',
    });

  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({
      erro: 'Erro interno ao processar a mensagem.',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Servidor LIVRA Backend rodando em http://localhost:${PORT}`);
});
