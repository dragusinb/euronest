import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Home, Calendar, DollarSign } from 'lucide-react';
import { calculateROI, findBreakEvenYear } from '../utils/roiCalculator';

interface ROIProjectionProps {
  purchasePrice: number;
  monthlyRent: number;
  countryId: string;
}

type Scenario = 'optimistic' | 'base' | 'pessimistic';

const scenarioConfig: Record<Scenario, { label: string; appreciationRate: number }> = {
  optimistic: { label: 'Optimistic', appreciationRate: 0.03 },
  base: { label: 'Base', appreciationRate: 0.015 },
  pessimistic: { label: 'Pessimistic', appreciationRate: 0 },
};

function formatEuro(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `\u20AC${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `\u20AC${(value / 1_000).toFixed(0)}k`;
  }
  return `\u20AC${value.toFixed(0)}`;
}

function formatEuroFull(value: number): string {
  return `\u20AC${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export default function ROIProjection({ purchasePrice, monthlyRent, countryId }: ROIProjectionProps) {
  const [scenario, setScenario] = useState<Scenario>('base');
  const [useMortgage, setUseMortgage] = useState(false);
  const [ltv, setLtv] = useState(70);
  const [mortgageRate, setMortgageRate] = useState(3.5);
  const [mortgageTerm, setMortgageTerm] = useState(25);
  const [holdingPeriod, setHoldingPeriod] = useState(15);

  const projections = useMemo(() => {
    return calculateROI({
      purchasePrice,
      monthlyRent,
      appreciationRate: scenarioConfig[scenario].appreciationRate,
      inflationRate: 0.02,
      annualCostsPct: 1.5,
      countryId,
      holdingPeriodYears: holdingPeriod,
      mortgageLTV: useMortgage ? ltv : 0,
      mortgageRate: useMortgage ? mortgageRate : 0,
      mortgageTermYears: useMortgage ? mortgageTerm : 0,
    });
  }, [purchasePrice, monthlyRent, scenario, useMortgage, ltv, mortgageRate, mortgageTerm, holdingPeriod, countryId]);

  const breakEvenYear = useMemo(() => findBreakEvenYear(projections), [projections]);

  const lastProjection = projections[projections.length - 1];
  const year1 = projections[0];
  const monthlyCashFlowYear1 = year1
    ? Math.round((year1.cumulativeRent - year1.cumulativeCosts) / 12)
    : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">ROI Projection</h3>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        {/* Scenario Toggle */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Scenario</label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(Object.keys(scenarioConfig) as Scenario[]).map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  scenario === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {scenarioConfig[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Mortgage Toggle */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Financing</label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setUseMortgage(false)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                !useMortgage
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cash Purchase
            </button>
            <button
              onClick={() => setUseMortgage(true)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                useMortgage
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              With Mortgage
            </button>
          </div>
        </div>

        {/* Mortgage Controls */}
        {useMortgage && (
          <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">
                LTV: {ltv}%
              </label>
              <input
                type="range"
                min={50}
                max={90}
                step={5}
                value={ltv}
                onChange={(e) => setLtv(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Rate (%)
              </label>
              <input
                type="number"
                min={0.5}
                max={10}
                step={0.1}
                value={mortgageRate}
                onChange={(e) => setMortgageRate(Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Term (years)
              </label>
              <select
                value={mortgageTerm}
                onChange={(e) => setMortgageTerm(Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {[15, 20, 25, 30].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Holding Period */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Holding Period: {holdingPeriod} years
          </label>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={holdingPeriod}
            onChange={(e) => setHoldingPeriod(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>5 yrs</span>
            <span>30 yrs</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-72 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projections} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              label={{ value: 'Year', position: 'insideBottomRight', offset: -5, fontSize: 11, fill: '#9ca3af' }}
            />
            <YAxis
              tickFormatter={formatEuro}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              width={60}
            />
            <Tooltip
              formatter={(value: any, name: any) => [formatEuroFull(Number(value)), String(name)]}
              labelFormatter={(label) => `Year ${label}`}
              contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="propertyValue"
              name="Property Value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cumulativeRent"
              name="Cumulative Rent"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cumulativeCosts"
              name="Cumulative Costs"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="totalReturn"
              name="Net Position"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
            />
            {breakEvenYear != null && (
              <ReferenceLine
                x={breakEvenYear}
                stroke="#8b5cf6"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Break-even: Yr ${breakEvenYear}`,
                  position: 'top',
                  fill: '#8b5cf6',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600">Total Return</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatEuroFull(lastProjection?.totalReturn ?? 0)}
          </p>
          <p className="text-xs text-gray-500">
            {lastProjection?.totalROIPercent ?? 0}% ROI over {holdingPeriod} yrs
          </p>
        </div>

        <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-600">Break-even</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {breakEvenYear != null ? `Year ${breakEvenYear}` : 'N/A'}
          </p>
          <p className="text-xs text-gray-500">
            {breakEvenYear != null ? 'Investment turns positive' : 'Not within holding period'}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-green-50 border border-green-100">
          <div className="flex items-center gap-1.5 mb-1">
            <Home className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600">Monthly Cash Flow</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatEuroFull(monthlyCashFlowYear1)}
          </p>
          <p className="text-xs text-gray-500">Year 1 net monthly</p>
        </div>

        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">Total Rental Income</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatEuroFull(lastProjection?.cumulativeRent ?? 0)}
          </p>
          <p className="text-xs text-gray-500">Over {holdingPeriod} years</p>
        </div>
      </div>
    </div>
  );
}
