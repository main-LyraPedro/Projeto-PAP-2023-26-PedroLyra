import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! 👋 Sou o EcoBot, seu assistente para sustentabilidade. Como posso ajudá-lo hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = [
    'Que ótima pergunta! 🌱 A reciclagem é essencial para reduzir o desperdício.',
    'Posso te ajudar com isso! 💚 Vamos começar com pequenas mudanças diárias.',
    'Excelente iniciativa! 🌍 Cada ação conta para um futuro sustentável.',
    'Fico feliz em ajudar! ♻️ Juntos podemos fazer a diferença.',
    'Interessante! 🌿 Você sabia que pequenas ações têm grande impacto?',
    'Muito bem! 🌳 Continue assim, você está no caminho certo.',
    'Ótimo ponto! 🍃 A conscientização é o primeiro passo.'
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-4rem)]">
      <Card className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-green-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="bg-gradient-to-br from-green-400 to-emerald-500">
              <AvatarFallback>
                <Bot className="text-white" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-green-800 dark:text-green-300">EcoBot</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Online • Sempre disponível</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className={message.sender === 'bot' 
                ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                : 'bg-gradient-to-br from-blue-400 to-indigo-500'
              }>
                <AvatarFallback>
                  {message.sender === 'bot' ? <Bot className="text-white" size={20} /> : <User className="text-white" size={20} />}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[70%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`p-3 lg:p-4 rounded-2xl ${
                  message.sender === 'bot' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-gray-800 dark:text-gray-200' 
                    : 'bg-blue-500 text-white'
                }`}>
                  <p>{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 lg:p-6 border-t border-green-200 dark:border-gray-700">
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button
              onClick={handleSend}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
