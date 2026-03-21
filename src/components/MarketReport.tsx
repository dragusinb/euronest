import { useState } from 'react';
import { useCacheStore } from '../store';
import { askAIJSON } from '../services/openai';
import { buildMarketReportPrompt } from '../services/prompts';
import { getCity } from '../data/cities';
import { getCountry } from '../data/countries';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  ShieldAlert,
  Lightbulb,
  FileText,
  Scale,
  CircleDollarSign,
  BarChart3,
} from 'lucide-react';
import type { MarketReport as MarketReportType } from '../types';

interface MarketReportProps {
  cityId: string;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 bg-gray-200 rounded-xl" />
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-16 bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-20 bg-gray-200 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-20 bg-gray-200 rounded-xl" />
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="h-16 bg-gray-200 rounded-xl" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="h-16 bg-gray-200 rounded-xl" />
      <div className="h-20 bg-gray-200 rounded-xl" />
    </div>
  );
}

function outlookBadge(outlook: 'bullish' | 'neutral' | 'bearish') {
  switch (outlook) {
    case 'bullish':
      return {
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'Bullish',
        className: 'bg-green-100 text-green-800 border-green-300',
      };
    case 'neutral':
      return {
        icon: <Minus className="w-4 h-4" />,
        label: 'Neutral',
        className: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    case 'bearish':
      return {
        icon: <TrendingDown className="w-4 h-4" />,
        label: 'Bearish',
        className: 'bg-red-100 text-red-800 border-red-300',
      };
  }
}

export default function MarketReport({ cityId }: MarketReportProps) {
  const { getMarketReport, setMarketReport } = useCacheStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<MarketReportType | null>(() => getMarketReport(cityId) ?? null);

  const generateReport = async () => {
    const city = getCity(cityId);
    const country = city ? getCountry(city.countryId) : null;
    if (!city || !country) {
      setError('City or country data not found.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const prompt = buildMarketReportPrompt(city, country);
      const result = await askAIJSON<Omit<MarketReportType, 'cityId' | 'generatedAt'>>(
        prompt,
        `Generate a comprehensive market report for ${city.name}, ${country.name}.`,
        { maxTokens: 2000 }
      );
      const fullReport: MarketReportType = {
        ...result,
        cityId,
        generatedAt: Date.now(),
      };
      setMarketReport(cityId, fullReport);
      setReport(fullReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // No report yet: show generate button
  if (!report && !loading && !error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">AI Market Report</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          Get a comprehensive AI-generated analysis of pricing, yields, demand drivers, risks, and investment strategy for this market.
        </p>
        <button
          onClick={generateReport}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          Generate AI Market Report
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="animate-spin">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-600">Generating AI market report...</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-6 text-center">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Report Generation Failed</h3>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button
          onClick={generateReport}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!report) return null;

  const badge = outlookBadge(report.outlook);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Market Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-2">Market Summary</h3>
            <p className="text-gray-800 leading-relaxed">{report.summary}</p>
          </div>
          <button
            onClick={generateReport}
            className="shrink-0 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            title="Regenerate report"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Outlook Badge + Explanation */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm border ${badge.className}`}>
              {badge.icon}
              {badge.label} Outlook
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{report.outlookExplanation}</p>
        </div>

        {/* Two Column Layout: Price + Yield Analysis | Regulatory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            {/* Price Analysis */}
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CircleDollarSign className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-gray-900">Price Analysis</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{report.priceAnalysis}</p>
            </div>

            {/* Yield Analysis */}
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <h4 className="text-sm font-semibold text-gray-900">Yield Analysis</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{report.yieldAnalysis}</p>
            </div>
          </div>

          {/* Regulatory Environment */}
          <div className="rounded-xl border border-gray-200 p-4 h-fit">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-semibold text-gray-900">Regulatory Environment</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{report.regulatoryEnvironment}</p>
          </div>
        </div>

        {/* Demand Drivers */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Demand Drivers
          </h4>
          <ul className="space-y-2">
            {report.demandDrivers.map((driver, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                {driver}
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Factors */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            Risk Factors
          </h4>
          <ul className="space-y-2">
            {report.riskFactors.map((risk, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                {risk}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Strategy */}
        <div className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h4 className="text-sm font-semibold text-amber-900">Recommended Strategy</h4>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">{report.recommendedStrategy}</p>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100">
          Generated on {new Date(report.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
          AI-generated analysis for informational purposes only.
        </p>
      </div>
    </div>
  );
}
