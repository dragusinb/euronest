import type { Regulation } from '../types';

export const regulations: Regulation[] = [
  {
    countryId: 'greece',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Laws change frequently. Always consult a qualified Greek lawyer before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, with minor exceptions', details: 'EU/EEA citizens can purchase property throughout Greece. However, border zone areas (within ~25km of borders, including some islands like Rhodes, Lesvos, Samos) require special permission from the Ministry of Defence. This is usually granted but adds paperwork and time.', severity: 'favorable' },
          { label: 'Tax identification number (AFM)', value: 'Required before purchase', details: 'You must obtain a Greek tax number (AFM/TIN) from the local tax office (DOY). This can be done in person or via a power of attorney.', severity: 'neutral' },
          { label: 'Notary required?', value: 'Yes, mandatory', details: 'All property transactions must be executed by a Greek notary. The notary drafts the purchase contract, verifies title, and registers the deed.', severity: 'neutral' },
          { label: 'Lawyer recommended?', value: 'Strongly recommended', details: 'While not legally mandatory, hiring a lawyer is essential. They conduct due diligence, check for liens/encumbrances, verify building permits, and represent your interests.', severity: 'neutral' },
          { label: 'Property transfer tax', value: '3.09% of the declared value', details: 'A flat 3.09% transfer tax applies to all property purchases (unless VAT applies to new builds). This is paid before the deed is signed.', severity: 'favorable' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Short-term rentals (Airbnb)', value: 'Allowed with registration', details: 'Properties must be registered on the AADE (tax authority) platform and display a Property Registry Number (AMA). Maximum 2 properties per person for short-term rental, or 3 on islands with <10,000 inhabitants.', severity: 'favorable' },
          { label: 'Short-term rental days limit', value: 'Up to 90 days/year (or 60 in certain areas)', details: 'Maximum 90 days per calendar year for short-term rentals, reduced to 60 days in areas with high tourism pressure. Can be increased to 365 days if annual income from short-term rentals is under \u20AC12,000.', severity: 'neutral' },
          { label: 'Long-term rental tenant protections', value: 'Moderate', details: 'Minimum lease duration is 3 years for residential property (even if a shorter term is written in the contract). Landlords can terminate only with specific legal grounds.', severity: 'neutral' },
          { label: 'Rent control', value: 'No rent control', details: 'Greece does not have rent control. Rents are freely negotiated between landlord and tenant.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax (short-term)', value: '15% flat rate', details: 'Short-term rental income (via platforms like Airbnb) is taxed at a flat 15% for income up to \u20AC12,000. 35% for income \u20AC12,001\u2013\u20AC35,000. 45% above \u20AC35,000.', severity: 'favorable' },
          { label: 'Rental income tax (long-term)', value: '15\u201345% progressive', details: 'Long-term rental income is taxed progressively: 15% up to \u20AC12,000, 35% for \u20AC12,001\u2013\u20AC35,000, 45% above \u20AC35,000. Certain deductions apply for maintenance costs.', severity: 'neutral' },
          { label: 'Annual property tax (ENFIA)', value: '0.1\u20131.15% of assessed value', details: 'ENFIA (Unified Property Tax) is calculated based on property location, size, age, and floor. Rates vary significantly by area. Additional supplementary tax of 0.1\u20131.15% applies for properties valued over \u20AC250,000.', severity: 'neutral' },
          { label: 'Capital gains tax', value: '15% (currently suspended)', details: 'Capital gains tax on property sales has been repeatedly suspended and is currently not applied. This may change \u2013 monitor legislation.', severity: 'favorable' },
          { label: 'Double taxation treaties', value: 'Extensive network', details: 'Greece has double taxation agreements with most EU countries and many others, allowing you to avoid being taxed twice on the same income.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'EU/EEA citizens have automatic right to live and work in Greece. Registration with local authorities is required for stays over 3 months.', severity: 'favorable' },
          { label: 'Golden Visa', value: '\u20AC250,000 minimum investment', details: 'Non-EU citizens can obtain a 5-year renewable residence permit by investing \u20AC250,000+ in Greek real estate (increasing to \u20AC500,000 in Athens, Thessaloniki, Mykonos, Santorini from September 2024). Includes family members.', severity: 'favorable' },
          { label: 'Digital Nomad Visa', value: 'Available for remote workers', details: 'Greece offers a Digital Nomad Visa for non-EU remote workers earning \u20AC3,500+/month from foreign sources. Valid for 1 year, renewable.', severity: 'favorable' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Moderate', details: 'Greek is the official language. Legal documents are in Greek. English is widely spoken in tourist areas and by younger professionals, but a translator/bilingual lawyer is recommended for transactions.', severity: 'neutral' },
          { label: 'Property management', value: 'Growing availability', details: 'Property management services are widely available in Athens and tourist areas. Expect to pay 15\u201325% of rental income for full management.', severity: 'favorable' },
          { label: 'Market liquidity', value: 'Moderate', details: 'Athens and popular islands have good liquidity. Smaller cities and rural areas can be slow to sell. Average time to sell is 6\u201312 months.', severity: 'neutral' },
          { label: 'Building quality', value: 'Variable', details: 'Older buildings (pre-2000) may lack energy efficiency and modern amenities. Always get a technical inspection. New builds and renovations generally meet EU standards.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'france',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. French property law is complex. Always consult a qualified French notaire and/or avocat before purchasing property.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, no restrictions', details: 'No restrictions whatsoever on EU/EEA citizens buying property in France. The process is identical to French citizens buying property.', severity: 'favorable' },
          { label: 'Notaire (notary) role', value: 'Mandatory, central to the process', details: 'The notaire is a public officer who authenticates the sale, conducts title searches, handles funds, registers the deed, and collects taxes. They are impartial (represent neither buyer nor seller specifically). Buyers can appoint their own notaire at no extra cost.', severity: 'neutral' },
          { label: 'Purchase process timeline', value: '3\u20134 months typical', details: 'After signing the compromis de vente (preliminary contract), there is a 10-day cooling-off period, then ~2\u20133 months for the notaire to complete checks before signing the acte authentique (final deed).', severity: 'neutral' },
          { label: 'Notary fees (frais de notaire)', value: '7\u20138% for existing, ~2\u20133% for new', details: 'These are primarily taxes, not notary fees. For existing properties: ~5.8% transfer tax + ~1\u20132% notary fees and disbursements. For new-build (VEFA): ~0.7% + VAT already included in price.', severity: 'restrictive' },
          { label: 'SCI structure', value: 'Popular for investment', details: 'A Soci\u00E9t\u00E9 Civile Immobili\u00E8re (SCI) is a property holding company used by many investors. It offers tax planning flexibility, easier inheritance management, and the ability to hold multiple properties. Setup costs ~\u20AC1,500\u2013\u20AC3,000.', severity: 'favorable' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Short-term rentals (meubl\u00E9 de tourisme)', value: 'Heavily regulated in major cities', details: 'In Paris and other cities with >200k population, short-term rental of your secondary residence requires a change of use authorization (compensation system). Primary residences limited to 120 days/year. Registration number required.', severity: 'restrictive' },
          { label: 'Long-term rental tenant protections', value: 'Very strong (pro-tenant)', details: 'Minimum lease: 3 years (unfurnished) or 1 year (furnished). Cannot evict tenants in winter (November\u2013March truce). Strict legal process for non-payment eviction (can take 12\u201318 months). Security deposit capped at 1\u20132 months.', severity: 'restrictive' },
          { label: 'Rent control', value: 'Applies in major cities (encadrement des loyers)', details: 'Paris, Lyon, Lille, Bordeaux, Montpellier and other tense zones have rent caps. Rents cannot exceed a reference price set by the prefecture. Penalties for non-compliance.', severity: 'restrictive' },
          { label: 'Furnished rental status (LMNP)', value: 'Tax-advantageous regime', details: 'Loueur en Meubl\u00E9 Non Professionnel (LMNP) status allows you to deduct depreciation from rental income, often resulting in near-zero taxable income for years. Very popular with investors. Revenue must be under \u20AC23,000/year or less than total household income.', severity: 'favorable' },
          { label: 'Energy performance requirements', value: 'DPE rating mandatory', details: 'Since 2025, properties rated G on the DPE (energy performance) scale cannot be rented out. F-rated properties follow in 2028. E-rated in 2034. Major renovation may be needed for older properties.', severity: 'restrictive' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '20\u201345% progressive (for non-residents)', details: 'Non-resident landlords pay a minimum 20% on rental income up to \u20AC28,797, then 30% above that (2025 rates). EU residents can claim expenses against income. Social charges of 17.2% also apply (reduced to 7.5% for EU residents affiliated to their home social security).', severity: 'restrictive' },
          { label: 'Micro-foncier regime', value: '30% flat deduction (or 50% for furnished)', details: 'If annual rental income is under \u20AC15,000 (unfurnished) or \u20AC77,700 (furnished/LMNP), you can opt for a simple flat-rate deduction instead of itemizing expenses.', severity: 'favorable' },
          { label: 'Property tax (taxe fonci\u00E8re)', value: 'Variable by commune, \u20AC500\u2013\u20AC3,000+/year', details: 'Paid annually by the owner. Rates vary significantly by commune. Has been rising steadily. Major cities tend to be higher.', severity: 'neutral' },
          { label: 'Capital gains tax', value: '19% + 17.2% social charges', details: 'Total 36.2% on gains, but with taper relief: full exemption after 22 years (income tax) and 30 years (social charges). Primary residence is fully exempt. For EU residents, social charges may be reduced.', severity: 'neutral' },
          { label: 'Wealth tax (IFI)', value: 'Applies if net property assets >\u20AC1.3M', details: 'Imp\u00F4t sur la Fortune Immobili\u00E8re applies to worldwide real estate holdings. Progressive rates from 0.5% to 1.5%. Mortgages are deductible. Only applies to net property wealth above \u20AC1.3M.', severity: 'neutral' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Register at the local mairie for stays over 3 months. No work permit needed.', severity: 'favorable' },
          { label: 'Talent Passport visa', value: 'For investors and entrepreneurs', details: 'Non-EU citizens can obtain a multi-year residence permit through various Talent Passport categories, including real estate investment of \u20AC300,000+.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Significant', details: 'French is used for all legal documents and many administrative processes. English proficiency varies. A bilingual notaire or avocat is essential.', severity: 'neutral' },
          { label: 'Property management', value: 'Widely available', details: 'Professional gestionnaires (property managers) are common and regulated. Expect 6\u201310% of rental income for long-term management, 15\u201325% for short-term/Airbnb.', severity: 'favorable' },
          { label: 'Market liquidity', value: 'Very high', details: 'France has one of Europe\'s most liquid property markets, especially in Paris and major cities. Average time to sell: 3\u20136 months in cities.', severity: 'favorable' },
          { label: 'Co-ownership (copropri\u00E9t\u00E9)', value: 'Complex rules', details: 'Apartments in buildings are managed by a syndicat de copropri\u00E9t\u00E9 (co-ownership association). Review the proc\u00E8s-verbaux (meeting minutes) and charges before buying to understand building health and costs.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'finland',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Finnish real estate professional or lawyer before making a purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, identical to Finnish citizens', details: 'No restrictions at all for EU/EEA citizens. Non-EU citizens need Ministry of Defence permission only for properties near border zones (mainly Russian border).', severity: 'favorable' },
          { label: 'Housing company (As Oy) system', value: 'Unique Finnish model', details: 'Most apartments are owned through shares in a housing company (asunto-osakeyhti\u00F6 / As Oy). You buy shares that entitle you to occupy a specific apartment. The housing company owns the building and land. This is a stock purchase, not real estate transfer.', severity: 'neutral' },
          { label: 'Real estate agent requirement', value: 'Not mandatory but common', details: 'Licensed real estate agents (LKV) are regulated. Agent typically represents the seller. Buyer pays no commission. Agents must disclose all known defects.', severity: 'favorable' },
          { label: 'Transfer tax', value: '2% (shares) or 3% (real estate)', details: 'Housing company shares: 2% of purchase price. Direct real estate (houses/plots): 3% of purchase price. First-time buyers aged 18\u201339 are exempt.', severity: 'favorable' },
          { label: 'Housing company debt', value: 'Check carefully before buying', details: 'Housing companies may carry significant debt (loans for renovations). Buyers inherit their share of this debt. The "debt-free price" = purchase price + share of company debt. Always check the company\u2019s financial statements.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Short-term rentals (Airbnb)', value: 'Generally allowed', details: 'No national registration system for short-term rentals. However, the housing company rules (yhti\u00F6j\u00E4rjestys) may restrict short-term renting. Check before buying. Helsinki has been discussing regulation.', severity: 'favorable' },
          { label: 'Long-term tenant protections', value: 'Moderate', details: 'Standard lease is indefinite. Fixed-term leases allowed with justification. Landlord can terminate indefinite leases with 3\u20136 months notice only for specific reasons (e.g., own use, sale). Tenant gets 1 month notice.', severity: 'neutral' },
          { label: 'Rent control', value: 'No rent control', details: 'Finland has no rent control. Rents are freely negotiated. Rent increases must be agreed in the lease or negotiated with the tenant.', severity: 'favorable' },
          { label: 'Security deposit', value: 'Maximum 3 months rent', details: 'Deposit is typically 1\u20132 months. Cannot exceed 3 months. Must be returned within a reasonable time after lease ends.', severity: 'neutral' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '30\u201334% (capital income tax)', details: 'Net rental income is taxed as capital income: 30% up to \u20AC30,000, 34% above. Deductible expenses include maintenance charges, housing company charges, interest on loans, depreciation (4% of building value for wooden, 2% for stone).', severity: 'neutral' },
          { label: 'Property tax (kiinteist\u00F6vero)', value: '0.93\u20132.0% of assessed value', details: 'Paid by the housing company and passed to shareholders through maintenance charges. Rates set by each municipality within national bands. Helsinki: ~0.93% general, ~1.8% for residential buildings.', severity: 'neutral' },
          { label: 'Capital gains tax', value: '30\u201334% on gains', details: 'Same capital income rates apply: 30% up to \u20AC30,000 gain, 34% above. Exempt if the property was your primary residence for 2+ years. Acquisition cost deduction: actual cost or deemed 20% (40% if owned 10+ years).', severity: 'neutral' },
          { label: 'Double taxation treaties', value: 'Extensive network', details: 'Finland has comprehensive tax treaties with most EU countries and beyond. EU residents generally avoid double taxation on rental income.', severity: 'favorable' },
          { label: 'VAT on rent', value: 'Residential rent is VAT-exempt', details: 'Residential rentals are exempt from VAT. Commercial rentals may be subject to VAT (25.5%) with opt-in.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Register with the Digital and Population Data Services Agency (DVV) for stays over 3 months.', severity: 'favorable' },
          { label: 'No Golden Visa', value: 'No investment-based residence permit', details: 'Finland does not offer a Golden Visa or investment-based residence permit. Non-EU citizens need standard residence permits (work, study, family).', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Low to moderate', details: 'Most Finns speak excellent English, especially in cities. Official documents are in Finnish/Swedish but translations are readily available. Many real estate agents work in English.', severity: 'favorable' },
          { label: 'Property management', value: 'Well-established', details: 'Isännöitsijä (property manager) manages the housing company. Individual rental management services available but less common than in Southern Europe. Many landlords self-manage.', severity: 'neutral' },
          { label: 'Market liquidity', value: 'Good in Helsinki, limited elsewhere', details: 'Helsinki metro area has good liquidity with average sale time of 2\u20134 months. Smaller cities can take 6\u201312 months. Population is concentrating in growth centers.', severity: 'neutral' },
          { label: 'Renovation costs', value: 'Can be significant', details: 'Finnish buildings require regular major renovations (pipe repairs, facade, roof) that can cost \u20AC500\u2013\u20AC1,000/sqm. Check the housing company\u2019s 5-year renovation plan (PTS) before buying.', severity: 'neutral' }
        ]
      }
    ]
  }
];

export function getRegulation(countryId: string): Regulation | undefined {
  return regulations.find(r => r.countryId === countryId);
}
