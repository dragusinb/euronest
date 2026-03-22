import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot,
  Search,
  Calculator,
  BarChart3,
  Briefcase,
  Shield,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Crown,
  Gift,
  Check,
  Lock,
} from 'lucide-react';
import { cities } from '../data/cities';
import { countries } from '../data/countries';
import { formatPrice, formatYield } from '../utils/formatters';
import { validateAccessCode } from '../utils/accessCodes';
import { useAccessStore } from '../store/accessStore';
import Badge from '../components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  Featured cities: top 6 by gross yield                             */
/* ------------------------------------------------------------------ */
const featuredCities = [...cities]
  .sort((a, b) => b.grossYield - a.grossYield)
  .slice(0, 6);

function countryFlag(countryId: string): string {
  return countries.find((c) => c.id === countryId)?.flag ?? '';
}

function demandLabel(level: string): string {
  switch (level) {
    case 'very-high':
      return 'Very High Demand';
    case 'high':
      return 'High Demand';
    case 'medium':
      return 'Medium Demand';
    default:
      return 'Low Demand';
  }
}

function demandVariant(level: string): 'success' | 'info' | 'warning' | 'neutral' {
  switch (level) {
    case 'very-high':
      return 'success';
    case 'high':
      return 'info';
    case 'medium':
      return 'warning';
    default:
      return 'neutral';
  }
}

/* ------------------------------------------------------------------ */
/*  Section components                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 border border-white/30 rounded-full" />
        <div className="absolute top-40 right-20 w-96 h-96 border border-white/20 rounded-full" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 border border-white/20 rounded-full" />
        <div className="absolute top-20 right-1/4 w-4 h-4 bg-white/40 rounded-full" />
        <div className="absolute top-60 left-1/4 w-3 h-3 bg-white/30 rounded-full" />
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-white/20 rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
          <Sparkles size={14} />
          AI-Powered Real Estate Intelligence
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight max-w-4xl mx-auto">
          Invest in European Real Estate with AI-Powered Insights
        </h1>

        <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Find, analyze, and compare apartment investments across Europe.
          Powered by AI to give you the edge.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all text-lg"
          >
            Explore Properties
            <ArrowRight size={20} />
          </a>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-lg"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { value: '3', label: 'Countries' },
    { value: '13+', label: 'Cities' },
    { value: 'AI', label: 'Powered Analysis' },
    { value: '150 RON', label: 'Premium Access' },
  ];

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-blue-700">{s.value}</div>
              <div className="mt-1 text-sm text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: <Bot size={24} />,
    title: 'AI Investment Advisor',
    desc: 'Get personalized advice from our AI consultant',
  },
  {
    icon: <Search size={24} />,
    title: 'Smart Property Search',
    desc: 'Natural language search across European markets',
  },
  {
    icon: <Calculator size={24} />,
    title: 'Yield Calculator',
    desc: 'Country-specific tax and yield calculations',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Market Comparison',
    desc: 'Compare cities and countries side by side',
  },
  {
    icon: <Briefcase size={24} />,
    title: 'Portfolio Tracker',
    desc: 'Save properties and track your investments',
  },
  {
    icon: <Shield size={24} />,
    title: 'Regulation Guide',
    desc: 'Understand local rules for EU expats',
  },
];

function FeaturesGrid() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">
            Everything you need to invest with confidence
          </h2>
          <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
            Powerful tools designed for European real estate investors
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600 mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCities() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Top-Yielding Cities</h2>
          <p className="mt-3 text-gray-500 text-lg">
            Explore the highest-performing markets across Europe
          </p>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6 scrollbar-hide">
          {featuredCities.map((city) => (
            <Link
              key={city.id}
              to={`/city/${city.id}`}
              className="flex-shrink-0 w-72 snap-start group"
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all">
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={city.imageUrl}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant={demandVariant(city.demandLevel)} size="sm">
                      {demandLabel(city.demandLevel)}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{countryFlag(city.countryId)}</span>
                    <h3 className="font-semibold text-gray-900">{city.name}</h3>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatYield(city.grossYield)}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">Gross Yield</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-700">
                        {formatPrice(city.averagePricePerSqm)}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">per m&sup2;</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing Section                                                   */
/* ------------------------------------------------------------------ */

const includedFeatures = [
  'Interactive map with 55+ European cities',
  'Real property listings updated daily',
  'AI Investment Advisor (unlimited)',
  'AI Property Analysis & Buying Guides',
  'Regulation guides for 23 countries',
  'Yield calculator & ROI projections',
  'Market insights & comparison tools',
  'Portfolio tracker',
];

function PricingSection() {
  const navigate = useNavigate();
  const activate = useAccessStore(s => s.activate);

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState(false);

  const [lightlyCode, setLightlyCode] = useState('');
  const [lightlyError, setLightlyError] = useState('');
  const [lightlySuccess, setLightlySuccess] = useState(false);

  const stripeLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK || '#';

  const handleActivate = async (
    inputCode: string,
    setError: (v: string) => void,
    setSuccess: (v: boolean) => void,
  ) => {
    setError('');
    setSuccess(false);

    if (!inputCode.trim()) {
      setError('Please enter an access code.');
      return;
    }

    const result = await validateAccessCode(inputCode.trim());
    if (result) {
      setSuccess(true);
      activate(result);
      setTimeout(() => navigate('/explore'), 600);
    } else {
      setError('Invalid access code. Please check and try again.');
    }
  };

  return (
    <section id="pricing" className="bg-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Unlock Full Access to EuroNest
          </h2>
          <p className="mt-3 text-gray-500 text-lg max-w-2xl mx-auto">
            Get AI-powered investment intelligence across 23 European countries
          </p>
        </div>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Card 1 — Lightly.ro Subscribers */}
          <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600">
                <Gift size={22} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Lightly.ro Subscribers</h3>
            </div>

            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full w-fit mb-4">
              FREE
            </span>

            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Already managing properties with Lightly.ro? You get full EuroNest access included in your subscription.
            </p>

            {/* Inline code form */}
            <div className="mt-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lightlyCode}
                  onChange={(e) => {
                    setLightlyCode(e.target.value);
                    setLightlyError('');
                    setLightlySuccess(false);
                  }}
                  placeholder="Enter your Lightly.ro code"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  onClick={() => handleActivate(lightlyCode, setLightlyError, setLightlySuccess)}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-sm whitespace-nowrap"
                >
                  Activate
                </button>
              </div>
              {lightlyError && (
                <p className="mt-2 text-sm text-red-600">{lightlyError}</p>
              )}
              {lightlySuccess && (
                <p className="mt-2 text-sm text-emerald-600 font-medium">
                  Access activated! Redirecting...
                </p>
              )}

              <p className="mt-4 text-sm text-gray-400">
                Don't have Lightly.ro?{' '}
                <a
                  href="https://lightly.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Learn more &rarr;
                </a>
              </p>
            </div>
          </div>

          {/* Card 2 — Direct Purchase */}
          <div className="relative rounded-2xl border-2 border-blue-200 bg-white shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600">
                <Crown size={22} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">One-Time Purchase</h3>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">150 RON</span>
              <span className="ml-2 text-gray-400 text-sm">~&euro;30 &middot; Lifetime access</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <Check size={16} className="mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href={stripeLink}
              className="block w-full text-center px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-lg shadow-lg shadow-blue-200"
            >
              Buy Now &mdash; 150 RON
            </a>
            <p className="mt-3 text-xs text-gray-400 text-center">
              <Lock size={12} className="inline -mt-0.5 mr-1" />
              Secure payment via Stripe. Instant access.
            </p>
          </div>
        </div>

        {/* Bottom access code entry */}
        <div className="max-w-lg mx-auto text-center">
          <p className="text-gray-500 text-sm font-medium mb-3">Already have an access code?</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setCodeError('');
                setCodeSuccess(false);
              }}
              placeholder="Enter access code"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => handleActivate(code, setCodeError, setCodeSuccess)}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm"
            >
              Activate
            </button>
          </div>
          {codeError && (
            <p className="mt-2 text-sm text-red-600">{codeError}</p>
          )}
          {codeSuccess && (
            <p className="mt-2 text-sm text-emerald-600 font-medium">
              Access activated! Redirecting...
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: '1',
      icon: <MapPin size={28} />,
      title: 'Explore Markets',
      desc: 'Browse countries and cities with detailed market data and AI insights.',
    },
    {
      num: '2',
      icon: <TrendingUp size={28} />,
      title: 'Analyze Properties',
      desc: 'Get AI-powered analysis, yield calculations, and risk assessments.',
    },
    {
      num: '3',
      icon: <Briefcase size={28} />,
      title: 'Build Portfolio',
      desc: 'Save properties, compare investments, and track your portfolio.',
    },
  ];

  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-3 text-gray-500 text-lg">
            Three simple steps to smarter real estate investing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div key={step.num} className="text-center relative">
              {/* Connector line (hidden on first and mobile) */}
              {i > 0 && (
                <div className="hidden md:block absolute top-8 -left-5 w-10 border-t-2 border-dashed border-blue-200" />
              )}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-5 shadow-lg shadow-blue-200">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to find your next investment?
        </h2>
        <p className="mt-4 text-blue-100 text-lg max-w-xl mx-auto">
          Join investors using AI-powered insights to make smarter real estate decisions across Europe.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all text-lg"
          >
            Explore Free Preview
            <ArrowRight size={20} />
          </Link>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-lg"
          >
            Unlock Full Access &mdash; 150 RON
            <Lock size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const navLinks = [
    { to: '/explore', label: 'Explore' },
    { to: '/compare', label: 'Compare' },
    { to: '/calculator', label: 'Calculator' },
    { to: '/regulations', label: 'Regulations' },
    { to: '/about', label: 'About' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              EN
            </div>
            <span className="text-white font-semibold text-lg">EuroNest</span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm space-y-2">
          <p>
            Built with{' '}
            <span role="img" aria-label="love">
              &#10084;&#65039;
            </span>{' '}
            for European investors
          </p>
          <p className="text-gray-500 text-xs max-w-2xl mx-auto">
            Disclaimer: All data on this platform is for informational purposes only and does not
            constitute financial, legal, or investment advice. Property prices, yields, and
            regulations may change. Always consult qualified professionals before making investment
            decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Landing Page                                                      */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <StatsBar />
      <FeaturesGrid />
      <FeaturedCities />
      <PricingSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
}
