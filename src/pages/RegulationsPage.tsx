import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { countries } from '../data/countries';
import { getRegulation } from '../data/regulations';
import { severityColor, severityLabel } from '../utils/formatters';
import { ChevronDown, ChevronRight, AlertTriangle, Home, Key, Calculator, Stamp, Info, Shield } from 'lucide-react';
import ExpertQA from '../components/ExpertQA';

const iconMap: Record<string, any> = { Home, Key, Calculator, Stamp, Info };

export default function RegulationsPage() {
  const { countryId } = useParams<{ countryId: string }>();
  const [selected, setSelected] = useState(countryId || 'greece');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const regulation = getRegulation(selected);
  const country = countries.find(c => c.id === selected);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Regulations & Tax Guide</h1>
          <p className="text-gray-600">Everything European expats need to know about buying and renting out property</p>
        </div>

        {/* Country selector */}
        <div className="flex gap-2 mb-6">
          {countries.map(c => (
            <button
              key={c.id}
              onClick={() => { setSelected(c.id); setExpandedSections(new Set()); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer border
                ${selected === c.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
            >
              <span className="text-lg">{c.flag}</span>
              {c.name}
            </button>
          ))}
        </div>

        {regulation && country && (
          <>
            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium mb-1">Important Disclaimer</p>
                <p className="text-sm text-amber-700">{regulation.disclaimer}</p>
                <p className="text-xs text-amber-500 mt-1">Last updated: {regulation.lastUpdated}</p>
              </div>
            </div>

            {/* Country overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{country.flag}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{country.name}</h2>
                  <p className="text-sm text-gray-500">Investment overview</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{country.summary}</p>
              <div className="flex flex-wrap gap-2">
                {country.investmentHighlights.map(h => (
                  <span key={h} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">{h}</span>
                ))}
              </div>
            </div>

            {/* Regulation sections */}
            <div className="space-y-3">
              {regulation.sections.map(section => {
                const isExpanded = expandedSections.has(section.id);
                const Icon = iconMap[section.icon] || Shield;
                const favorableCount = section.items.filter(i => i.severity === 'favorable').length;
                const restrictiveCount = section.items.filter(i => i.severity === 'restrictive').length;

                return (
                  <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer border-0 bg-transparent hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">{section.items.length} items</span>
                            {favorableCount > 0 && (
                              <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{favorableCount} favorable</span>
                            )}
                            {restrictiveCount > 0 && (
                              <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{restrictiveCount} restrictive</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-100 divide-y divide-gray-50">
                        {section.items.map((item, idx) => {
                          const itemKey = `${section.id}-${idx}`;
                          const isItemExpanded = expandedItems.has(itemKey);

                          return (
                            <div key={idx} className="px-5 py-4">
                              <div
                                className={`flex items-start justify-between ${item.details ? 'cursor-pointer' : ''}`}
                                onClick={() => item.details && toggleItem(itemKey)}
                              >
                                <div className="flex-1">
                                  <div className="text-sm text-gray-500 mb-1">{item.label}</div>
                                  <div className="text-base font-medium text-gray-900">{item.value}</div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  {item.severity && (
                                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${severityColor(item.severity)}`}>
                                      {severityLabel(item.severity)}
                                    </span>
                                  )}
                                  {item.details && (
                                    isItemExpanded
                                      ? <ChevronDown className="w-4 h-4 text-gray-400" />
                                      : <ChevronRight className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              {isItemExpanded && item.details && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 leading-relaxed">
                                  {item.details}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Expand all / collapse all */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setExpandedSections(new Set(regulation.sections.map(s => s.id)))}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer border-0 bg-transparent"
              >
                Expand All Sections
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => { setExpandedSections(new Set()); setExpandedItems(new Set()); }}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium cursor-pointer border-0 bg-transparent"
              >
                Collapse All
              </button>
            </div>

            {/* AI Expert Q&A */}
            <div className="mt-8">
              <ExpertQA countryId={selected} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
