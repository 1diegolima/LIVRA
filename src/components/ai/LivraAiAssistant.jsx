import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { BOOKS } from '../../data/books';
import { formatCurrency } from '../../utils/formatters';

export const LivraAiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Olá! Sou o Assistente da LIVRA. Posso ajudar você a encontrar a leitura perfeita para o seu momento. Que tipo de história você está procurando hoje?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Quero uma boa distopia',
    'Recomende um clássico brasileiro',
    'Melhores achados usados',
    'Livros de fantasia épica'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await api.sendChatMessage(text);
      
      const suggestedBookObjects = response.suggestedBooks
        ? response.suggestedBooks.map(id => BOOKS.find(b => b.id === id)).filter(Boolean)
        : [];

      const botMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: response.reply,
        books: suggestedBookObjects
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          text: 'Desculpe, tive um contratempo ao consultar o acervo. Tente novamente em instantes!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside aria-label="Assistente Virtual LIVRA" className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-ink-900 to-ink-800 text-white rounded-full shadow-2xl hover:shadow-amber-500/20 hover:scale-105 border border-ink-700 transition-all duration-300"
          aria-label="Abrir Assistente LIVRA"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-ink-950 font-bold">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-tight flex items-center gap-1">
              Assistente LIVRA
              <span className="text-[10px] text-amber-300 font-normal px-1 py-0.2 bg-ink-950 rounded">IA</span>
            </p>
            <p className="text-[10px] text-ink-300">Descubra novos livros</p>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-paper-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-ink-900 text-white p-4 flex items-center justify-between border-b border-ink-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-ink-950 flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                  Assistente LIVRA
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded">
                    Beta IA
                  </span>
                </h4>
                <p className="text-[11px] text-ink-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online • Curadoria inteligente
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-800 transition-colors"
              aria-label="Fechar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-ink-900 text-white rounded-br-xs'
                      : 'bg-white text-ink-800 border border-paper-200 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Render Book Recommendations if present */}
                  {msg.books && msg.books.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-paper-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                        Sugestões recomendadas:
                      </p>
                      {msg.books.map((b) => (
                        <Link
                          key={b.id}
                          to={`/livro/${b.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2.5 p-2 bg-paper-50 hover:bg-paper-100 rounded-lg border border-paper-200 transition-colors group"
                        >
                          <img
                            src={b.image}
                            alt={b.title}
                            className="w-8 h-11 object-cover rounded shadow-2xs shrink-0"
                          />
                          <div className="overflow-hidden flex-1">
                            <p className="text-xs font-bold text-ink-900 truncate group-hover:text-amber-700">
                              {b.title}
                            </p>
                            <p className="text-[10px] text-ink-500 truncate">{b.author}</p>
                            <p className="text-xs font-bold text-ink-900 mt-0.5">
                              {formatCurrency(b.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-ink-500 text-xs p-2 bg-white rounded-xl border border-paper-200 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span>Analisando o acervo da LIVRA...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 bg-white border-t border-paper-200 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="whitespace-nowrap text-[11px] font-medium px-2.5 py-1 rounded-full bg-paper-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-paper-200 text-ink-700 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-paper-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua pergunta..."
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-paper-100 border border-paper-300 rounded-full focus:bg-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 text-ink-900"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2.5 bg-ink-900 text-white rounded-full hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 shadow-xs"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </aside>
  );
};
