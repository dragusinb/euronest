import { useState, useEffect } from 'react';
import { useCacheStore } from '../store';
import { askAIJSON } from '../services/openai';
import { buildPropertyAnalysisPrompt } from '../services/prompts';
import { listings } from '../data/listings';
import { getCity } from '../data/cities';
import { getCountry } from '../data/countries';
import { getRegulation } from '../data/regulations';
import { Sparkles, CheckCircle, XCircle, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';
import type { PropertyAnalysis as PropertyAnalysisType } from '../types';

interface PropertyAnalysisProps {
  listingId: string;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-20 bg-gray-200 rounded-xl" />
      <div className="h-6 bg-gray-200 rounded w-2/3" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-16 bg-gray-200 rounded-xl" />
      <div className="h-16 bg-gray-200 rounded-xl" />
      <div className="h-16 bg-gray-200 rounded-xl" />
    </div>
  );
}

function riskBadge(level: 'low' | 'medium' | 'high') {
  switch (level) {
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'medium':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'high':
      return 'bg-red-100 text-red-800 border-red-300';
  }
}

function verdictColor(level: 'low' | 'medium' | 'high') {
  switch (level) {
    case 'low':
      return 'text-green-700';
    case 'medium':
      return 'text-amber-700';
    case 'high':
      return 'text-red-700';
  }
}

export default function PropertyAnalysis({ listingId }: PropertyAnalysisProps) {
  const getPropertyAnalysis = useCacheStore(s => s.getPropertyAnalysis);
  const setPropertyAnalysis = useCacheStore(s => s.setPropertyAnalysis);

  const [analysis, setAnalysis] = useState<PropertyAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = getPropertyAnalysis(listingId);
    if (cached) {
      setAnalysis(cached);
      setError(null);
    } else {
      setAnalysis(null);
    }
  }, [listingId, getPropertyAnalysis]);

  const generateAnalysis = async () => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) {
      setError('Listing not found');
      return;
    }

    const city = getCity(listing.cityId);
    if (!city) {
      setError('City data not found');
      return;
    }

    const country = getCountry(city.countryId);
    if (!country) {
      setError('Country data not found');
      return;
    }

    const regulation = getRegulation(city.countryId);
    if (!regulation) {
      setError('Regulation data not found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = buildPropertyAnalysisPrompt(listing, city, country, regulation);
      const result = await askAIJSON<PropertyAnalysisType>(prompt, 'Analyze this property investment opportunity.', {
        temperature: 0.3,
        maxTokens: 2000,
      });
      setAnalysis(result);
      setPropertyAnalysis(listingId, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4 text-blue-600">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Generating AI analysis...</span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-700 mb-3">{error}</p>
          <button
            onClick={generateAnalysis}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 cursor-pointer border-0"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-blue-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Property Analysis</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
            Get an AI-powered investment analysis including risk assessment, comparable properties, and regulatory insights.
          </p>
          <button
            onClick={generateAnalysis}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer border-0 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Generate AI Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-1">Summary</h3>
        <p className="text-sm text-blue-900 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Investment Verdict */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Investment Verdict</h3>
        <p className={`text-base font-bold ${verdictColor(analysis.riskLevel)}`}>
          {analysis.investmentVerdict}
        </p>
      </div>

      {/* Pros / Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-green-700 mb-2">Pros</h3>
          <ul className="space-y-1.5">
            {analysis.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-700 mb-2">Cons</h3>
          <ul className="space-y-1.5">
            {analysis.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Risk Assessment */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          Risk Assessment
        </h3>
        <div className="flex items-start gap-3">
          <span className={`inline-block text-xs font-bold uppercase px-2.5 py-1 rounded-full border ${riskBadge(analysis.riskLevel)}`}>
            {analysis.riskLevel} risk
          </span>
          <p className="text-sm text-gray-600 leading-relaxed">{analysis.riskExplanation}</p>
        </div>
      </div>

      {/* Comparable Analysis */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Comparable Analysis</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{analysis.comparableAnalysis}</p>
      </div>

      {/* Neighborhood Insight */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Neighborhood Insight</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{analysis.neighborhoodInsight}</p>
      </div>

      {/* Regulatory Notes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Regulatory Notes</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{analysis.regulatoryNotes}</p>
      </div>
    </div>
  );
}
