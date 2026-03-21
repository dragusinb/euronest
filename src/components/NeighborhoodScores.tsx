import { useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { getNeighborhoodScores } from '../data/neighborhoodScores';

interface NeighborhoodScoresProps {
  cityId: string;
}

const dimensionLabels: Record<string, string> = {
  walkability: 'Walkability',
  safety: 'Safety',
  amenities: 'Amenities',
  transport: 'Transport',
  nightlife: 'Nightlife',
  familyFriendly: 'Family Friendly',
};

function scoreColor(score: number): string {
  if (score >= 8) return '#16a34a'; // green-600
  if (score >= 5) return '#d97706'; // amber-600
  return '#dc2626'; // red-600
}

function scoreBgColor(score: number): string {
  if (score >= 8) return 'bg-green-500';
  if (score >= 5) return 'bg-amber-500';
  return 'bg-red-500';
}

function scoreBgLight(score: number): string {
  if (score >= 8) return 'bg-green-100';
  if (score >= 5) return 'bg-amber-100';
  return 'bg-red-100';
}

export default function NeighborhoodScores({ cityId }: NeighborhoodScoresProps) {
  const scores = getNeighborhoodScores(cityId);

  const radarData = useMemo(() => {
    if (!scores) return [];
    return [
      { dimension: 'Walkability', value: scores.walkability },
      { dimension: 'Safety', value: scores.safety },
      { dimension: 'Amenities', value: scores.amenities },
      { dimension: 'Transport', value: scores.transport },
      { dimension: 'Nightlife', value: scores.nightlife },
      { dimension: 'Family', value: scores.familyFriendly },
    ];
  }, [scores]);

  const barEntries = useMemo(() => {
    if (!scores) return [];
    const keys = ['walkability', 'safety', 'amenities', 'transport', 'nightlife', 'familyFriendly'] as const;
    return keys.map((key) => ({
      key,
      label: dimensionLabels[key],
      score: scores[key],
    }));
  }, [scores]);

  if (!scores) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-gray-500 text-sm">No neighborhood data available for this city.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Neighborhood Scores</h3>

      {/* Radar Chart */}
      <div className="w-full h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Horizontal Bars */}
      <div className="space-y-3">
        {barEntries.map(({ key, label, score }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <span
                className="text-sm font-bold"
                style={{ color: scoreColor(score) }}
              >
                {score}/10
              </span>
            </div>
            <div className={`w-full h-2.5 rounded-full ${scoreBgLight(score)}`}>
              <div
                className={`h-2.5 rounded-full ${scoreBgColor(score)} transition-all duration-500`}
                style={{ width: `${score * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
