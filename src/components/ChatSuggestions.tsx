import { Lightbulb } from 'lucide-react';

interface ChatSuggestionsProps {
  onSelect: (question: string) => void;
}

const suggestions = [
  "I have \u20AC200k to invest. Where should I buy?",
  "Compare Greece vs France for rental investment",
  "What are the tax implications for a German buying in Greece?",
  "Which city has the best short-term rental potential?",
  "Is Athens a good investment right now?",
  "Help me find a high-yield property under \u20AC150k",
];

export default function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lightbulb className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        EuroNest AI Advisor
      </h3>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Ask me anything about European real estate investment
      </p>
      <div className="w-full space-y-2">
        {suggestions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-primary-light hover:bg-primary/5 transition-colors duration-150 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
