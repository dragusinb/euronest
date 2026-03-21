import { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  children: ReactNode;
}

export default function Tabs({ tabs, activeTab, onChange, children }: TabsProps) {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current.get(activeTab);
    if (el) {
      const parent = el.parentElement;
      if (parent) {
        setIndicator({
          left: el.offsetLeft - parent.offsetLeft,
          width: el.offsetWidth,
        });
      }
    }
  }, [activeTab]);

  return (
    <div>
      <div className="relative border-b border-gray-200">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
              }}
              onClick={() => onChange(tab.id)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        <div
          className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>
      <div className="pt-4">{children}</div>
    </div>
  );
}
