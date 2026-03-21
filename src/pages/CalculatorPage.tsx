import { useState } from 'react';
import { countries } from '../data/countries';
import { formatPrice, formatYield, yieldColor } from '../utils/formatters';

interface CalcInputs {
  purchasePrice: number;
  areaSqm: number;
  monthlyRent: number;
  countryId: string;
  // Costs
  managementPct: number;
  maintenancePct: number;
  vacancyPct: number;
  insuranceAnnual: number;
}

const countryDefaults: Record<string, { transferTax: number; notaryFees: number; agentFees: number; propertyTaxPct: number; incomeTaxPct: number; label: string }> = {
  greece: { transferTax: 3.09, notaryFees: 1.5, agentFees: 2.0, propertyTaxPct: 0.5, incomeTaxPct: 15, label: 'Greece' },
  france: { transferTax: 5.8, notaryFees: 2.0, agentFees: 0, propertyTaxPct: 1.0, incomeTaxPct: 20, label: 'France' },
  finland: { transferTax: 2.0, notaryFees: 0.5, agentFees: 0, propertyTaxPct: 0.93, incomeTaxPct: 30, label: 'Finland' },
};

export default function CalculatorPage() {
  const [inputs, setInputs] = useState<CalcInputs>({
    purchasePrice: 200000,
    areaSqm: 60,
    monthlyRent: 1000,
    countryId: 'greece',
    managementPct: 10,
    maintenancePct: 1,
    vacancyPct: 5,
    insuranceAnnual: 300,
  });

  const update = (field: keyof CalcInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const cd = countryDefaults[inputs.countryId];

  // Calculations
  const annualRent = inputs.monthlyRent * 12;
  const effectiveRent = annualRent * (1 - inputs.vacancyPct / 100);

  const acquisitionCosts = inputs.purchasePrice * (cd.transferTax + cd.notaryFees + cd.agentFees) / 100;
  const totalInvestment = inputs.purchasePrice + acquisitionCosts;

  const managementCost = effectiveRent * inputs.managementPct / 100;
  const maintenanceCost = inputs.purchasePrice * inputs.maintenancePct / 100;
  const propertyTax = inputs.purchasePrice * cd.propertyTaxPct / 100;
  const totalAnnualCosts = managementCost + maintenanceCost + propertyTax + inputs.insuranceAnnual;

  const netRentalIncome = effectiveRent - totalAnnualCosts;
  const incomeTax = netRentalIncome > 0 ? netRentalIncome * cd.incomeTaxPct / 100 : 0;
  const afterTaxIncome = netRentalIncome - incomeTax;

  const grossYield = (annualRent / inputs.purchasePrice) * 100;
  const netYield = (netRentalIncome / totalInvestment) * 100;
  const afterTaxYield = (afterTaxIncome / totalInvestment) * 100;

  const pricePerSqm = inputs.areaSqm > 0 ? inputs.purchasePrice / inputs.areaSqm : 0;
  const rentPerSqm = inputs.areaSqm > 0 ? inputs.monthlyRent / inputs.areaSqm : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Yield Calculator</h1>
        <p className="text-gray-600 mb-8">Calculate your expected rental returns with country-specific tax rates</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            {/* Country selector */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Country</h3>
              <div className="flex gap-2">
                {countries.map(c => (
                  <button
                    key={c.id}
                    onClick={() => update('countryId', c.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer border transition-colors
                      ${inputs.countryId === c.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                  >
                    <span>{c.flag}</span>
                    <span className="hidden sm:inline">{c.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>Transfer tax: {cd.transferTax}%</div>
                <div>Notary fees: {cd.notaryFees}%</div>
                <div>Property tax: {cd.propertyTaxPct}%</div>
                <div>Income tax: {cd.incomeTaxPct}%</div>
              </div>
            </div>

            {/* Property details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Property Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Purchase Price (\u20AC)</label>
                  <input
                    type="number"
                    value={inputs.purchasePrice}
                    onChange={e => update('purchasePrice', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-lg font-semibold"
                    step={5000}
                  />
                  <input
                    type="range"
                    min={50000} max={1000000} step={5000}
                    value={inputs.purchasePrice}
                    onChange={e => update('purchasePrice', Number(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Area (m\u00B2)</label>
                    <input
                      type="number"
                      value={inputs.areaSqm}
                      onChange={e => update('areaSqm', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Price/m\u00B2</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-700 font-medium border border-gray-200">
                      {formatPrice(pricePerSqm)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental income */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Rental Income</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Monthly Rent (\u20AC)</label>
                  <input
                    type="number"
                    value={inputs.monthlyRent}
                    onChange={e => update('monthlyRent', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-lg font-semibold"
                    step={50}
                  />
                  <input
                    type="range"
                    min={200} max={5000} step={50}
                    value={inputs.monthlyRent}
                    onChange={e => update('monthlyRent', Number(e.target.value))}
                    className="w-full mt-1"
                  />
                  <div className="text-xs text-gray-400 mt-1">Rent/m\u00B2: {formatPrice(rentPerSqm)}</div>
                </div>
              </div>
            </div>

            {/* Operating costs */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Operating Costs</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">Management fee (%)</label>
                  <input
                    type="number"
                    value={inputs.managementPct}
                    onChange={e => update('managementPct', Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right"
                    min={0} max={30}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">Maintenance (% of price/yr)</label>
                  <input
                    type="number"
                    value={inputs.maintenancePct}
                    onChange={e => update('maintenancePct', Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right"
                    min={0} max={5} step={0.5}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">Vacancy allowance (%)</label>
                  <input
                    type="number"
                    value={inputs.vacancyPct}
                    onChange={e => update('vacancyPct', Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right"
                    min={0} max={30}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">Insurance (\u20AC/year)</label>
                  <input
                    type="number"
                    value={inputs.insuranceAnnual}
                    onChange={e => update('insuranceAnnual', Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right"
                    min={0} step={50}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Yield summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yield Summary</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-sm text-blue-600 mb-1">Gross Yield</div>
                  <div className="text-3xl font-bold" style={{ color: yieldColor(grossYield) }}>
                    {formatYield(grossYield)}
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-sm text-green-600 mb-1">Net Yield</div>
                  <div className="text-3xl font-bold" style={{ color: yieldColor(netYield) }}>
                    {formatYield(netYield)}
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-sm text-purple-600 mb-1">After Tax</div>
                  <div className="text-3xl font-bold" style={{ color: yieldColor(afterTaxYield) }}>
                    {formatYield(afterTaxYield)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-medium text-gray-900 text-base border-b border-gray-100 pb-2">
                  <span>Monthly Cash Flow (after tax)</span>
                  <span className={afterTaxIncome > 0 ? 'text-green-700' : 'text-red-600'}>
                    {formatPrice(afterTaxIncome / 12)}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-gray-900 text-base">
                  <span>Annual Cash Flow (after tax)</span>
                  <span className={afterTaxIncome > 0 ? 'text-green-700' : 'text-red-600'}>
                    {formatPrice(afterTaxIncome)}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Income Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Gross annual rent</span>
                  <span className="font-medium text-gray-900">{formatPrice(annualRent)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Vacancy loss ({inputs.vacancyPct}%)</span>
                  <span className="font-medium text-red-600">-{formatPrice(annualRent - effectiveRent)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-medium border-t border-gray-100 pt-2">
                  <span>Effective rental income</span>
                  <span>{formatPrice(effectiveRent)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Annual Costs</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Property management ({inputs.managementPct}%)</span>
                  <span className="font-medium text-red-600">-{formatPrice(managementCost)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Maintenance ({inputs.maintenancePct}%)</span>
                  <span className="font-medium text-red-600">-{formatPrice(maintenanceCost)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Property tax ({cd.propertyTaxPct}%)</span>
                  <span className="font-medium text-red-600">-{formatPrice(propertyTax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Insurance</span>
                  <span className="font-medium text-red-600">-{formatPrice(inputs.insuranceAnnual)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-medium border-t border-gray-100 pt-2">
                  <span>Total annual costs</span>
                  <span className="text-red-600">-{formatPrice(totalAnnualCosts)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-medium">
                  <span>Net rental income (pre-tax)</span>
                  <span>{formatPrice(netRentalIncome)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Income tax ({cd.incomeTaxPct}%)</span>
                  <span className="font-medium text-red-600">-{formatPrice(incomeTax)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-semibold text-base border-t border-gray-200 pt-2 mt-2">
                  <span>After-tax income</span>
                  <span className={afterTaxIncome > 0 ? 'text-green-700' : 'text-red-600'}>{formatPrice(afterTaxIncome)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Acquisition Costs</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Purchase price</span>
                  <span className="font-medium">{formatPrice(inputs.purchasePrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Transfer tax ({cd.transferTax}%)</span>
                  <span className="font-medium">{formatPrice(inputs.purchasePrice * cd.transferTax / 100)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Notary fees ({cd.notaryFees}%)</span>
                  <span className="font-medium">{formatPrice(inputs.purchasePrice * cd.notaryFees / 100)}</span>
                </div>
                {cd.agentFees > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Agent fees ({cd.agentFees}%)</span>
                    <span className="font-medium">{formatPrice(inputs.purchasePrice * cd.agentFees / 100)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-900 font-semibold border-t border-gray-100 pt-2">
                  <span>Total investment</span>
                  <span>{formatPrice(totalInvestment)}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center">
              Tax calculations are simplified estimates. Actual tax liability depends on your personal circumstances, residency status, and applicable tax treaties. Consult a tax professional.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
