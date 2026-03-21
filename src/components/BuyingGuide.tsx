import { useState, useEffect, useRef, useCallback } from 'react';
import { askAIStreaming } from '../services/openai';
import { getCity } from '../data/cities';
import { getCountry } from '../data/countries';
import { getRegulation } from '../data/regulations';
import { Map, Sparkles, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BuyingGuideProps {
  cityId: string;
}

const CACHE_KEY = (cityId: string) => `euronest-buying-guide-${cityId}`;

function buildSystemPrompt(cityName: string, countryName: string, regulationJson: string): string {
  return `You are an expert real estate consultant specializing in helping EU expats buy investment property in ${countryName}. You have deep local knowledge of ${cityName} and the entire buying process.

Produce a comprehensive, practical, step-by-step buying guide in markdown. Be specific to ${cityName}, ${countryName} — not generic. Use real institution names, real processes, real cost ranges.

Here is the current regulation data for ${countryName} (use this to ensure accuracy):
${regulationJson}

Structure your guide EXACTLY as follows:

# Your Complete Guide to Buying Property in ${cityName}, ${countryName}

## Before You Start
- Documents you'll need (passport, tax ID, bank statements, etc.)
- Budget planning (purchase price + transfer taxes + notary fees + legal fees)
- Specific considerations for ${cityName}

## Step 1: Get Your Tax ID
- Exact process for ${countryName} (the local tax ID name, where to apply, documents, timeline)
- Can you do it remotely?

## Step 2: Open a Local Bank Account
- Which banks work well with expats
- Documents required
- Tips specific to ${countryName}

## Step 3: Hire Your Team
- Lawyer (mandatory? recommended? cost range)
- Notary (role in ${countryName})
- Real estate agent (buyer's agent vs seller's agent)
- Translator if needed
- Tax advisor

## Step 4: Property Search & Due Diligence
- Best platforms/websites for ${cityName}
- What to check (title, liens, permits, building condition)
- Red flags specific to this market
- Typical negotiation range

## Step 5: Make an Offer & Sign Preliminary Contract
- How offers work in ${countryName}
- Preliminary contract details and local name
- Deposit amount and escrow
- Cooling-off period
- Conditions to include

## Step 6: Secure Financing (if applicable)
- Can expats get mortgages in ${countryName}?
- Typical LTV for non-residents
- Interest rate ranges
- Required documents for mortgage application

## Step 7: Final Due Diligence & Notary
- Final checks before closing
- Notary's role in ${countryName}
- What happens at the signing
- Timeline from preliminary to final deed

## Step 8: Complete the Purchase
- Transfer of funds
- Registration with land registry
- Getting keys
- Setting up utilities

## Step 9: Set Up for Rental
- Register the property for rental (short-term license, etc.)
- Rental platform registration (Airbnb number, etc.)
- Property management options in ${cityName}
- Expected costs (management %, maintenance)
- Insurance requirements

## Step 10: Ongoing Obligations
- Annual tax filing requirements
- Property tax payments
- Rental income reporting
- Building/community charges
- When to review your investment

## Key Costs Summary
| Cost | Typical Amount | When Paid |
|------|---------------|-----------|
(Provide an itemized table of ALL costs: taxes, fees, registration, etc.)

## Timeline
Typical timeline from start to finish with milestones.

## Common Mistakes to Avoid
- Country/city-specific pitfalls expats commonly encounter

## Useful Contacts & Resources
- Government websites, professional associations, expat communities

Be thorough, practical, and specific. Use bullet points liberally. Include actual cost ranges in EUR where possible.`;
}

export default function BuyingGuide({ cityId }: BuyingGuideProps) {
  const [content, setContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);

  const city = getCity(cityId);
  const country = city ? getCountry(city.countryId) : null;

  // Load cached guide on mount or cityId change
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY(cityId));
    if (cached) {
      setContent(cached);
      setIsGenerated(true);
    } else {
      setContent('');
      setIsGenerated(false);
    }
    setError(null);
    setIsStreaming(false);
    abortRef.current = true;
  }, [cityId]);

  const generateGuide = useCallback(async () => {
    if (!city || !country) {
      setError('City or country data not found.');
      return;
    }

    const regulation = getRegulation(country.id);
    const regulationJson = regulation ? JSON.stringify(regulation, null, 2) : 'No regulation data available.';

    abortRef.current = false;
    setIsStreaming(true);
    setIsGenerated(false);
    setError(null);
    setContent('');

    try {
      const systemPrompt = buildSystemPrompt(city.name, country.name, regulationJson);
      const userMessage = `Generate a complete step-by-step buying guide for an EU expat purchasing an apartment in ${city.name}, ${country.name} as an investment property.`;

      const fullText = await askAIStreaming(
        systemPrompt,
        userMessage,
        (text) => {
          if (!abortRef.current) {
            setContent(text);
          }
        },
        { maxTokens: 4000, temperature: 0.6 }
      );

      if (!abortRef.current) {
        localStorage.setItem(CACHE_KEY(cityId), fullText);
        setIsGenerated(true);
      }
    } catch (err) {
      if (!abortRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to generate guide. Please try again.');
      }
    } finally {
      if (!abortRef.current) {
        setIsStreaming(false);
      }
    }
  }, [city, country, cityId]);

  // Not generated yet — show CTA card
  if (!content && !isStreaming && !error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
          <Map className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Step-by-Step Buying Guide</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-lg mx-auto">
          Get a personalized roadmap for purchasing property in {city?.name ?? cityId} as an EU expat.
          Covers everything from tax IDs to closing day.
        </p>
        <button
          onClick={generateGuide}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          Generate Guide
        </button>
      </div>
    );
  }

  // Error state
  if (error && !content) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Guide Generation Failed</h3>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button
          onClick={generateGuide}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Map className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">
            Buying Guide {isStreaming && <span className="ml-2 text-blue-500 animate-pulse">Generating...</span>}
          </h3>
        </div>
        {isGenerated && (
          <button
            onClick={generateGuide}
            disabled={isStreaming}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Regenerate guide"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>
        )}
      </div>

      {/* Markdown content */}
      <div
        ref={contentRef}
        className="p-6 max-h-[70vh] overflow-y-auto"
      >
        <div className={`
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h1]:mt-2
          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-gray-200
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-700 [&_h3]:mt-4 [&_h3]:mb-2
          [&_p]:text-sm [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-3
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1
          [&_li]:text-sm [&_li]:text-gray-600 [&_li]:leading-relaxed
          [&_strong]:text-gray-900 [&_strong]:font-semibold
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-sm
          [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-700
          [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 [&_td]:text-gray-600
          [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800
          [&_hr]:my-6 [&_hr]:border-gray-200
        `}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse rounded-sm ml-0.5 align-text-bottom" />
          )}
        </div>
      </div>

      {/* Disclaimer */}
      {(isGenerated || isStreaming) && (
        <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex items-start gap-2">
          <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-400">
            This guide was generated by AI and may contain inaccuracies. Always verify details with local legal and real estate professionals before making any decisions.
          </p>
        </div>
      )}
    </div>
  );
}
