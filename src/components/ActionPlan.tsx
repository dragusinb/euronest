import { useState, useEffect } from 'react';
import { askAIJSON } from '../services/openai';
import { listings } from '../data/listings';
import { getCity } from '../data/cities';
import { getCountry } from '../data/countries';
import { getRegulation } from '../data/regulations';
import {
  ClipboardList,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Clock,
  CircleDollarSign,
  Lightbulb,
  ShieldAlert,
  Info,
} from 'lucide-react';
import type { PropertyListing, City, Country } from '../types';

interface ActionPlanProps {
  listingId: string;
}

interface ActionStep {
  step: number;
  title: string;
  description: string;
  timeline: string;
  cost: string;
  priority: 'critical' | 'important' | 'recommended';
}

interface EstimatedCost {
  item: string;
  amount: string;
  notes: string;
}

interface ActionPlanData {
  propertyOverview: string;
  immediateSteps: ActionStep[];
  estimatedCosts: EstimatedCost[];
  totalEstimatedCost: string;
  timeline: string;
  risks: string[];
  tips: string[];
}

const CACHE_KEY = (id: string) => `euronest-action-plan-${id}`;

function priorityLabel(priority: ActionStep['priority']) {
  if (priority === 'critical') return 'text-red-700 bg-red-50';
  if (priority === 'important') return 'text-amber-700 bg-amber-50';
  return 'text-green-700 bg-green-50';
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5 animate-pulse p-6">
      <div className="h-20 bg-blue-100 rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-32 bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-gray-200 rounded-xl" />
        <div className="h-24 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

function buildSystemPrompt(listing: PropertyListing, city: City, country: Country, regulation: string) {
  return `You are a senior European real estate investment consultant. Generate a detailed, SPECIFIC action plan for purchasing this property. All costs and steps must reference the ACTUAL property details provided.

PROPERTY DETAILS:
- Title: ${listing.title}
- Location: ${city.name}, ${country.name}
- Price: €${listing.price.toLocaleString()}
- Area: ${listing.areaSqm} sqm
- Type: ${listing.type}, ${listing.rooms} room(s), ${listing.bathrooms} bathroom(s)
- Floor: ${listing.floor}, Year Built: ${listing.yearBuilt}
- Estimated Monthly Rent: €${listing.estimatedMonthlyRent}
- Gross Yield: ${listing.grossYield}%
- Features: ${listing.features.join(', ')}

CITY CONTEXT:
- Average Price/sqm: €${city.averagePricePerSqm}
- Average Rent/sqm: €${city.averageMonthlyRentPerSqm}
- Demand Level: ${city.demandLevel}
- Tourism Score: ${city.tourismScore}/10

COUNTRY REGULATIONS:
${regulation}

Provide SPECIFIC, ACTIONABLE steps — not generic advice. Reference actual costs based on the purchase price of €${listing.price.toLocaleString()}. For example, calculate transfer tax as a specific euro amount.

Return a JSON object with this exact structure:
{
  "propertyOverview": "1-2 sentence summary of why this property is interesting",
  "immediateSteps": [
    { "step": 1, "title": "...", "description": "...", "timeline": "e.g. 1-2 days", "cost": "e.g. Free or €200-500", "priority": "critical|important|recommended" }
  ],
  "estimatedCosts": [
    { "item": "...", "amount": "e.g. €5,715", "notes": "..." }
  ],
  "totalEstimatedCost": "€...",
  "timeline": "e.g. 2-4 months total",
  "risks": ["specific risk 1", "specific risk 2"],
  "tips": ["specific tip 1", "specific tip 2"]
}

Include 8-10 steps covering: tax ID, lawyer, bank account, viewing, offer, due diligence, preliminary contract, financing, final signing, rental setup.`;
}

export default function ActionPlan({ listingId }: ActionPlanProps) {
  const [plan, setPlan] = useState<ActionPlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listing = listings.find(l => l.id === listingId);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY(listingId));
    if (cached) {
      try {
        setPlan(JSON.parse(cached));
        setError(null);
      } catch {
        localStorage.removeItem(CACHE_KEY(listingId));
      }
    } else {
      setPlan(null);
    }
  }, [listingId]);

  const generate = async () => {
    if (!listing) { setError('Listing not found'); return; }
    const city = getCity(listing.cityId);
    if (!city) { setError('City data not found'); return; }
    const country = getCountry(city.countryId);
    if (!country) { setError('Country data not found'); return; }
    const regulation = getRegulation(city.countryId);
    if (!regulation) { setError('Regulation data not found'); return; }

    setLoading(true);
    setError(null);

    try {
      const regText = regulation.sections
        .map(s => `${s.title}:\n${s.items.map(i => `- ${i.label}: ${i.value}. ${i.details}`).join('\n')}`)
        .join('\n\n');
      const systemPrompt = buildSystemPrompt(listing, city, country, regText);
      const result = await askAIJSON<ActionPlanData>(
        systemPrompt,
        `Generate a complete action plan for purchasing: ${listing.title}`,
        { temperature: 0.3, maxTokens: 3000 }
      );
      setPlan(result);
      localStorage.setItem(CACHE_KEY(listingId), JSON.stringify(result));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate action plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-2 px-6 pt-6 text-blue-600">
          <ClipboardList className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Building your action plan...</span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-700 mb-3">{error}</p>
          <button onClick={generate} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 cursor-pointer border-0">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <ClipboardList className="w-12 h-12 text-blue-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">What To Do Next</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
            Get a personalized, step-by-step action plan with cost estimates and timeline for purchasing this specific property.
          </p>
          <button onClick={generate} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer border-0 shadow-sm">
            <ClipboardList className="w-4 h-4" /> Generate Your Action Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Property Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-900 leading-relaxed">{plan.propertyOverview}</p>
      </div>

      {/* Action Steps - Vertical Timeline */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-gray-500" /> Action Steps
        </h3>
        <div className="relative ml-4">
          {/* Connecting line */}
          <div className="absolute left-3.5 top-4 bottom-4 w-px bg-gray-200" />

          <div className="space-y-4">
            {plan.immediateSteps.map((s) => (
              <div key={s.step} className="relative flex gap-4">
                {/* Step number circle */}
                <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm ${
                  s.priority === 'critical' ? 'bg-red-500' : s.priority === 'important' ? 'bg-amber-500' : 'bg-green-500'
                }`}>
                  {s.step}
                </div>
                {/* Card */}
                <div className="flex-1 bg-white border border-gray-100 rounded-lg p-3 shadow-sm -mt-0.5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{s.title}</h4>
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${priorityLabel(s.priority)}`}>
                      {s.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{s.description}</p>
                  <div className="flex gap-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                      <Clock className="w-3 h-3" /> {s.timeline}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                      <CircleDollarSign className="w-3 h-3" /> {s.cost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <CircleDollarSign className="w-4 h-4 text-gray-500" /> Estimated Cost Breakdown
        </h3>
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {plan.estimatedCosts.map((c, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">{c.item}</td>
                  <td className="px-4 py-2.5 text-gray-900 font-medium text-right whitespace-nowrap">{c.amount}</td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs hidden sm:table-cell">{c.notes}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-bold text-gray-900">Total</td>
                <td className="px-4 py-3 font-bold text-gray-900 text-right">{plan.totalEstimatedCost}</td>
                <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">Based on purchase price of €{listing?.price.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Timeline Bar */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" /> Estimated Timeline
        </h3>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="h-2.5 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-full" />
            </div>
            <div className="flex justify-between mt-2 text-[11px] text-gray-500">
              <span>Start</span>
              <span>Due Diligence</span>
              <span>Completion</span>
            </div>
          </div>
          <span className="text-sm font-bold text-blue-800 whitespace-nowrap">{plan.timeline}</span>
        </div>
      </div>

      {/* Risks & Tips - Two Column */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" /> Key Risks
          </h3>
          <ul className="space-y-2">
            {plan.risks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                <span className="text-xs leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-green-500" /> Pro Tips
          </h3>
          <ul className="space-y-2">
            {plan.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-xs leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[11px] text-gray-400 text-center pt-2 border-t border-gray-100">
        Action plan generated for <span className="font-medium">{listing?.title}</span>. Consult local professionals before proceeding.
      </p>
    </div>
  );
}
