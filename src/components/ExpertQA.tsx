import { useState, useRef, useEffect } from 'react';
import { MessageCircleQuestion, Send, Sparkles, RotateCcw, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { askAIStreaming } from '../services/openai';
import { countries } from '../data/countries';
import { regulations } from '../data/regulations';
import { getCitiesByCountry } from '../data/cities';
import type { OpenAIMessage } from '../services/openai';

interface QAPair {
  question: string;
  answer: string;
  isStreaming: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-2">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  );
}

export default function ExpertQA({ countryId }: { countryId: string }) {
  const [pairs, setPairs] = useState<QAPair[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const country = countries.find(c => c.id === countryId);
  const countryName = country?.name ?? countryId;
  const regulation = regulations.find(r => r.countryId === countryId);
  const citiesData = getCitiesByCountry(countryId);

  const suggestedQuestions = [
    `What documents do I need to buy in ${countryName}?`,
    `How much are the total buying costs on a \u20AC200k property?`,
    `Can I get a mortgage as a non-resident?`,
    `What's the process for getting a tax ID?`,
    `How do I register a property for Airbnb?`,
    `What are the annual taxes I'll need to pay?`,
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [pairs]);

  const buildSystemPrompt = (): string => {
    const regData = regulation
      ? regulation.sections
          .map(s => `## ${s.title}\n${s.items.map(i => `- **${i.label}**: ${i.value}. ${i.details}`).join('\n')}`)
          .join('\n\n')
      : 'No specific regulation data available.';

    const cityData = citiesData.length > 0
      ? citiesData
          .map(c => `- **${c.name}**: avg price \u20AC${c.averagePricePerSqm}/sqm, rent \u20AC${c.averageMonthlyRentPerSqm}/sqm/mo, gross yield ${c.grossYield}%, net yield ${c.netYield}%`)
          .join('\n')
      : 'No city-level data available.';

    return `You are an expert real estate advisor and legal consultant specializing in ${countryName}. You help EU expats navigate property purchases and rentals.

Here is the current regulation data for ${countryName}:

${regData}

City-level market data for ${countryName}:
${cityData}

Instructions:
- Be specific to ${countryName} and reference actual laws, tax rates, and regulations
- Include costs in euros where applicable
- Always mention when professional legal or tax advice is recommended
- Format your responses with markdown: use **bold** for key figures and rates, use bullet points for lists
- Be concise but thorough`;
  };

  const buildHistory = (): OpenAIMessage[] =>
    pairs.flatMap(p => [
      { role: 'user' as const, content: p.question },
      { role: 'assistant' as const, content: p.answer },
    ]);

  const askQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    setInput('');
    setIsLoading(true);

    const newPair: QAPair = { question: trimmed, answer: '', isStreaming: true };
    setPairs(prev => [...prev, newPair]);

    try {
      const history = buildHistory();
      await askAIStreaming(buildSystemPrompt(), trimmed, (chunk) => {
        setPairs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], answer: chunk };
          return updated;
        });
      }, { conversationHistory: history });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setPairs(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          answer: `Sorry, I encountered an error: ${errorMsg}. Please try again.`,
        };
        return updated;
      });
    } finally {
      setPairs(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], isStreaming: false };
        return updated;
      });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      askQuestion(input);
    }
  };

  const clearConversation = () => {
    setPairs([]);
    setShowSuggestions(false);
    setInput('');
  };

  const hasAsked = pairs.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Ask the Expert</h3>
            <p className="text-xs text-gray-500">
              Ask any question about buying or renting property in {countryName} as an EU expat
            </p>
          </div>
        </div>
        {hasAsked && (
          <button
            onClick={clearConversation}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            title="Clear conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Suggested Questions */}
        {!hasAsked ? (
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => askQuestion(q)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <MessageCircleQuestion className="w-3.5 h-3.5" />
              <span>More questions</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${showSuggestions ? 'rotate-90' : ''}`} />
            </button>
            {showSuggestions && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { askQuestion(q); setShowSuggestions(false); }}
                    disabled={isLoading}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Q&A Pairs */}
        {pairs.map((pair, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-end">
              <div className="bg-blue-50 text-blue-800 text-sm px-3.5 py-2 rounded-2xl rounded-br-sm max-w-[85%]">
                {pair.question}
              </div>
            </div>
            <div className="text-sm text-gray-700 prose prose-sm max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900 prose-li:marker:text-gray-400">
              {pair.isStreaming && pair.answer === '' ? (
                <TypingIndicator />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{pair.answer}</ReactMarkdown>
              )}
            </div>
            {!pair.isStreaming && i === pairs.length - 1 && (
              <p className="text-xs text-gray-400 italic">Have another question? Type below or pick a suggestion above.</p>
            )}
          </div>
        ))}

        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="px-5 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about buying, renting, taxes, visas..."
            disabled={isLoading}
            className="flex-1 text-sm rounded-lg border border-gray-200 px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => askQuestion(input)}
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
