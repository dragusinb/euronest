import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Send, Sparkles, RotateCcw } from 'lucide-react';
import { useChatStore, useUIStore } from '../store';
import { askAIStreaming } from '../services/openai';
import { buildAdvisorSystemPrompt } from '../services/prompts';
import type { OpenAIMessage } from '../services/openai';
import ChatMessage from './ChatMessage';
import ChatSuggestions from './ChatSuggestions';

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default function AIChatPanel() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation();

  const { messages, isLoading, addMessage, setLoading, clearChat, updateLastAssistant } =
    useChatStore();
  const { chatOpen, setChatOpen } = useUIStore();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [chatOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setInput('');

      // Add user message
      addMessage({ role: 'user', content: trimmed, timestamp: Date.now() });

      // Build conversation history for context (exclude system messages)
      const history: OpenAIMessage[] = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content }));

      // Add empty assistant message placeholder
      addMessage({ role: 'assistant', content: '', timestamp: Date.now() });
      setLoading(true);

      try {
        const systemPrompt = buildAdvisorSystemPrompt(
          location.pathname,
          undefined
        );

        await askAIStreaming(systemPrompt, trimmed, (chunk) => {
          updateLastAssistant(chunk);
        }, {
          conversationHistory: history,
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'An error occurred';
        updateLastAssistant(
          `Sorry, I encountered an error: ${errorMsg}. Please try again.`
        );
      } finally {
        setLoading(false);
      }
    },
    [isLoading, messages, addMessage, setLoading, updateLastAssistant, location.pathname]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  return (
    <>
      {/* Floating Action Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-all duration-200 flex items-center justify-center hover:scale-105 cursor-pointer"
          aria-label="Open AI Chat"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Backdrop */}
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[1499] md:bg-transparent"
          onClick={() => setChatOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-[1500] w-full md:w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          chatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                AI Investment Advisor
              </h2>
              <p className="text-[11px] text-gray-400">Powered by EuroNest</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
              title="New Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChatOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <ChatSuggestions onSelect={sendMessage} />
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {isLoading &&
                messages[messages.length - 1]?.content === '' && (
                  <TypingIndicator />
                )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 px-4 py-3 bg-white shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask about investments..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light/30 transition-colors"
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
