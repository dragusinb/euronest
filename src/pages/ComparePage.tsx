import { useState } from 'react';
import { countries } from '../data/countries';
import { cities, getCitiesByCountry } from '../data/cities';
import { formatPrice, formatYield, yieldColor } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

type CompareMode = 'countries' | 'cities';

export default function ComparePage() {
  const [mode, setMode] = useState<CompareMode>('countries');
  const [selectedCities, setSelectedCities] = useState<string[]>(['athens', 'paris', 'helsinki']);

  const toggleCity = (cityId: string) => {
    setSelectedCities(prev =>
      prev.includes(cityId)
        ? prev.filter(c => c !== cityId)
        : prev.length < 5
          ? [...prev, cityId]
          : prev
    );
  };

  // Country comparison data
  const countryData = countries.map(country => {
    const countryCities = getCitiesByCountry(country.id);
    const avgPrice = countryCities.reduce((sum, c) => sum + c.averagePricePerSqm, 0) / countryCities.length;
    const avgGross = countryCities.reduce((sum, c) => sum + c.grossYield, 0) / countryCities.length;
    const avgNet = countryCities.reduce((sum, c) => sum + c.netYield, 0) / countryCities.length;
    return {
      name: `${country.flag} ${country.name}`,
      avgPricePerSqm: Math.round(avgPrice),
      avgGrossYield: parseFloat(avgGross.toFixed(1)),
      avgNetYield: parseFloat(avgNet.toFixed(1)),
      easeOfPurchase: country.scores.easeOfPurchase,
      rentalFriendliness: country.scores.rentalFriendliness,
      marketLiquidity: country.scores.marketLiquidity,
      taxFavorability: country.scores.taxFavorability,
    };
  });

  const radarData = [
    { metric: 'Ease of Purchase', ...Object.fromEntries(countryData.map(c => [c.name, c.easeOfPurchase])) },
    { metric: 'Rental Friendly', ...Object.fromEntries(countryData.map(c => [c.name, c.rentalFriendliness])) },
    { metric: 'Market Liquidity', ...Object.fromEntries(countryData.map(c => [c.name, c.marketLiquidity])) },
    { metric: 'Tax Favorability', ...Object.fromEntries(countryData.map(c => [c.name, c.taxFavorability])) },
  ];

  const colors = ['#3b82f6', '#059669', '#d97706', '#dc2626', '#8b5cf6'];

  // City comparison data
  const cityCompareData = selectedCities.map(cityId => {
    const city = cities.find(c => c.id === cityId)!;
    const country = countries.find(c => c.id === city.countryId)!;
    return {
      name: city.name,
      country: country.flag,
      pricePerSqm: city.averagePricePerSqm,
      grossYield: city.grossYield,
      netYield: city.netYield,
      monthlyRent60sqm: city.averageMonthlyRentPerSqm * 60,
      investmentCost60sqm: city.averagePricePerSqm * 60,
      tourismScore: city.tourismScore,
      demandLevel: city.demandLevel,
    };
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Markets</h1>
        <p className="text-gray-600 mb-6">Side-by-side comparison to help you find the best investment opportunity</p>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setMode('countries')}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border transition-colors
              ${mode === 'countries' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            Compare Countries
          </button>
          <button
            onClick={() => setMode('cities')}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border transition-colors
              ${mode === 'cities' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            Compare Cities
          </button>
        </div>

        {mode === 'countries' ? (
          <>
            {/* Country comparison table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">Metric</th>
                      {countryData.map(c => (
                        <th key={c.name} className="text-center text-sm font-medium text-gray-900 px-6 py-4">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-600">Avg. Price/m\u00B2</td>
                      {countryData.map(c => (
                        <td key={c.name} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{formatPrice(c.avgPricePerSqm)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-600">Avg. Gross Yield</td>
                      {countryData.map(c => (
                        <td key={c.name} className="px-6 py-4 text-center text-sm font-semibold" style={{ color: yieldColor(c.avgGrossYield) }}>{formatYield(c.avgGrossYield)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-600">Avg. Net Yield</td>
                      {countryData.map(c => (
                        <td key={c.name} className="px-6 py-4 text-center text-sm font-semibold text-gray-700">{formatYield(c.avgNetYield)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-600">Ease of Purchase</td>
                      {countryData.map(c => (
                        <td key={c.name} className="px-6 py-4 text-center text-sm">{c.easeOfPurchase}/5</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-600">Rental Friendliness</td>
                      {countryData.map(c => (
                        <td key={c.name} className="px-6 py-4 text-center text-sm">{c.rentalFriendliness}/5</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-600">Market Liquidity</td>
                      {countryData.map(c => (
                        <td key={c.name} className="px-6 py-4 text-center text-sm">{c.marketLiquidity}/5</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-600">Tax Favorability</td>
                      {countryData.map(c => (
                        <td key={c.name} className="px-6 py-4 text-center text-sm">{c.taxFavorability}/5</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price vs Yield</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="avgPricePerSqm" fill="#3b82f6" name="Price/m\u00B2 (\u20AC)" />
                    <Bar yAxisId="right" dataKey="avgGrossYield" fill="#059669" name="Gross Yield (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Scores</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
                    {countryData.map((c, i) => (
                      <Radar key={c.name} name={c.name} dataKey={c.name} stroke={colors[i]} fill={colors[i]} fillOpacity={0.15} />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* City selector */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <div className="text-sm text-gray-500 mb-3">Select up to 5 cities to compare:</div>
              <div className="flex flex-wrap gap-2">
                {cities.map(city => {
                  const country = countries.find(c => c.id === city.countryId)!;
                  const isSelected = selectedCities.includes(city.id);
                  return (
                    <button
                      key={city.id}
                      onClick={() => toggleCity(city.id)}
                      className={`text-sm px-3 py-1.5 rounded-full cursor-pointer border transition-colors
                        ${isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
                    >
                      {country.flag} {city.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* City comparison table */}
            {cityCompareData.length > 0 && (
              <>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">Metric</th>
                          {cityCompareData.map(c => (
                            <th key={c.name} className="text-center text-sm font-medium text-gray-900 px-6 py-4">{c.country} {c.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-600">Price/m\u00B2</td>
                          {cityCompareData.map(c => (
                            <td key={c.name} className="px-6 py-4 text-center text-sm font-semibold">{formatPrice(c.pricePerSqm)}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-600">Gross Yield</td>
                          {cityCompareData.map(c => (
                            <td key={c.name} className="px-6 py-4 text-center text-sm font-semibold" style={{ color: yieldColor(c.grossYield) }}>{formatYield(c.grossYield)}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-600">Net Yield</td>
                          {cityCompareData.map(c => (
                            <td key={c.name} className="px-6 py-4 text-center text-sm font-semibold text-gray-700">{formatYield(c.netYield)}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-600">60m\u00B2 Investment</td>
                          {cityCompareData.map(c => (
                            <td key={c.name} className="px-6 py-4 text-center text-sm font-semibold">{formatPrice(c.investmentCost60sqm)}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-600">Monthly Rent (60m\u00B2)</td>
                          {cityCompareData.map(c => (
                            <td key={c.name} className="px-6 py-4 text-center text-sm font-semibold text-green-700">{formatPrice(c.monthlyRent60sqm)}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-600">Tourism Score</td>
                          {cityCompareData.map(c => (
                            <td key={c.name} className="px-6 py-4 text-center text-sm">{c.tourismScore}/10</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-600">Demand Level</td>
                          {cityCompareData.map(c => (
                            <td key={c.name} className="px-6 py-4 text-center text-sm capitalize">{c.demandLevel.replace('-', ' ')}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* City yield chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">City Yield Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cityCompareData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="grossYield" fill="#3b82f6" name="Gross Yield (%)" />
                      <Bar dataKey="netYield" fill="#059669" name="Net Yield (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
