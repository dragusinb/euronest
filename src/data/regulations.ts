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
  },
  {
    countryId: 'spain',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Spanish lawyer (abogado) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, no restrictions', details: 'EU/EEA citizens can purchase property anywhere in Spain with no restrictions. A NIE (Número de Identidad de Extranjero) is required before any transaction.', severity: 'favorable' },
          { label: 'Transfer tax (ITP)', value: '6–10% depending on region', details: 'Impuesto de Transmisiones Patrimoniales (ITP) varies by autonomous community: Catalonia 10%, Andalusia 7%, Madrid 6%, Valencia 10%. Applies to resale properties. New builds pay 10% VAT instead.', severity: 'neutral' },
          { label: 'Notary and registry fees', value: '~1–2% of purchase price', details: 'Notary fees (~0.5–1%), land registry fees (~0.5–1%), and gestoría (administrative agent) fees (~€300–500). Total ancillary costs typically 1–2%.', severity: 'neutral' },
          { label: 'NIE requirement', value: 'Mandatory for all foreign buyers', details: 'You must obtain a Número de Identidad de Extranjero (NIE) before purchasing. Can be obtained at Spanish consulates abroad or local police stations in Spain. Processing takes 1–4 weeks.', severity: 'neutral' },
          { label: 'Due diligence', value: 'Essential – check nota simple', details: 'Always obtain a nota simple from the Land Registry to verify ownership, charges, and encumbrances. Check for outstanding community fees, unpaid taxes, and building licenses.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Short-term rentals (tourist use)', value: 'Heavily regulated, varies by region', details: 'Each autonomous community has its own rules. Many require a tourist license (licencia turística). Barcelona and Balearic Islands have imposed moratoriums on new licenses. Valencia and Andalusia are more permissive.', severity: 'restrictive' },
          { label: 'Long-term lease duration', value: 'Minimum 5 years (individual landlord)', details: 'Under the Ley de Arrendamientos Urbanos (LAU), minimum lease is 5 years for individual landlords, 7 years for corporate landlords. Automatic annual extensions up to that minimum.', severity: 'restrictive' },
          { label: 'Rent control', value: 'No national control, but regional laws emerging', details: 'Spain has no national rent control, but Catalonia introduced rent caps in tensioned zones under the 2023 housing law. Other regions may follow. Rent increases tied to an index replacing CPI.', severity: 'neutral' },
          { label: 'Rental yield potential', value: 'Strong in coastal and urban areas', details: 'Gross yields of 5–8% achievable in cities like Valencia, Malaga, and Alicante. Madrid and Barcelona typically 3–5% due to higher prices. Tourist areas offer strong seasonal returns.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax (EU residents)', value: '19% on net income', details: 'EU/EEA residents pay 19% flat tax on net rental income (after deductible expenses like insurance, repairs, community fees, mortgage interest, depreciation at 3%). Non-EU residents pay 24% on gross income with no deductions.', severity: 'neutral' },
          { label: 'Annual property tax (IBI)', value: '0.4–1.1% of cadastral value', details: 'Impuesto sobre Bienes Inmuebles (IBI) varies by municipality. Based on cadastral value (valor catastral), which is typically well below market value. Paid annually.', severity: 'neutral' },
          { label: 'Capital gains tax', value: '19–26% progressive', details: 'Capital gains taxed progressively: 19% (up to €6,000), 21% (€6,001–€50,000), 23% (€50,001–€200,000), 26% (above €200,000). Over-65s exempt on primary residence. 3% withholding for non-residents.', severity: 'neutral' },
          { label: 'Wealth tax (Patrimonio)', value: 'Varies by region, 0.2–3.5%', details: 'Impuesto sobre el Patrimonio applies to net wealth above €700,000 (€500,000 in Catalonia). Madrid offers 100% bonus (effectively 0%). Non-residents get €700,000 exemption. New solidarity tax also applies above €3M.', severity: 'restrictive' },
          { label: 'Non-resident imputed income', value: '1.1–2% of cadastral value taxed at 19%', details: 'Non-residents owning property they do not rent out must pay imputed income tax: 2% of cadastral value (1.1% if revised after 1994) taxed at 19% for EU residents.', severity: 'neutral' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Must register at the Oficina de Extranjería for stays over 3 months and obtain a certificate of registration (certificado de registro).', severity: 'favorable' },
          { label: 'Golden Visa', value: 'Suspended since April 2025', details: 'Spain suspended its Golden Visa program for real estate investment (previously €500,000 minimum) in April 2025 due to housing affordability concerns. Existing holders retain their permits.', severity: 'restrictive' },
          { label: 'Non-lucrative visa', value: 'Available for retirees/passive income', details: 'Non-EU citizens with sufficient passive income (typically €28,800+/year) can obtain a non-lucrative visa. Does not permit employment in Spain. Renewable annually.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Moderate', details: 'Spanish is essential for legal documents and administration. English widely spoken in tourist/expat areas (Costa del Sol, Balearics) but limited in smaller cities. Use a bilingual lawyer.', severity: 'neutral' },
          { label: 'Property management', value: 'Widely available', details: 'Property management services are abundant, especially in tourist areas. Expect 15–25% of rental income for short-term management, 8–12% for long-term.', severity: 'favorable' },
          { label: 'Market liquidity', value: 'High in major cities and coasts', details: 'Madrid, Barcelona, Costa del Sol, and Balearics have excellent liquidity. Average sale time: 3–6 months in cities. Interior/rural areas can take much longer.', severity: 'favorable' },
          { label: 'Squatter risk (okupación)', value: 'A concern in some areas', details: 'Spain has laws that can make evicting squatters difficult and slow (sometimes 12–18 months). Keep property occupied, install security, and ensure a rapid legal response plan.', severity: 'restrictive' }
        ]
      }
    ]
  },
  {
    countryId: 'portugal',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Portuguese lawyer (advogado) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, no restrictions', details: 'EU/EEA citizens can purchase property anywhere in Portugal with no restrictions. A NIF (Número de Identificação Fiscal) is required before any transaction.', severity: 'favorable' },
          { label: 'Transfer tax (IMT)', value: '0–8% progressive scale', details: 'Imposto Municipal sobre Transmissões Onerosas (IMT) is progressive based on property value and type: 0% below €101,917 (primary residence), up to 8% for luxury properties (above €1M). Secondary/investment properties start at 1%.', severity: 'neutral' },
          { label: 'Stamp duty (Imposto de Selo)', value: '0.8% of purchase price', details: 'A flat 0.8% stamp duty applies to all property purchases on top of IMT. Also 0.6% stamp duty on mortgage value if financed.', severity: 'neutral' },
          { label: 'NIF requirement', value: 'Mandatory tax number', details: 'All buyers must obtain a NIF (fiscal number). EU citizens can apply directly at tax offices. Non-EU citizens need a fiscal representative in Portugal.', severity: 'neutral' },
          { label: 'Notary and registry costs', value: '~1% of purchase price', details: 'Notary fees (€250–500), land registry (€250), legal fees (0.5–1% typical). Total ancillary costs around 1% of purchase price.', severity: 'favorable' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Short-term rentals (Alojamento Local)', value: 'New registrations suspended in some areas', details: 'Portugal suspended new Alojamento Local (AL) registrations in areas with housing pressure in 2023. Existing licenses are safe but transferability is limited. Rural and lower-pressure areas still allow new registrations.', severity: 'restrictive' },
          { label: 'Long-term lease duration', value: 'Flexible, minimum 1 year standard', details: 'No mandatory minimum for fixed-term leases, but standard practice is 1 year minimum. Indefinite leases can be terminated by landlord with 2-year notice for own use.', severity: 'neutral' },
          { label: 'Rent control', value: 'Limited – mostly affects historic leases', details: 'Old pre-1990 leases have transitional rent protections. New leases are freely negotiated. Annual rent increases limited to CPI-linked coefficient published by government.', severity: 'neutral' },
          { label: 'Rental yield potential', value: 'Strong in Lisbon, Porto, and Algarve', details: 'Gross yields of 4–6% in Lisbon and Porto. Algarve offers strong seasonal yields. Interior cities like Braga and Coimbra offer higher yields (5–8%) at lower price points.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '25% flat rate (non-residents) or progressive', details: 'Non-residents pay 25% flat tax on gross rental income (or can opt for progressive rates 14.5–48% if more favorable). Residents are taxed at progressive rates. Option to tax at 25% autonomous rate.', severity: 'neutral' },
          { label: 'NHR regime', value: 'Ended for new applicants (2024)', details: 'The Non-Habitual Resident (NHR) tax regime, which offered 10-year flat 20% tax on Portuguese income, ended for new applicants in 2024. Existing NHR holders retain benefits for their 10-year period. A new incentive for scientific research exists.', severity: 'restrictive' },
          { label: 'Annual property tax (IMI)', value: '0.3–0.45% (urban), 0.8% (rural)', details: 'Imposto Municipal sobre Imóveis (IMI) rates set by municipality: 0.3–0.45% for urban properties, 0.8% for rural. Based on patrimonial tax value (VPT), often below market value. Additional IMI (AIMI) of 0.4–1.5% for high-value portfolios.', severity: 'neutral' },
          { label: 'Capital gains tax', value: '28% flat or 50% added to income', details: 'Non-residents pay 28% on gains. Residents include 50% of gain in their progressive income tax. Reinvestment in another primary residence in EU exempts the gain. Properties bought before 1989 are exempt.', severity: 'neutral' },
          { label: 'Double taxation treaties', value: 'Extensive network (80+ countries)', details: 'Portugal has double taxation agreements with most EU countries and many global jurisdictions. Treaty relief available to avoid being taxed twice.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Register at the local Câmara Municipal for stays over 3 months.', severity: 'favorable' },
          { label: 'Golden Visa', value: 'Reformed – no residential property in Lisbon/Porto', details: 'Portugal\'s Golden Visa still exists but residential real estate investment in Lisbon, Porto, and coastal high-density areas is excluded. Options include: commercial real estate (€500,000), investment funds (€500,000), scientific research (€500,000), or cultural heritage rehabilitation (€250,000+).', severity: 'neutral' },
          { label: 'D7 Passive Income Visa', value: 'Popular for retirees', details: 'Non-EU citizens with regular passive income (pension, investments, rental income) of approximately €9,120+/year (minimum wage) can obtain a D7 visa. Leads to permanent residency and citizenship after 5 years.', severity: 'favorable' },
          { label: 'Digital Nomad Visa', value: 'Available for remote workers', details: 'Non-EU remote workers earning at least 4x Portuguese minimum wage (~€3,040/month) from foreign employers can obtain a Digital Nomad Visa. Valid for 1 year, renewable.', severity: 'favorable' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Low', details: 'English is widely spoken in Lisbon, Porto, and the Algarve. Younger professionals and the real estate industry generally work in English. Legal documents are in Portuguese but bilingual lawyers are readily available.', severity: 'favorable' },
          { label: 'Property management', value: 'Widely available', details: 'Property management services are well developed, especially in Lisbon, Porto, and Algarve. Expect 15–25% for short-term rental management, 8–12% for long-term.', severity: 'favorable' },
          { label: 'Market liquidity', value: 'High in Lisbon, Porto, and Algarve', details: 'Major cities and the Algarve have strong liquidity. Average sale time: 2–4 months in Lisbon and Porto. Interior regions and smaller cities are less liquid.', severity: 'favorable' },
          { label: 'Energy certificate', value: 'Mandatory for all sales and rentals', details: 'An energy performance certificate (certificado energético) is legally required for all property sales and rentals. Ratings from A+ (best) to F (worst). Affects marketability and rental potential.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'italy',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Italian lawyer (avvocato) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, no restrictions', details: 'EU/EEA citizens can purchase property anywhere in Italy. A codice fiscale (tax code) is required before any transaction. Non-EU citizens can buy under reciprocity agreements.', severity: 'favorable' },
          { label: 'Registration tax (imposta di registro)', value: '2% (primary) or 9% (secondary residence)', details: 'Resale properties: 2% of cadastral value for primary residence (prima casa), 9% for secondary/investment property. Minimum €1,000. New builds from developer pay 4% or 10% VAT instead.', severity: 'neutral' },
          { label: 'Notary fees', value: '1–2.5% of declared value', details: 'Notaio fees are regulated and based on property value. Typically 1–2.5%. The notary is mandatory and handles title verification, deed registration, and tax collection.', severity: 'neutral' },
          { label: 'Preliminary contract (compromesso)', value: 'Binding agreement with deposit', details: 'The compromesso (or contratto preliminare) is a binding pre-contract. Buyer pays a confirming deposit (caparra confirmatoria), typically 10–20%. If buyer withdraws, they lose the deposit. If seller withdraws, they must return double.', severity: 'neutral' },
          { label: 'Codice fiscale', value: 'Mandatory tax ID for purchase', details: 'All buyers must obtain an Italian fiscal code (codice fiscale) from the Agenzia delle Entrate or Italian consulate. Free and relatively quick to obtain.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Short-term rentals', value: 'Regulated, CIN required', details: 'Italy introduced a national identification code (CIN – Codice Identificativo Nazionale) for all short-term rentals. Registration mandatory on the national database. Some cities (Florence, Venice) impose additional restrictions.', severity: 'neutral' },
          { label: 'Cedolare secca', value: '21% flat tax on rental income (or 10%)', details: 'The cedolare secca regime offers a 21% flat tax on rental income (replacing progressive IRPEF tax). Reduced 10% rate applies for "agreed rent" contracts (canone concordato) in high-demand municipalities.', severity: 'favorable' },
          { label: 'Long-term lease structure', value: '4+4 years standard', details: 'Standard residential leases are 4 years, automatically renewing for another 4 (contratto 4+4). Alternative: 3+2 agreed-rent contracts. Landlord can refuse renewal at the end of the first period only for specific legal reasons.', severity: 'neutral' },
          { label: 'Tenant protections', value: 'Moderate to strong', details: 'Eviction for non-payment requires court proceedings and can take 6–12 months. Winter eviction moratoriums may apply in some areas. Always check tenant references and proof of income.', severity: 'restrictive' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '21% flat (cedolare secca) or progressive', details: 'Landlords can choose: cedolare secca at 21% flat (10% for agreed-rent contracts) or standard IRPEF progressive rates (23–43%). Cedolare secca is almost always more favorable for investors.', severity: 'favorable' },
          { label: 'Annual property tax (IMU)', value: '0.76–1.06% of cadastral value', details: 'Imposta Municipale Unica (IMU) applies to all properties except primary residence (unless luxury). Rate set by municipality, typically 0.76–1.06% of cadastral value (which is well below market value).', severity: 'neutral' },
          { label: 'Capital gains tax', value: '26% flat or progressive IRPEF', details: 'Properties sold within 5 years of purchase are subject to capital gains tax: 26% flat rate or added to progressive IRPEF income. Exempt after 5 years of ownership. Primary residence exempt at any time.', severity: 'neutral' },
          { label: 'Flat tax regime for new residents', value: '€200,000/year on foreign income', details: 'Italy offers a flat €200,000/year substitute tax on all foreign-source income for new tax residents (increased from €100,000). Attractive for high-net-worth individuals relocating to Italy.', severity: 'favorable' },
          { label: 'Succession tax', value: '4–8% with generous exemptions', details: 'Inheritance tax: 4% for spouse/children (€1M exemption each), 6% for siblings (€100K exemption), 8% for others (no exemption). Applied to cadastral value, not market value.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Register at the Anagrafe (civil registry) of the local Comune for stays over 3 months.', severity: 'favorable' },
          { label: 'Investor Visa (Visto per Investitori)', value: 'Available from €250,000', details: 'Non-EU citizens can obtain a 2-year investor visa by investing €250,000 in an Italian startup, €500,000 in an Italian company, €1M in a philanthropic project, or €2M in government bonds. Does not apply to real estate directly.', severity: 'neutral' },
          { label: 'Elective Residency Visa', value: 'For retirees with passive income', details: 'Non-EU citizens with sufficient passive income (typically €31,000+/year) can apply for an elective residency visa. Cannot work in Italy. Popular with retirees.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Bureaucracy', value: 'Complex and slow', details: 'Italian bureaucracy is notoriously complex. Property transactions involve multiple government offices. Patience and a good commercialista (accountant) and avvocato (lawyer) are essential.', severity: 'restrictive' },
          { label: 'Property management', value: 'Available in major cities and tourist areas', details: 'Property management services well developed in Rome, Milan, Florence, and tourist areas. Expect 15–25% for short-term, 8–12% for long-term management. Less available in rural areas.', severity: 'neutral' },
          { label: 'Market liquidity', value: 'Variable by region', details: 'Milan and Rome have good liquidity (3–6 month sales). Tuscany, Lake Como, and Amalfi Coast depend on season. €1 homes in abandoned villages highlight oversupply in some rural areas.', severity: 'neutral' },
          { label: 'Building compliance (conformità)', value: 'Critical to verify', details: 'Italian properties frequently have irregularities between the actual layout and official plans (catasto/comune records). Any discrepancies must be regularized before sale. Budget for geometra (surveyor) costs.', severity: 'restrictive' }
        ]
      }
    ]
  },
  {
    countryId: 'germany',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified German lawyer (Rechtsanwalt) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, no restrictions at all', details: 'No restrictions for any nationality. EU, non-EU, individuals, and companies can all buy property freely in Germany without permits or approvals.', severity: 'favorable' },
          { label: 'Transfer tax (Grunderwerbsteuer)', value: '3.5–6.5% depending on state', details: 'Real estate transfer tax varies by Bundesland: Bavaria/Saxony 3.5%, Hamburg 5.5%, Berlin 6%, NRW 6.5%, Brandenburg 6.5%, Schleswig-Holstein 6.5%. A significant upfront cost.', severity: 'restrictive' },
          { label: 'Notary fees', value: '~1.5–2% of purchase price', details: 'A notary (Notar) is legally required for all property transactions. Notary fees (~1.5%) plus land registry (Grundbuch) fees (~0.5%) are regulated and non-negotiable.', severity: 'neutral' },
          { label: 'Estate agent fees (Maklerprovision)', value: '3.57–7.14% split buyer/seller', details: 'Since December 2020, agent fees for residential property must be split equally between buyer and seller. Typical total: 5.95–7.14% (incl. VAT). Split varies by region.', severity: 'restrictive' },
          { label: 'Purchase process', value: 'Highly regulated and secure', details: 'The German system is very secure: Grundbuch (land register) is definitive proof of ownership, Notar is impartial, and an Auflassungsvormerkung (priority notice) protects buyer from the moment of signing. Process takes 6–12 weeks.', severity: 'favorable' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Tenant protections (Kündigungsschutz)', value: 'Very strong – among strongest in Europe', details: 'Tenants in Germany have extensive protections. Landlords can only terminate leases for limited reasons (own use, significant breach, economic necessity). Notice periods range from 3 to 9 months depending on tenancy length.', severity: 'restrictive' },
          { label: 'Rent brake (Mietpreisbremse)', value: 'Applies in designated tight markets', details: 'In areas with tight housing markets (most major cities including Berlin, Munich, Hamburg, Frankfurt), new rents cannot exceed the local reference rent (Mietspiegel) by more than 10%. Exceptions for new builds and extensive renovations.', severity: 'restrictive' },
          { label: 'Rent increases (existing tenants)', value: 'Capped at 20% over 3 years', details: 'For existing tenants, rent can only be increased up to the local reference rent and by a maximum of 20% within 3 years (15% in tight markets). Modernization surcharges limited to €2–3/sqm.', severity: 'restrictive' },
          { label: 'Short-term rentals', value: 'Restricted in major cities', details: 'Berlin, Munich, Hamburg and other cities require permits (Zweckentfremdungsverbot) for short-term rentals of entire apartments. Primary residence can usually be rented up to 90 days/year. Heavy fines for violations.', severity: 'restrictive' },
          { label: 'Rental yield potential', value: 'Moderate, capital appreciation focused', details: 'Gross yields of 3–5% in major cities. Germany is traditionally a capital appreciation market with strong long-term price growth. B/C cities (Leipzig, Dresden, Dortmund) offer higher yields of 5–7%.', severity: 'neutral' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: 'Progressive 14–45% (+ solidarity surcharge)', details: 'Rental income is taxed at progressive rates: 14–45%. Non-residents typically face 14–45% on German-source income. Extensive deductions available: depreciation (2–3%/year), interest, maintenance, management costs.', severity: 'neutral' },
          { label: 'Capital gains tax', value: '25% + solidarity surcharge (exempt after 10 years)', details: 'Private property sales within 10 years of purchase are taxed as income at your marginal rate. After 10 years of ownership: completely tax-free. This is one of Germany\'s most investor-friendly rules.', severity: 'favorable' },
          { label: 'Depreciation (AfA)', value: '2–3% of building value annually', details: 'Buildings can be depreciated: 2% for buildings built after 1924, 2.5% for pre-1925 buildings, 3% for buildings completed after 2023. Land value is excluded. This significantly reduces taxable rental income.', severity: 'favorable' },
          { label: 'Property tax (Grundsteuer)', value: 'Currently being reformed, varies widely', details: 'Grundsteuer reform took effect in 2025. Rates vary by municipality. Typical annual cost: €200–1,000 for an apartment. Passed through to tenants in many cases via operating costs (Nebenkosten).', severity: 'neutral' },
          { label: 'Solidarity surcharge', value: '5.5% of income tax (if applicable)', details: 'The solidarity surcharge (Solidaritätszuschlag) of 5.5% still applies to capital gains and investment income, and to higher earners. Abolished for ~90% of regular income taxpayers since 2021.', severity: 'neutral' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Register at the local Einwohnermeldeamt (residents\' registration office) within two weeks of moving. The Anmeldung is essential for all administrative processes.', severity: 'favorable' },
          { label: 'No Golden Visa', value: 'No investment-based residence permit', details: 'Germany does not offer a Golden Visa or property investment visa. Non-EU citizens must obtain standard residence permits (work, study, family, self-employment).', severity: 'neutral' },
          { label: 'Self-employment visa', value: 'Available for entrepreneurs', details: 'Non-EU citizens can apply for a self-employment residence permit if their business serves the local economy. Property investment alone is generally not sufficient grounds.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Moderate to significant', details: 'Legal and administrative processes are in German. While many professionals speak English, contracts and official documents are in German. A bilingual lawyer or translator is recommended.', severity: 'neutral' },
          { label: 'Property management (Hausverwaltung)', value: 'Well-established profession', details: 'WEG-Verwaltung (condo management) and Mietverwaltung (rental management) are well-regulated professions. Rental management typically costs 5–8% of rental income. Sondereigentumsverwaltung available for individual units.', severity: 'favorable' },
          { label: 'Market liquidity', value: 'Very high in major cities', details: 'Berlin, Munich, Hamburg, Frankfurt, and Düsseldorf have extremely liquid markets. Average sale time: 2–4 months. East German cities and rural areas are less liquid.', severity: 'favorable' },
          { label: 'Energieausweis (energy certificate)', value: 'Mandatory for all sales', details: 'An energy performance certificate is legally required. Properties with poor energy ratings may require costly renovations. New EU energy efficiency directives will increase pressure on older buildings.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'netherlands',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Dutch lawyer (advocaat) or civil-law notary (notaris) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, no restrictions', details: 'No restrictions on any nationality purchasing property in the Netherlands. The process is the same for residents and non-residents, though mortgage access is easier for residents.', severity: 'favorable' },
          { label: 'Transfer tax (overdrachtsbelasting)', value: '2% residential, 10.4% non-residential', details: 'Standard residential rate is 2%. Non-residential (commercial) properties: 10.4%. First-time buyers aged 18–35 buying a home under €510,000 (2025) for owner-occupancy: 0%. Investment properties pay 10.4%.', severity: 'neutral' },
          { label: 'Notary required', value: 'Yes, mandatory for transfer', details: 'A civil-law notary (notaris) is required to execute the transfer deed (leveringsakte). The notary is impartial. Separate from a makelaar (real estate agent). Costs: ~€1,000–2,000.', severity: 'neutral' },
          { label: 'Cooling-off period', value: '3 days for buyers', details: 'Buyers have a mandatory 3-day cooling-off period after signing the koopovereenkomst (purchase agreement) during which they can withdraw without penalty.', severity: 'favorable' },
          { label: 'Building inspection (bouwkundige keuring)', value: 'Strongly recommended', details: 'Not mandatory but strongly recommended. A professional inspection costs €300–500 and can reveal structural issues, moisture, asbestos, etc. Some buyers include an inspection clause in the purchase contract.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Rent control', value: 'Applies below liberalization threshold', details: 'Properties scoring below 186 points on the woningwaarderingsstelsel (WWS points system) are in the regulated sector with maximum rents. From 2024, the regulated sector expanded to "mid-segment" (middenhuur) up to approximately €1,157/month. Free-sector rents above this are unregulated.', severity: 'restrictive' },
          { label: 'Tenant protections', value: 'Strong', details: 'Tenants have strong protections under Dutch law. Indefinite leases are standard; landlords can only terminate via court for specific reasons. Fixed-term leases (max 2 years) end automatically.', severity: 'restrictive' },
          { label: 'Short-term rentals', value: 'Restricted in Amsterdam and other cities', details: 'Amsterdam limits short-term rentals to 30 nights/year (down from 60). Registration and tourist tax required. Rotterdam: 60 nights. Some neighborhoods banned entirely. Enforcement is active.', severity: 'restrictive' },
          { label: 'Rental yield potential', value: 'Moderate, strong appreciation', details: 'Gross yields of 3–5% in Amsterdam and major cities. Higher yields (5–7%) in cities like Rotterdam, The Hague, Eindhoven. Market has seen strong capital appreciation over the past decade.', severity: 'neutral' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Box 3 wealth tax', value: '~2% effective rate on property value', details: 'The Netherlands does not tax actual rental income. Instead, property investments fall under Box 3 (savings and investments), which taxes a deemed return on net asset value. The effective rate is approximately 1.7–2.0% of the WOZ value minus mortgage debt, depending on asset mix.', severity: 'restrictive' },
          { label: 'WOZ value (property valuation)', value: 'Municipal valuation, basis for taxes', details: 'The WOZ-waarde is the official municipal valuation, reassessed annually. It serves as the basis for property tax (OZB), Box 3 wealth tax, and water board tax. Can be appealed if too high.', severity: 'neutral' },
          { label: 'Local property taxes', value: 'OZB + water board + waste', details: 'Annual local taxes include: onroerendezaakbelasting (OZB, ~0.1–0.3% of WOZ), waterschapsbelasting (water board, €200–400/year), afvalstoffenheffing (waste, €200–400/year).', severity: 'neutral' },
          { label: 'Capital gains tax', value: 'No separate capital gains tax', details: 'There is no separate capital gains tax on property sales. Instead, the Box 3 wealth tax is deemed to cover investment returns. This means no tax on the gain itself when you sell.', severity: 'favorable' },
          { label: 'Corporate structure (BV)', value: 'Can be tax-efficient for portfolios', details: 'Holding investment property in a BV (private limited company) is taxed under corporate rates (19–25.8%) on actual rental income and gains. Can be more efficient for larger portfolios than Box 3.', severity: 'neutral' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Register at the local Gemeente (municipality) and obtain a BSN (citizen service number) within 5 days of arrival.', severity: 'favorable' },
          { label: 'No Golden Visa', value: 'No investment-based residence permit', details: 'The Netherlands does not offer a Golden Visa. Non-EU citizens must apply through standard channels: work permit (kennismigrant for skilled workers), entrepreneurship (startup visa), or family reunification.', severity: 'neutral' },
          { label: 'DAFT treaty (US citizens)', value: 'Self-employment visa from €4,500', details: 'US citizens benefit from the Dutch-American Friendship Treaty (DAFT), allowing them to start a business in the Netherlands with only €4,500 investment. This provides a residence permit but is not property-specific.', severity: 'favorable' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Very low', details: 'The Dutch speak excellent English. Most real estate agents, notaries, and lawyers can work in English. However, lease contracts and official documents are in Dutch.', severity: 'favorable' },
          { label: 'Property management', value: 'Well-established', details: 'Professional property management (vastgoedbeheer) is widely available. Expect 5–8% of rental income. Many firms offer full-service including tenant placement, rent collection, and maintenance coordination.', severity: 'favorable' },
          { label: 'Market competitiveness', value: 'Extremely competitive in major cities', details: 'Amsterdam, Utrecht, and other Randstad cities are very competitive. Overbidding of 5–15% above asking price is common. Cash buyers have an advantage. Market has cooled slightly but remains tight.', severity: 'restrictive' },
          { label: 'Anti-speculation measures', value: 'Opkoopbescherming in many cities', details: 'Many municipalities have introduced opkoopbescherming (purchase protection), requiring buyers to live in properties below a certain value rather than renting them out. This can significantly restrict buy-to-let opportunities.', severity: 'restrictive' }
        ]
      }
    ]
  },
  {
    countryId: 'belgium',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Belgian lawyer (advocaat/avocat) or notary (notaris/notaire) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, no restrictions', details: 'No restrictions on any nationality purchasing property in Belgium. The process is identical for Belgian citizens and foreign buyers.', severity: 'favorable' },
          { label: 'Registration duty (registratierechten)', value: '12% Flanders / 12.5% Brussels & Wallonia', details: 'Flanders: 12% (reduced to 3% for sole primary residence up to €220,000). Brussels: 12.5% (abattement of €200,000 for primary residence). Wallonia: 12.5% (reduced rates for modest homes). Significant upfront cost.', severity: 'restrictive' },
          { label: 'Notary fees', value: '~1–1.5% of purchase price', details: 'Notary (notaris/notaire) is mandatory. Fees are regulated and degressive based on property value, typically 1–1.5%. Additional costs include mortgage registration fees if financing.', severity: 'neutral' },
          { label: 'Purchase process', value: 'Well-structured, 4 months typical', details: 'After signing the compromis de vente (preliminary agreement), the notary has up to 4 months to prepare the authentic deed (acte authentique). 10% deposit paid at signing.', severity: 'neutral' },
          { label: 'Buyer\'s investigation duty', value: 'Caveat emptor applies broadly', details: 'Belgium follows a caveat emptor principle. Buyers should conduct thorough due diligence. Soil certificate (bodemattest) is mandatory in Flanders. Asbestos certificate required for buildings before 2001 in Flanders.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Lease duration', value: 'Standard 9-year leases', details: 'The standard residential lease in Belgium is 9 years. Short-term leases (≤3 years) are possible but with specific rules. Tenants can terminate at any time with 3 months notice. Landlord termination is restricted.', severity: 'neutral' },
          { label: 'Rent control', value: 'No strict rent control', details: 'Belgium has no formal rent control. Rents are freely negotiated for new leases. During a 9-year lease, rent can only be adjusted annually by the health index (indexation) or by agreement at the 3-year triennium.', severity: 'favorable' },
          { label: 'Tenant protections', value: 'Moderate', details: 'Tenants are reasonably well protected. Eviction for non-payment requires court proceedings. Landlord can terminate for own use or major works at the end of each 3-year period with 6 months notice.', severity: 'neutral' },
          { label: 'Short-term rentals', value: 'Regulated by region', details: 'Brussels, Flanders, and Wallonia each have their own rules for tourist accommodation. Brussels requires registration and fire safety certification. Flanders requires a tourism permit (toeristisch logies).', severity: 'neutral' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: 'Based on cadastral income, not actual rent', details: 'Belgium taxes rental income based on the revenu cadastral (RC) / kadastraal inkomen (KI) – a notional value – not actual rent received. The indexed RC is added to your income and taxed at progressive rates (25–50%). This often results in lower tax than actual income would.', severity: 'favorable' },
          { label: 'Cadastral income (revenu cadastral)', value: 'Outdated notional value, often low', details: 'The cadastral income was last broadly reassessed in 1975 and is indexed annually. It is typically far below actual market rent, making the effective tax burden relatively modest compared to actual rental income.', severity: 'favorable' },
          { label: 'Capital gains tax', value: 'Exempt after 5 years (generally)', details: 'Capital gains on property held over 5 years are generally tax-free for individuals. Within 5 years: 16.5% tax on gains. Land sold within 8 years: 33%. These exemptions make long-term holding very attractive.', severity: 'favorable' },
          { label: 'Property tax (précompte immobilier)', value: '~1.5–3% of cadastral income equivalent', details: 'Annual property tax based on cadastral income, multiplied by municipal and provincial coefficients. Effective rate typically 20–50% of the indexed cadastral income, which translates to a modest absolute amount.', severity: 'neutral' },
          { label: 'Wealth tax', value: 'No wealth tax', details: 'Belgium does not have a formal wealth tax or annual property value tax. The low cadastral-income-based system is relatively favorable for property investors.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Register at the local commune/gemeente within 8 days of arrival. Obtain a registration certificate for stays over 3 months.', severity: 'favorable' },
          { label: 'No Golden Visa', value: 'No investment-based residence permit', details: 'Belgium does not offer a Golden Visa or property investment visa. Non-EU citizens must apply through standard channels: work permit, business visa, or family reunification.', severity: 'neutral' },
          { label: 'Non-EU property ownership', value: 'No additional restrictions', details: 'Non-EU citizens can buy property freely but owning property does not grant any residency rights. Separate visa/permit application required.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language complexity', value: 'Three official languages', details: 'Belgium has Dutch (Flanders), French (Wallonia), and German-speaking regions. Brussels is bilingual (French/Dutch). Legal documents are in the language of the region. English is widely understood but not used officially.', severity: 'neutral' },
          { label: 'Property management', value: 'Available but varies by region', details: 'Property management services (syndicus for co-owned buildings, rentmeester for rental management) are available. Expect 5–8% of rental income for management. Brussels has the most developed market.', severity: 'neutral' },
          { label: 'Market liquidity', value: 'Moderate to good', details: 'Brussels, Antwerp, and Ghent have good liquidity. Average sale time: 3–6 months. Wallonia and rural Flanders are slower. Belgian property prices are considered moderate compared to neighboring countries.', severity: 'neutral' },
          { label: 'Energy performance (EPC/PEB)', value: 'Increasingly important', details: 'Energy performance certificates are mandatory. Flanders requires renovation to minimum EPC label D by 2033 (C by 2040) for all homes. Wallonia and Brussels have similar requirements. Budget for energy upgrades.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'austria',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Austrian lawyer (Rechtsanwalt) or notary (Notar) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Varies by Bundesland', details: 'Each of Austria\'s 9 federal states (Bundesländer) has its own property transfer regulations. Most require approval from the local land transfer commission (Grundverkehrsbehörde). EU citizens generally receive approval but must demonstrate use (residence or investment). Process can add 2–4 months.', severity: 'neutral' },
          { label: 'Transfer tax (Grunderwerbsteuer)', value: '3.5% of purchase price', details: 'A flat 3.5% real estate transfer tax applies to all property purchases. For transfers between family members, the tax is calculated on a lower basis (3-fold assessed value).', severity: 'neutral' },
          { label: 'Land register fee (Grundbucheintragung)', value: '1.1% of purchase price', details: 'A 1.1% fee for entry into the Grundbuch (land register). If a mortgage is registered, an additional 1.2% of the mortgage amount is charged.', severity: 'neutral' },
          { label: 'Non-EU buyer restrictions', value: 'Significant in many states', details: 'Non-EU/EEA buyers face strict restrictions in most Bundesländer, particularly Tyrol, Salzburg, and Vorarlberg. Approval may be denied or require proof of specific need. Some states ban foreign agricultural land purchases.', severity: 'restrictive' },
          { label: 'Notary/lawyer requirement', value: 'Required for authentication', details: 'Either a notary or lawyer must authenticate the purchase contract and handle registration. A Treuhänder (trustee, usually a lawyer or notary) manages the escrow process. Costs: 1–3% of purchase price.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Rent control (Mietrechtsgesetz)', value: 'Applies to older buildings', details: 'The Mietrechtsgesetz (MRG) applies fully to buildings built before 1945 (and partially to those before 1953). Maximum rents are set by the Richtwert system for each Bundesland. Newer buildings and single-family homes are largely unregulated.', severity: 'neutral' },
          { label: 'Tenant protections', value: 'Strong for MRG-covered properties', details: 'MRG-covered tenants have strong protections: limited eviction grounds, right to sublease, maintenance obligations on landlord. Non-MRG properties have more flexibility but tenants still have basic protections under ABGB.', severity: 'restrictive' },
          { label: 'Short-term rentals', value: 'Regulated in Vienna', details: 'Vienna requires a change of use permit (Widmungsänderung) for short-term tourist rentals. Other cities are less restrictive but regulations are evolving. Check local zoning rules before purchasing for Airbnb use.', severity: 'neutral' },
          { label: 'Rental yield potential', value: 'Moderate, stable market', details: 'Gross yields of 3–4% in Vienna, 4–6% in Graz, Linz, and Salzburg. Austria offers very stable, low-volatility returns. Rent increases tied to inflation indices.', severity: 'neutral' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: 'Progressive up to 55%', details: 'Rental income is taxed at progressive rates: 0% up to €12,816, then 20%–55% for income above €1M. Extensive deductions available: depreciation (1.5% of building value), interest, maintenance, management, insurance.', severity: 'restrictive' },
          { label: 'Capital gains tax (ImmoESt)', value: '30% flat rate', details: 'Immobilienertragsteuer (ImmoESt) is a flat 30% on capital gains from property sales. For properties acquired before March 31, 2002: 4.2% of the sale price (simplified calculation). Inflation adjustment not available.', severity: 'neutral' },
          { label: 'VAT on new properties', value: '20% VAT (optional for commercial)', details: 'New residential properties are subject to 20% VAT (usually included in the price). Landlords can opt to charge VAT on commercial rentals to reclaim input VAT. Residential rent is generally VAT-exempt.', severity: 'neutral' },
          { label: 'Property tax', value: 'Very low (~0.1% effective)', details: 'Grundsteuer (property tax) is based on the Einheitswert (assessed value), which is far below market value. Effective rate is typically only 0.05–0.2% of market value. Reform has been discussed for years.', severity: 'favorable' },
          { label: 'Double taxation treaties', value: 'Extensive network', details: 'Austria has comprehensive double taxation treaties with most EU countries and many global partners. Rental income is typically taxed in Austria with credit given in the home country.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Must register (Meldezettel) at the local registration office (Meldeamt) within 3 days of moving. Certificate of registration (Anmeldebescheinigung) required for stays over 3 months.', severity: 'favorable' },
          { label: 'No Golden Visa', value: 'No investment-based residence permit', details: 'Austria does not offer a Golden Visa. Non-EU citizens must apply through standard routes: Red-White-Red Card (skilled workers), family reunification, or student visa.', severity: 'neutral' },
          { label: 'Non-EU property and residency', value: 'Property ownership does not grant residency', details: 'Purchasing property in Austria does not give non-EU citizens any right to residency. Separate residence permit required. Some states may view property ownership favorably in permit applications.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Moderate', details: 'German is the official language. All legal documents and contracts are in German. English proficiency is good in Vienna and among professionals, but less common in rural areas. A bilingual lawyer is essential.', severity: 'neutral' },
          { label: 'Property management', value: 'Well-established', details: 'Hausverwaltung (property management) is a well-established profession. Regulated by the Maklergesetz. Expect 3–6% of rental income for management. WEG (co-ownership) managers handle common areas.', severity: 'favorable' },
          { label: 'Market liquidity', value: 'Good in Vienna, moderate elsewhere', details: 'Vienna has excellent liquidity with average sale times of 2–4 months. Salzburg and Innsbruck are also active. Smaller cities and rural areas are slower. Austrian market is known for stability.', severity: 'neutral' },
          { label: 'Alpine property restrictions', value: 'Second home quotas in tourist areas', details: 'Tyrol, Salzburg, and Vorarlberg have strict limits on Freizeitwohnsitze (holiday homes). Municipalities may cap the number of holiday homes. Can significantly limit investment options in ski resort areas.', severity: 'restrictive' }
        ]
      }
    ]
  },
  {
    countryId: 'ireland',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Irish solicitor before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, no restrictions', details: 'No restrictions on any nationality purchasing property in Ireland. The process is identical for Irish citizens and foreign buyers.', severity: 'favorable' },
          { label: 'Stamp duty', value: '1% (up to €1M), 2% on balance', details: 'Residential stamp duty: 1% on the first €1,000,000, 2% on the balance above €1M. Non-residential: 7.5%. A 10% stamp duty applies to bulk purchases (10+ residential units) by certain investors.', severity: 'favorable' },
          { label: 'Solicitor requirement', value: 'Essential (but not legally mandatory)', details: 'While technically not mandatory, it is virtually universal to use a solicitor. They handle title searches, contracts, and closing. Typical fees: €2,000–4,000 plus VAT. Conveyancing process takes 6–12 weeks.', severity: 'neutral' },
          { label: 'Property Registration Authority', value: 'Definitive land register', details: 'Ireland has a comprehensive land registration system. Most properties are registered with the Property Registration Authority. Registration fees apply (~€800 for transfers). Some older properties may still be on older Registry of Deeds.', severity: 'neutral' },
          { label: 'BER certificate', value: 'Mandatory for all sales', details: 'A Building Energy Rating (BER) certificate is required for all property sales and rentals. Ratings from A1 (best) to G (worst). Must be obtained before advertising the property.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Rent Pressure Zones (RPZ)', value: 'Rent increases capped at 2%/year', details: 'In designated Rent Pressure Zones (most of Dublin, Cork, Galway, and other urban areas), annual rent increases are capped at the lower of 2% or the HICP inflation rate. This significantly limits landlord flexibility.', severity: 'restrictive' },
          { label: 'Tenant protections', value: 'Strong and increasing', details: 'Part 4 tenancy rights apply after 6 months, giving tenants security of tenure for up to 6 years. Landlords can only terminate for specific reasons (sale, renovation, own use). Lengthy notice periods required.', severity: 'restrictive' },
          { label: 'RTB registration', value: 'All tenancies must be registered', details: 'All residential tenancies must be registered with the Residential Tenancies Board (RTB). Annual registration fee of €40 per tenancy. Non-registration is an offence.', severity: 'neutral' },
          { label: 'Rental demand', value: 'Extremely strong, especially Dublin', details: 'Ireland has a severe housing shortage. Vacancy rates in Dublin are among the lowest in Europe (<1%). Strong rental demand creates reliable income but also political pressure for more regulation.', severity: 'favorable' },
          { label: 'Short-term rentals', value: 'Restricted in RPZs', details: 'In Rent Pressure Zones, short-term letting (Airbnb-style) of entire homes requires planning permission if exceeding 90 days/year. Room rental within your home is less restricted.', severity: 'restrictive' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: 'Up to 52% marginal rate', details: 'Rental income is taxed at marginal income tax rates: 20% (up to €42,000) and 40% above that, plus USC (Universal Social Charge, 2–8%) and PRSI (4%). Effective marginal rate can reach 52%. Non-residents pay 20% standard rate.', severity: 'restrictive' },
          { label: 'Deductible expenses', value: '75% of mortgage interest + other expenses', details: 'Deductible expenses include: 100% of mortgage interest (recently restored from 75%), repairs, insurance, management fees, accountancy fees, letting agent fees. Capital allowances on furniture at 12.5% over 8 years.', severity: 'neutral' },
          { label: 'Capital gains tax (CGT)', value: '33% on gains', details: 'Capital gains are taxed at a flat 33%. Annual exemption of €1,270 per person. Principal private residence relief provides full exemption. No taper relief or inflation indexation.', severity: 'restrictive' },
          { label: 'Local Property Tax (LPT)', value: '~0.1% of property value', details: 'Annual Local Property Tax based on property value bands. Base rate 0.1029% for properties up to €1.05M, with higher rates above. Self-assessed. Revenue is collected by local authorities.', severity: 'favorable' },
          { label: 'REIT structure', value: 'Available for larger investors', details: 'Ireland has a REIT (Real Estate Investment Trust) regime since 2013. REITs are exempt from corporation tax on qualifying rental income and gains. Must distribute 85% of income. Minimum listing requirement.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement under EU law. No registration requirement for EU citizens (Ireland does not have a registration system). PPS number needed for tax purposes.', severity: 'favorable' },
          { label: 'Immigrant Investor Programme', value: 'Closed to new applications (2023)', details: 'Ireland\'s Immigrant Investor Programme (IIP), which offered residency for €1M+ investments, was closed to new applications in February 2023 due to concerns about integrity. No replacement announced.', severity: 'restrictive' },
          { label: 'Stamp 4 permission', value: 'Standard non-EU residency route', details: 'Non-EU citizens with Stamp 4 permission can live and work freely in Ireland. Obtained through employment, business, or long-term residence. Property ownership alone does not grant residency.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'None', details: 'English is the primary language for all legal and business transactions. Irish (Gaeilge) is co-official but English is used for all property and legal matters.', severity: 'favorable' },
          { label: 'Property management', value: 'Well-established', details: 'Property management agents are widely available, especially in Dublin. Expect 7–12% of rental income for full management. IPOA (Irish Property Owners\' Association) provides landlord resources.', severity: 'favorable' },
          { label: 'Housing supply shortage', value: 'Structural undersupply', details: 'Ireland has a significant housing supply deficit. Annual completions (~30,000) are well below estimated demand (~50,000). This supports property values and rents but creates political risk of further regulation.', severity: 'neutral' },
          { label: 'Insurance costs', value: 'Can be high', details: 'Property insurance (especially for older buildings and flood-prone areas) can be expensive. Landlord insurance is essential but costs vary widely. Shop around for competitive quotes.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'poland',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Polish lawyer (radca prawny or adwokat) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, apartments and houses freely', details: 'EU/EEA citizens can buy apartments and residential property without restrictions. Agricultural and forest land (over 0.3 ha) requires a permit from the Ministry of Interior or Agricultural Property Agency. This restriction applies for 5 years after EU accession exceptions ended.', severity: 'favorable' },
          { label: 'Transfer tax (PCC)', value: '2% on secondary market purchases', details: 'Podatek od czynności cywilnoprawnych (PCC) of 2% applies to purchases on the secondary market. New builds from developers are subject to 8% or 23% VAT instead (no PCC). PCC paid by buyer.', severity: 'favorable' },
          { label: 'Notary requirement', value: 'Mandatory for all property transfers', details: 'All property transactions must be executed as a notarial deed (akt notarialny). Notary fees are regulated and based on property value, typically 0.5–3% (capped). Notary handles land register (księga wieczysta) application.', severity: 'neutral' },
          { label: 'Land and mortgage register', value: 'Reliable electronic system', details: 'Poland has a modern electronic land register system (księgi wieczyste). Entries provide strong legal protection for registered owners. Always verify the register before purchase.', severity: 'favorable' },
          { label: 'Developer market (from developer)', value: 'Strong consumer protections', details: 'Purchases from developers are protected by the Developer Act (Ustawa deweloperska). Funds held in escrow accounts. Developer must provide a prospectus. Strong buyer protections in case of developer insolvency.', severity: 'favorable' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Tenant protections', value: 'Moderate', details: 'Polish law provides basic tenant protections. Eviction for non-payment requires court proceedings and typically takes 3–6 months. Winter eviction moratorium (November–March) prevents eviction to homelessness.', severity: 'neutral' },
          { label: 'Rent control', value: 'No rent control', details: 'Poland does not have rent control for private market rentals. Rents are freely negotiated. Rent increases in ongoing leases require proper notice (3 months in advance for increases above CPI).', severity: 'favorable' },
          { label: 'Short-term rentals', value: 'Generally unregulated', details: 'Short-term rentals are largely unregulated at the national level. Some municipalities (Kraków, Warsaw) are discussing regulations but nothing comprehensive has been implemented yet. Tourist tax may apply locally.', severity: 'favorable' },
          { label: 'Rental yield potential', value: 'Attractive, growing market', details: 'Gross yields of 5–8% in Warsaw, Kraków, Wrocław, and Gdańsk. Strong rental demand driven by urbanization, growing middle class, and Ukrainian refugee population. One of Europe\'s most dynamic rental markets.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax (ryczałt)', value: '8.5% flat rate (lump-sum)', details: 'Private landlords can opt for ryczałt (lump-sum) taxation at 8.5% on gross rental income (up to PLN 100,000/year, 12.5% above). No deductions allowed under this regime. Alternative: progressive rates 12–32%.', severity: 'favorable' },
          { label: 'Capital gains tax', value: '19% flat rate', details: 'Capital gains on property sales within 5 years of purchase are taxed at 19% flat rate. Exempt after 5 years of ownership. Also exempt if proceeds are reinvested in own residential property within 3 years.', severity: 'neutral' },
          { label: 'Property tax', value: 'Very low (PLN per sqm basis)', details: 'Annual property tax (podatek od nieruchomości) is charged per square meter, set by each municipality. Typical residential rate: PLN 1.15/sqm (~€0.26/sqm). Extremely low compared to Western Europe.', severity: 'favorable' },
          { label: 'Double taxation treaties', value: 'Extensive network', details: 'Poland has double taxation treaties with most EU countries and many global partners. Treaties generally allocate property income taxation to Poland, with credit in the home country.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Register at the local voivodeship office for stays over 3 months. PESEL number (national ID number) recommended for administrative convenience.', severity: 'favorable' },
          { label: 'No Golden Visa', value: 'No investment-based residence permit', details: 'Poland does not offer a Golden Visa. Non-EU citizens can apply for temporary residence permits based on work, business activity, or family ties. Property ownership alone does not grant residency.', severity: 'neutral' },
          { label: 'Business residence permit', value: 'Available for business owners', details: 'Non-EU citizens running a registered business in Poland can apply for a temporary residence permit. Must demonstrate business viability and sufficient income. Renewable.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Moderate to significant', details: 'Polish is the official language. All legal documents and contracts are in Polish. English is increasingly common among younger professionals and in major cities, but a Polish-speaking lawyer is essential.', severity: 'neutral' },
          { label: 'Property management', value: 'Growing industry', details: 'Property management services are developing rapidly, especially in Warsaw, Kraków, and Wrocław. Short-term rental management widely available. Expect 10–20% of rental income. Self-management is common.', severity: 'neutral' },
          { label: 'Market growth', value: 'Strong long-term fundamentals', details: 'Poland is the EU\'s 5th-largest economy with strong GDP growth. Urbanization, rising incomes, and EU structural funds support long-term property appreciation. Prices have risen significantly since EU accession (2004).', severity: 'favorable' },
          { label: 'Currency risk', value: 'Polish złoty (PLN), not euro', details: 'Poland uses the złoty (PLN), not the euro. This creates currency risk for eurozone investors. PLN has generally been stable but can fluctuate. Consider hedging for larger investments.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'czech-republic',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Czech lawyer (advokát) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, no restrictions', details: 'EU/EEA citizens can purchase any type of property in the Czech Republic without restrictions, including agricultural land. The process is identical to Czech citizens.', severity: 'favorable' },
          { label: 'Transfer tax', value: 'Abolished (since 2020)', details: 'The Czech Republic abolished its 4% real estate acquisition tax (daň z nabytí nemovitých věcí) in September 2020. This significantly reduced purchase costs and made the market more investor-friendly.', severity: 'favorable' },
          { label: 'Notary/lawyer requirement', value: 'Not mandatory but recommended', details: 'No legal requirement to use a notary or lawyer, but strongly recommended. Lawyers typically handle contract drafting, due diligence, and escrow. Costs: CZK 15,000–50,000 (€600–2,000).', severity: 'neutral' },
          { label: 'Land registry (katastr nemovitostí)', value: 'Reliable and publicly accessible', details: 'The Czech cadastral office maintains a comprehensive land register. Entries are publicly accessible online (nahlizení do katastru). Registration takes 20–30 days. The registry provides strong legal certainty.', severity: 'favorable' },
          { label: 'Reservation fee', value: 'Common practice, usually non-refundable', details: 'Sellers/agents often require a reservation fee (rezervační poplatek) of CZK 50,000–200,000 to take the property off market. Ensure conditions for refund are clearly stated in the reservation agreement.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Tenant protections', value: 'Moderate', details: 'Czech tenants have reasonable protections under the Civil Code. Indefinite leases require 3-month notice from landlord with statutory reasons. Fixed-term leases can be terminated at expiry. Eviction for non-payment requires court proceedings.', severity: 'neutral' },
          { label: 'Rent control', value: 'No rent control (deregulated since 2012)', details: 'Czech Republic fully deregulated rents in 2012. Rents are freely negotiated for all new leases. During ongoing leases, rent increases require tenant agreement or court determination of "usual rent" in the area.', severity: 'favorable' },
          { label: 'Short-term rentals', value: 'Regulation increasing in Prague', details: 'Prague has been tightening rules on short-term rentals due to housing pressure. Municipal bylaws may restrict Airbnb-style rentals. Check local rules before buying. Other cities are less restrictive.', severity: 'neutral' },
          { label: 'Rental yield potential', value: 'Strong in Prague and Brno', details: 'Gross yields of 4–6% in Prague, 5–7% in Brno and other university cities. Strong demand from students, young professionals, and expats. Market has matured significantly since EU accession.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '15% flat rate', details: 'Individual rental income is taxed at a flat 15% rate (23% for income exceeding 36x the average salary, ~CZK 1.9M). Deductible expenses include depreciation, repairs, insurance, and management costs. Lump-sum 30% expense deduction available.', severity: 'favorable' },
          { label: 'Capital gains tax', value: 'Exempt after 5 years (10 years for non-residents)', details: 'Capital gains on property sold after 5 years of ownership (and 2 years of residence for primary homes) are tax-exempt. For non-residents, the exemption period is 10 years. Gains within these periods taxed at 15%.', severity: 'favorable' },
          { label: 'Property tax (daň z nemovitých věcí)', value: 'Very low', details: 'Annual property tax is extremely low, often just CZK 1,000–5,000 (€40–200) for an apartment. Based on floor area and municipal coefficients, not market value. One of the lowest in Europe.', severity: 'favorable' },
          { label: 'Double taxation treaties', value: 'Comprehensive network', details: 'Czech Republic has 90+ double taxation treaties. Property income is generally taxed in the Czech Republic with credit in the home country.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Must register at the Foreign Police for stays over 30 days and at the local municipality for stays over 3 months.', severity: 'favorable' },
          { label: 'No Golden Visa', value: 'No investment-based residence permit', details: 'Czech Republic does not offer a Golden Visa. Non-EU citizens must apply through standard channels: employee card, business visa, or family reunification.', severity: 'neutral' },
          { label: 'Business visa (živnostenský list)', value: 'Accessible for entrepreneurs', details: 'Non-EU citizens can obtain a trade license (živnostenský list) and apply for a long-term business visa. Property investment activity alone may qualify. Process takes 2–4 months.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Moderate', details: 'Czech is the official language. All contracts and legal documents are in Czech. English is widely spoken in Prague and among younger professionals. A Czech-speaking lawyer is essential.', severity: 'neutral' },
          { label: 'Property management', value: 'Developing rapidly', details: 'Property management services are well-established in Prague and growing in Brno. Short-term rental management widely available. Expect 10–20% of rental income. SVJ (owners\' associations) manage common areas.', severity: 'neutral' },
          { label: 'Market maturity', value: 'Developed and transparent', details: 'The Czech property market is the most developed in Central Europe. Transparent pricing, reliable legal framework, and established financing options. Prices in Prague rival some Western European cities.', severity: 'favorable' },
          { label: 'Currency risk', value: 'Czech koruna (CZK), not euro', details: 'Czech Republic uses the koruna (CZK). CNB (Czech National Bank) maintains a stable monetary policy. CZK has generally appreciated against EUR over the past decade, benefiting foreign investors.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'hungary',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Hungarian lawyer (ügyvéd) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, with minor exceptions', details: 'EU/EEA citizens can purchase residential and commercial property freely. Agricultural and forestland purchases require special permission and are generally restricted to registered farmers.', severity: 'favorable' },
          { label: 'Transfer tax (illetékfizetés)', value: '4% up to HUF 1 billion', details: 'Property transfer tax (vagyonszerzési illeték) is 4% of the market value up to HUF 1 billion (~€2.5M), and 2% on the portion above. First-time buyers under 35 purchasing property under HUF 15M may qualify for exemptions.', severity: 'neutral' },
          { label: 'Lawyer requirement', value: 'Mandatory for property transfers', details: 'A Hungarian lawyer (ügyvéd) must countersign all property purchase contracts. The lawyer handles the land registry application. Fees: typically 0.5–1.5% of purchase price (minimum HUF 50,000).', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Tenant protections', value: 'Relatively weak', details: 'Hungarian tenant protections are less extensive than Western Europe. Leases can be terminated by landlord with proper notice (typically 30–90 days). Non-payment eviction through courts can still take several months.', severity: 'favorable' },
          { label: 'Short-term rentals', value: 'Registration required', details: 'Short-term rental properties must be registered with the local municipality and obtain a registration number. Budapest districts may have additional requirements. A tourist tax applies per guest night.', severity: 'neutral' },
          { label: 'Rental yield potential', value: 'Attractive, affordable entry point', details: 'Gross yields of 5–8% in Budapest. Very affordable entry prices compared to Western Europe. Strong demand from students, expats, and tourists. Districts V, VI, VII, and VIII in Budapest are popular for investment.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '15% personal income tax + local tax', details: 'Rental income is subject to 15% personal income tax (SZJA). Some municipalities levy a local business tax (helyi iparűzési adó) of up to 2%. Net income calculated after deducting documented expenses (or 10% flat cost deduction).', severity: 'neutral' },
          { label: 'Capital gains tax', value: '15% with 5-year taper', details: 'Capital gains on property taxed at 15% SZJA. Gain is reduced by 10% for each year of ownership after the 5th year, resulting in full exemption after 15 years.', severity: 'neutral' },
          { label: 'Property tax', value: 'Varies by municipality, generally low', details: 'Annual property tax (building tax / telekadó) rates set by each municipality. Budapest districts typically charge HUF 1,000–1,800/sqm. Some municipalities outside Budapest do not levy property tax at all.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Must register at the regional immigration office for stays over 90 days and obtain a registration certificate (regisztrációs igazolás).', severity: 'favorable' },
          { label: 'Guest investor program', value: 'Investment residence bond program (reformed)', details: 'Hungary has offered various investor residency schemes. Current options include investment-based residence permits. Requirements and availability change frequently – verify current rules with immigration lawyers.', severity: 'neutral' },
          { label: 'Non-EU property ownership', value: 'Possible with government permission', details: 'Non-EU citizens can buy property with government office permission. Ownership does not automatically grant residency rights. Separate residence permit application required.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Significant', details: 'Hungarian is one of Europe\'s most difficult languages. All legal documents are in Hungarian. English is improving among younger professionals in Budapest but limited elsewhere. A bilingual lawyer is essential.', severity: 'restrictive' },
          { label: 'Affordability', value: 'Among the most affordable EU capitals', details: 'Budapest remains significantly cheaper than Western European capitals. Average apartment prices: €2,000–4,000/sqm in central Budapest. Excellent value for money, though prices have risen sharply since 2015.', severity: 'favorable' },
          { label: 'Currency risk', value: 'Hungarian forint (HUF), not euro', details: 'Hungary uses the forint (HUF), which can be volatile. The HUF has depreciated significantly against EUR in recent years. This creates risk but also means cheaper entry for euro-based investors.', severity: 'restrictive' }
        ]
      }
    ]
  },
  {
    countryId: 'romania',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Romanian lawyer (avocat) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens – apartments', value: 'Can buy freely', details: 'EU/EEA citizens can purchase apartments, houses, and commercial property freely, on the same terms as Romanian citizens. No restrictions on urban property.', severity: 'favorable' },
          { label: 'Transfer costs', value: 'Low (~0.5–2% total)', details: 'No transfer tax per se. Costs include: notary fees (0.5–1.5% on a sliding scale), land registry fee (~0.15%), and authentication tax. Total transaction costs are among the lowest in Europe.', severity: 'favorable' },
          { label: 'Notary requirement', value: 'Mandatory for property transfers', details: 'All property sales must be authenticated by a Romanian notary public. The notary verifies the property, collects taxes, and submits the land registry application. Process is straightforward.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Tenant protections', value: 'Relatively weak, no rent control', details: 'Romanian law provides basic tenant protections, less extensive than Western Europe. No rent control; rents are freely set by the market. Eviction for non-payment typically takes 3–6 months.', severity: 'favorable' },
          { label: 'Short-term rentals', value: 'Lightly regulated', details: 'Short-term rentals require classification from the Ministry of Tourism. Must register and obtain a tourism certificate. Process is bureaucratic but generally achievable. No day limits currently imposed.', severity: 'neutral' },
          { label: 'Rental yield potential', value: 'Strong in Bucharest and tech cities', details: 'Gross yields of 6–9% in Bucharest, Cluj-Napoca, Timișoara, and Iași. Growing tech sector and returning diaspora drive demand. Affordable entry prices with strong rental demand.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '10% flat rate', details: 'Net rental income is taxed at a flat 10% rate. Deductible expense of 20% is automatically applied. Health insurance (CASS 10%) may apply above a threshold, raising effective burden.', severity: 'favorable' },
          { label: 'Capital gains tax', value: '10% on gains (with deductions)', details: 'Capital gains from property sales are taxed at 10%. A notional deduction is available based on holding period. Properties held over 3 years benefit from additional deductions.', severity: 'neutral' },
          { label: 'Property tax', value: 'Very low', details: 'Annual property tax (impozit pe clădiri) ranges from 0.08–0.2% of the taxable value for residential properties. Taxable values are set by local authorities and are typically below market value.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Must register at the local Immigration Inspectorate for stays over 3 months and obtain a registration certificate.', severity: 'favorable' },
          { label: 'No Golden Visa', value: 'No formal investment visa program', details: 'Romania does not offer a Golden Visa. Non-EU citizens can apply for residence permits through employment, family reunification, or business activity.', severity: 'neutral' },
          { label: 'Business residence permit', value: 'Available for company owners', details: 'Non-EU citizens who own and operate a Romanian company (SRL) can apply for a business residence permit. Minimum investment requirements and job creation may apply.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Moderate', details: 'Romanian is the official language (a Romance language). Younger professionals and the tech sector often speak excellent English. Legal documents are in Romanian. Bilingual lawyers available in major cities.', severity: 'neutral' },
          { label: 'Growth potential', value: 'Strong economic fundamentals', details: 'Romania has one of the EU\'s fastest-growing economies. Rising incomes, growing tech sector (especially Cluj-Napoca), and EU infrastructure investment support long-term property appreciation.', severity: 'favorable' },
          { label: 'Currency risk', value: 'Romanian leu (RON), not euro', details: 'Romania uses the leu (RON). The currency has been relatively stable against the euro (managed float by NBR). Euro adoption target has been repeatedly postponed. Currency risk is moderate.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'croatia',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Croatian lawyer (odvjetnik) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, since EU accession (2013)', details: 'EU/EEA citizens can purchase property in Croatia on equal terms with Croatian citizens since Croatia joined the EU in July 2013. No restrictions on residential, commercial, or agricultural property.', severity: 'favorable' },
          { label: 'Transfer tax', value: '3% of market value', details: 'Real estate transfer tax (porez na promet nekretnina) is 3% of the estimated market value (as assessed by the tax authority, not necessarily the contract price). Paid by the buyer.', severity: 'neutral' },
          { label: 'Notary/lawyer', value: 'Lawyer recommended, notary for signatures', details: 'While a notary (javni bilježnik) authenticates signatures, a lawyer (odvjetnik) should draft and review the purchase contract. Legal fees: typically 1–2% of purchase price.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Short-term tourism rentals', value: 'Very popular, licensed system', details: 'Croatia has a well-established system for tourist rentals (iznajmljivanje turistima). Requires registration with the local tourist board and county. Categories from 2–5 stars. Strong demand along the Adriatic coast.', severity: 'favorable' },
          { label: 'Rental income tax (paušal)', value: '10% flat tax (lump-sum for tourism)', details: 'Private landlords renting to tourists can opt for the paušalni porez (lump-sum tax) based on bed count and location, often resulting in very favorable effective rates. Alternative: flat 10% on actual income.', severity: 'favorable' },
          { label: 'Tourism demand', value: 'Very strong along Adriatic coast', details: 'Croatia\'s Adriatic coast (Dubrovnik, Split, Hvar, Zadar, Istria) has booming tourism demand. Occupancy rates of 70–90% during summer season. Year-round rental viable in Split and Dubrovnik.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '10% flat rate', details: 'Rental income is taxed at a flat 10% rate on net income (after deductions) or via the lump-sum system for tourist rentals. Croatia adopted the euro in January 2023, eliminating currency risk for eurozone investors.', severity: 'favorable' },
          { label: 'Capital gains tax', value: '10% if sold within 2 years', details: 'Capital gains tax of 10% applies only if the property is sold within 2 years of purchase. Exempt after 2 years. This is one of the shortest holding periods for tax-free gains in Europe.', severity: 'favorable' },
          { label: 'Property tax', value: 'Tourist levy, no annual property tax', details: 'Croatia does not currently have an annual property tax. Owners in tourist areas pay a holiday home tax (paušalni porez na kuće za odmor) of €0.60–5/sqm per year, set by the municipality.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Must register temporary stay at the local police station within 8 days. For stays over 3 months, apply for a registration certificate.', severity: 'favorable' },
          { label: 'Digital Nomad Visa', value: 'Available for remote workers', details: 'Croatia offers a Digital Nomad Visa for non-EU remote workers earning at least €2,540/month from foreign sources. Valid for 1 year. No Croatian income tax on foreign employment income during this period.', severity: 'favorable' },
          { label: 'Non-EU property and residency', value: 'Reciprocity principle applies', details: 'Non-EU citizens from countries with reciprocity agreements can purchase property. Owning property can support a temporary residence application but does not automatically grant residency.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Moderate', details: 'Croatian is the official language. English is widely spoken in tourist areas and by younger generations. Legal documents are in Croatian. Bilingual lawyers are available in coastal cities.', severity: 'neutral' },
          { label: 'Legalization issues', value: 'Check building permits carefully', details: 'Many Croatian properties, especially on the coast, were built or extended without proper permits. Legalization processes (ozakonjenje) exist but can be slow. Always verify building permits and usage permits before buying.', severity: 'restrictive' },
          { label: 'Seasonality', value: 'Strong summer, quiet winter', details: 'Coastal tourism is highly seasonal (June–September). Winter occupancy can be very low outside major cities. Split and Dubrovnik have the longest seasons. Consider year-round appeal when investing.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'denmark',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Danish lawyer (advokat) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'Residency requirement', value: 'Must have lived in Denmark 5 years', details: 'Non-residents (including EU citizens) generally cannot purchase property in Denmark without having lived in the country for at least 5 years. The Ministry of Justice can grant exemptions for year-round residences but not holiday homes. This is one of Europe\'s strictest rules.', severity: 'restrictive' },
          { label: 'Transfer tax (tinglysningsafgift)', value: '0.6% + DKK 1,850 fixed fee', details: 'The registration fee (tinglysningsafgift) is 0.6% of the property value plus a fixed fee of DKK 1,850 (~€250). For mortgages, an additional 1.45% + DKK 1,850 applies. Relatively low transfer costs.', severity: 'favorable' },
          { label: 'Andelsbolig (cooperative housing)', value: 'Common alternative to ownership', details: 'Cooperative housing (andelsbolig) is very common in Copenhagen. You buy a share in the cooperative, not the property itself. Different rules apply, including maximum prices set by the cooperative. Not true property ownership.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Rent regulation', value: 'Strictly regulated in older buildings', details: 'Properties built before 1992 in regulated municipalities (most cities) are subject to cost-based rent ceilings (omkostningsbestemt leje). Rents based on operating costs + return on investment. Newer properties and single-family homes are less regulated.', severity: 'restrictive' },
          { label: 'Tenant protections', value: 'Very strong', details: 'Danish tenants have extensive protections. Landlord can only terminate for very specific reasons (own use, major renovation, demolition). Notice periods: 3 months (rooms) to 12 months (apartments). Eviction for non-payment requires court proceedings.', severity: 'restrictive' },
          { label: 'Short-term rentals', value: 'Limited to 70 days/year', details: 'Homeowners can rent their property on platforms like Airbnb for up to 70 days per year (increased from 30 for properties in certain reporting schemes). Higher limits possible with municipal approval.', severity: 'restrictive' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: 'Up to 52.07% marginal rate', details: 'Rental income is taxed as personal income at progressive rates up to approximately 52.07% (including AM-bidrag of 8%, municipal tax ~25%, and state tax up to ~15%). Deductions available for expenses, interest, and depreciation.', severity: 'restrictive' },
          { label: 'Property taxes', value: '0.51–1.4% value tax + 1.6–3.4% land tax', details: 'Annual property value tax (ejendomsværdiskat): 0.51% up to DKK 9.2M, 1.4% above. Municipal land tax (grundskyld): 1.6–3.4%. Combined annual tax burden is significant.', severity: 'restrictive' },
          { label: 'Capital gains tax', value: 'Taxed as personal income (exempt if owner-occupied)', details: 'Capital gains on investment properties are taxed as personal income (up to ~52%). Owner-occupied properties lived in by the owner are fully exempt (parcelhusreglen). Losses are generally deductible.', severity: 'neutral' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside, but purchase restrictions apply', details: 'EU/EEA citizens have free movement rights but still face the 5-year residency requirement for property purchases. Register with CPR (civil registration) upon arrival. Obtain a CPR number for tax and administrative purposes.', severity: 'neutral' },
          { label: 'No Golden Visa', value: 'No investment-based residence permit', details: 'Denmark does not offer a Golden Visa or property investment visa. Non-EU citizens must apply through standard channels: work permit (positive list, pay limit scheme), study, or family reunification.', severity: 'neutral' },
          { label: 'Establishment card', value: 'For startup founders', details: 'Denmark offers a startup visa (Etableringskortet) for entrepreneurs with innovative business ideas approved by an expert panel. Not directly tied to property investment.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Very low', details: 'Danes speak excellent English. Most real estate agents, lawyers, and officials can work in English. Legal documents are in Danish but translation services are readily available.', severity: 'favorable' },
          { label: 'High cost of living', value: 'Among Europe\'s most expensive', details: 'Denmark has one of Europe\'s highest costs of living. Property prices in Copenhagen are very high (DKK 40,000–80,000/sqm). This limits entry but provides stability and strong institutional demand.', severity: 'restrictive' },
          { label: 'Currency', value: 'Danish krone (DKK), pegged to euro', details: 'Denmark uses the krone, pegged closely to the euro via ERM II. Currency risk is minimal for euro-based investors.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'sweden',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Swedish lawyer (advokat) or real estate agent (fastighetsmäklare) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, no restrictions', details: 'No restrictions on any nationality purchasing property in Sweden. Foreign buyers have the same rights as Swedish citizens. No permit or approval required.', severity: 'favorable' },
          { label: 'Stamp duty (stämpelskatt)', value: '1.5% for individuals, 4.25% for companies', details: 'Stamp duty (lagfartsstämpel) is 1.5% of the purchase price (or assessed value, whichever is higher) for individuals. Legal entities pay 4.25%. Mortgage stamp duty: 2% of the mortgage amount.', severity: 'neutral' },
          { label: 'Bostadsrätt (cooperative housing)', value: 'Very common in cities', details: 'Most apartments in Swedish cities are bostadsrätter (cooperative housing). You buy the right to use an apartment owned by a housing cooperative (bostadsrättsförening). Monthly fee (avgift) covers building costs. Not direct ownership – more similar to a long-term lease.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Rent control (bruksvärdesystemet)', value: 'Extensive – collective bargaining system', details: 'Sweden has a unique rent-setting system where rents for most apartments are collectively negotiated between landlord organizations and tenant unions. Rents are based on "use value" (bruksvärde), not market rates. This keeps rents well below market in popular areas.', severity: 'restrictive' },
          { label: 'Subletting bostadsrätt', value: 'Restricted, requires board approval', details: 'Subletting a bostadsrätt requires the cooperative board\'s approval, typically granted for temporary reasons (work abroad, trial cohabitation). Landlord can charge a premium of up to 10–15% above the cooperative fee + capital cost.', severity: 'restrictive' },
          { label: 'Tenant protections', value: 'Very strong (besittningsskydd)', details: 'Tenants have strong security of tenure (besittningsskydd) for indefinite leases. Landlord can only terminate for serious breach or own use (with compensation). Eviction is difficult and slow.', severity: 'restrictive' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '30% capital income tax', details: 'Rental income from private property is taxed as capital income (inkomst av kapital) at a flat 30%. Deductible expenses include a standard deduction of SEK 40,000/year plus 20% of gross rent, or actual documented expenses.', severity: 'neutral' },
          { label: 'Capital gains tax', value: '22% effective rate (30% on 22/30 of gain)', details: 'Capital gains on property are taxed at 22% effective rate. Calculated as 22/30 of the gain taxed at 30% capital income tax rate. Deferral possible when buying a replacement residence (uppskov), up to SEK 3M.', severity: 'neutral' },
          { label: 'Municipal property fee', value: 'SEK 9,525/year (max) for houses', details: 'Annual municipal property fee (kommunal fastighetsavgift): maximum SEK 9,525/year for houses (or 0.75% of assessed value, whichever is lower). Apartments in bostadsrättsföreningar: SEK 1,668/year max per unit. No wealth tax (abolished 2007).', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Register with the Swedish Tax Agency (Skatteverket) for stays over 1 year to obtain a personnummer (personal identity number), essential for all administrative processes.', severity: 'favorable' },
          { label: 'No Golden Visa', value: 'No investment-based residence permit', details: 'Sweden does not offer a Golden Visa. Non-EU citizens must apply through standard routes: work permit, family reunification, or study. Self-employment residence permits are available but restrictive.', severity: 'neutral' },
          { label: 'Samordningsnummer', value: 'Coordination number for non-residents', details: 'Non-residents who don\'t qualify for a personnummer can obtain a samordningsnummer (coordination number) for tax and property purposes. Required for property purchases and tax filing.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Very low', details: 'Swedes speak excellent English. Most professionals in real estate, law, and banking work comfortably in English. Contracts and official documents are in Swedish but translation is readily available.', severity: 'favorable' },
          { label: 'Market liquidity', value: 'Very high in cities', details: 'Stockholm, Gothenburg, and Malmö have very liquid markets. Bostadsrätter typically sell within 2–4 weeks. Rural and northern areas are much slower.', severity: 'favorable' },
          { label: 'Bidding process', value: 'Open ascending auction', details: 'Sweden has an informal bidding process with no legal framework. Bids are not binding until the contract is signed. This can lead to bidding wars, especially in Stockholm. Final prices may exceed asking by 10–30%.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'norway',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Norwegian lawyer (advokat) or real estate agent (eiendomsmegler) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EEA citizens can buy freely?', value: 'Yes, no restrictions for residential', details: 'EEA citizens can purchase residential property freely. Norway is not an EU member but is part of the EEA. Agricultural properties and certain rural properties may require a concession (konsesjon) depending on size and type.', severity: 'favorable' },
          { label: 'Transfer tax (dokumentavgift)', value: '2.5% of market value', details: 'Documentary stamp duty (dokumentavgift) of 2.5% applies to all real estate transfers. Based on market value. Does not apply to cooperative housing (borettslag) shares, only to directly-owned property (selveier).', severity: 'neutral' },
          { label: 'Borettslag (cooperative housing)', value: 'Very common in cities', details: 'Similar to Swedish bostadsrätt, borettslag cooperatives are very common in Norwegian cities. You buy a share (andel) in the cooperative. No transfer tax applies. Monthly felleskostnader (common costs) cover building expenses and often include the cooperative\'s shared mortgage.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Tenant protections', value: 'Moderate to strong', details: 'Indefinite leases give tenants strong protections. Landlord can terminate with 3 months notice for limited reasons. Fixed-term leases (minimum 3 years, or 1 year if landlord shares the property) end automatically. No formal rent control but rents must not be "unreasonably high."', severity: 'neutral' },
          { label: 'Short-term rentals', value: 'Limited in cooperatives', details: 'For borettslag cooperatives, short-term rental is limited to 30 days per year (increased from original restrictions). Selveier (directly-owned) properties have fewer restrictions but must follow municipal rules.', severity: 'restrictive' },
          { label: 'Rental yield potential', value: 'Low, capital appreciation focus', details: 'Gross yields of 2–4% in Oslo and Bergen. Very high prices limit yield potential. Norway\'s market is driven by capital appreciation. Tromsø and Stavanger may offer slightly better yields.', severity: 'neutral' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: 'Up to 47.4% marginal rate', details: 'Rental income is taxed as ordinary income (alminnelig inntekt) at 22% base rate. If total personal income exceeds NOK 670,000, additional bracket taxes (trinnskatt) apply, bringing the effective marginal rate up to approximately 47.4%.', severity: 'restrictive' },
          { label: 'Capital gains tax', value: '22% (exempt for owner-occupied)', details: 'Capital gains on property are taxed at 22% as ordinary income. Full exemption if the property has been the owner\'s primary residence for at least 12 of the last 24 months. No taper relief or indexation for investment properties.', severity: 'neutral' },
          { label: 'Wealth tax (formuesskatt)', value: '1% municipal + 0.4% state', details: 'Norway levies a wealth tax on net worldwide assets: 1% municipal tax on assets above NOK 1.7M (NOK 3.4M for couples), plus 0.4% state tax above NOK 1.7M. Municipal property tax 0–0.4% also applies.', severity: 'restrictive' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EEA citizens', value: 'Free to reside and purchase', details: 'EEA citizens have free movement rights in Norway (as an EEA member). Must register with the police (UDI registration) for stays over 3 months. Obtain a D-number or national identity number (fødselsnummer) for tax purposes.', severity: 'favorable' },
          { label: 'No Golden Visa', value: 'No investment-based residence permit', details: 'Norway does not offer a Golden Visa. Non-EEA citizens must apply through standard routes: skilled worker permit, family reunification, or education. Property ownership does not grant residency.', severity: 'neutral' },
          { label: 'High income requirements', value: 'For non-EEA work permits', details: 'Skilled worker permits require a concrete job offer with salary and conditions at Norwegian standards. Self-employment permits are very restricted. Norway has strict immigration policies despite being outside the EU.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Very high prices', value: 'Among Europe\'s most expensive', details: 'Norwegian property prices are among Europe\'s highest, especially in Oslo (NOK 70,000–120,000/sqm in central areas). High prices are supported by strong wages, low unemployment, and limited housing supply.', severity: 'restrictive' },
          { label: 'Language barrier', value: 'Very low', details: 'Norwegians speak excellent English. Most professionals in real estate and law work comfortably in English. Official documents are in Norwegian but translation is readily available.', severity: 'favorable' },
          { label: 'Currency risk', value: 'Norwegian krone (NOK)', details: 'Norway uses the Norwegian krone (NOK), not the euro. NOK can be volatile, influenced by oil prices. This creates currency risk for foreign investors but also potential opportunity.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'estonia',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Estonian lawyer (vandeadvokaat) or notary before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, with minor restrictions on agricultural land', details: 'EU/EEA citizens can buy residential and commercial property freely. Agricultural and forest land over 10 hectares requires the buyer to demonstrate farming capability. No restrictions on apartments, houses, or commercial property.', severity: 'favorable' },
          { label: 'Transfer tax', value: 'No transfer tax (notary ~0.5%)', details: 'Estonia does not levy a real estate transfer tax. The only transaction costs are notary fees (typically 0.5–1% of purchase price) and a small state fee for land register entry (~€15–30). Very low transaction costs.', severity: 'favorable' },
          { label: 'e-Residency program', value: 'Digital identity for non-residents', details: 'Estonia\'s e-Residency program provides a government-issued digital identity for managing business remotely. Simplifies administrative processes and company formation. Does not grant physical residency.', severity: 'favorable' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Short-term rentals', value: 'Lightly regulated, no rent control', details: 'Short-term rentals are relatively unregulated. Tallinn requires registration with the Tourism Register. No day limits. No rent control; rents are freely negotiated.', severity: 'favorable' },
          { label: 'Very business-friendly', value: 'Digital-first processes', details: 'Estonia\'s digital-first approach makes rental registration, tax filing, and compliance straightforward. Most processes can be done online. Property management increasingly available.', severity: 'favorable' },
          { label: 'Rental yield potential', value: 'Good in Tallinn (5–7%)', details: 'Gross yields of 5–7% in Tallinn. Strong rental demand from tech workers, students, and digital nomads. Tartu (university city) also offers good yields.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '20% flat rate', details: 'Rental income is taxed at a flat 20% rate for individuals. Deductible expenses are limited to documented expenses directly related to earning the rental income. Non-residents taxed at the same 20% rate.', severity: 'neutral' },
          { label: 'Corporate tax system', value: '0% on retained earnings (unique)', details: 'Estonia\'s unique corporate tax system taxes only distributed profits at 20% (14% for regular distributions). Retained/reinvested profits are untaxed. Holding property through an Estonian company can be very tax-efficient for reinvestment.', severity: 'favorable' },
          { label: 'Land tax (no building tax)', value: '0.1–2.5% of land value only', details: 'Estonia taxes only land (maamaks), not buildings. Residential land in Tallinn: typically 0.1–0.5%. Land under owner-occupied homes is exempt up to 1,500 sqm in cities. Capital gains taxed at 20% (primary residence exempt after 2 years).', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Register at the local government (kohalik omavalitsus) for stays over 3 months. Obtain an Estonian personal identification code (isikukood) for administrative purposes.', severity: 'favorable' },
          { label: 'e-Residency', value: 'Digital business identity (not physical residency)', details: 'e-Residency allows you to establish and manage an Estonian company remotely. It does not grant physical residency or the right to live in Estonia. Useful for structuring property investments through an Estonian OÜ (private limited company).', severity: 'neutral' },
          { label: 'Digital Nomad Visa', value: 'Available for remote workers', details: 'Estonia offers a Digital Nomad Visa for non-EU remote workers earning at least €3,504/month. Valid for up to 1 year. Allows living in Estonia while working for a foreign employer or own company.', severity: 'favorable' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Low in Tallinn', details: 'Estonian is the official language, but English is very widely spoken in Tallinn, especially in the tech sector and among younger professionals. Russian is also widely spoken. Legal documents can often be provided in English.', severity: 'favorable' },
          { label: 'Market prices', value: 'Affordable, rising steadily', details: 'Tallinn prices are well below Nordic capitals but have been rising 5–10% annually. The tech sector (Wise, Bolt, Skype origins) drives demand. Small market (~1.3M population) means limited liquidity.', severity: 'favorable' },
          { label: 'Currency', value: 'Euro (since 2011)', details: 'Estonia uses the Euro, eliminating currency risk for Eurozone investors. Digital infrastructure is world-leading, making remote property management feasible.', severity: 'favorable' }
        ]
      }
    ]
  },
  {
    countryId: 'latvia',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Latvian lawyer (zvērināts advokāts) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, with some land restrictions', details: 'EU/EEA citizens can buy apartments, houses, and commercial property freely. Agricultural and forest land purchases by foreign citizens require registration with the State Land Service and compliance with land use regulations.', severity: 'favorable' },
          { label: 'Transfer tax', value: '2% of cadastral or contract value', details: 'Stamp duty (kancelejas nodeva) of 2% of the property value applies, based on the higher of the cadastral value or contract price. Additional registration fees are minor (~€15–30). Total transaction costs are moderate.', severity: 'neutral' },
          { label: 'Affordable market', value: 'Among EU\'s most affordable', details: 'Latvia offers some of the EU\'s most affordable property prices, especially outside Riga. Average prices in Riga: €1,500–3,000/sqm. Jūrmala (beach resort): higher prices. Regional cities are very affordable.', severity: 'favorable' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Tenant protections', value: 'Moderate, no rent control', details: 'Latvian rental law provides basic tenant protections. No rent control; rents are freely negotiated. New rental law (2021) modernized tenant/landlord rights. Eviction for non-payment requires court proceedings.', severity: 'neutral' },
          { label: 'Short-term rentals', value: 'Registration required', details: 'Short-term rental operators must register as a tourism service provider with the municipality. A guest registration system applies. Riga has been discussing additional regulations but no strict limits imposed.', severity: 'neutral' },
          { label: 'Rental yield potential', value: 'Attractive in Riga (5–8%)', details: 'Gross yields of 5–8% in Riga. Strong demand from local workers, students, and growing expat community. Jūrmala offers seasonal tourism yields. Affordable entry prices support healthy returns.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '10% micro-enterprise or 20% standard', details: 'Individuals can register as micro-enterprise taxpayers and pay 10% on gross rental income (up to €25,000/year). Alternatively, standard personal income tax of 20% applies on net income. The micro-enterprise regime is very favorable for small landlords.', severity: 'favorable' },
          { label: 'Capital gains tax', value: '20% flat rate', details: 'Capital gains on property sales are taxed at 20% for individuals. Exempt if the property has been the taxpayer\'s primary residence for at least 12 months in the 60 months prior to sale and registered at that address.', severity: 'neutral' },
          { label: 'Property tax', value: '0.2–3% of cadastral value', details: 'Annual property tax: 0.2–0.6% for residential properties (based on cadastral value). Higher rates (up to 3%) for neglected or vacant properties. No wealth tax. Overall tax burden for property investors is relatively light.', severity: 'neutral' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Must register at the Office of Citizenship and Migration Affairs (PMLP) for stays over 3 months.', severity: 'favorable' },
          { label: 'Golden Visa (residence permit)', value: 'Available from €250,000 investment', details: 'Non-EU citizens can obtain a 5-year temporary residence permit by purchasing real estate worth at least €250,000 (single property in Riga, Jūrmala, or other major cities). An additional 5% state fee applies. Renewable.', severity: 'favorable' },
          { label: 'Non-EU purchase requirements', value: 'No restrictions on apartment purchases', details: 'Non-EU citizens can purchase apartments and houses freely. Some restrictions may apply to agricultural and forest land. Property ownership alone (below Golden Visa threshold) does not grant residency.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Moderate', details: 'Latvian is the official language. Russian is widely spoken (about 30% of population). English is common among younger professionals and in Riga. Legal documents are in Latvian. Bilingual lawyers available in Riga.', severity: 'neutral' },
          { label: 'Currency', value: 'Euro (since 2014)', details: 'Latvia adopted the euro in January 2014. No currency risk for eurozone investors. This has improved market transparency and foreign investor confidence.', severity: 'favorable' },
          { label: 'Soviet-era housing stock', value: 'Common but requires assessment', details: 'A significant portion of Latvia\'s housing stock consists of Soviet-era panel buildings (1960s–1980s). These may require renovation (insulation, plumbing, electrical). Newer developments offer modern standards. Assess building condition carefully.', severity: 'neutral' }
        ]
      }
    ]
  },
  {
    countryId: 'lithuania',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Lithuanian lawyer (advokatas) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, including land', details: 'EU/EEA citizens can purchase all types of property in Lithuania, including agricultural land (since 2014, when transitional restrictions expired). Same conditions as Lithuanian citizens.', severity: 'favorable' },
          { label: 'Transfer tax', value: 'No transfer tax (notary ~0.5%)', details: 'Lithuania does not levy a real estate transfer tax. Transaction costs consist of notary fees (~0.45% of property value) and State Enterprise Centre of Registers fee (~€20–50). Very low transaction costs.', severity: 'favorable' },
          { label: 'Notary requirement', value: 'Mandatory for all property transfers', details: 'All property purchase contracts must be notarized. The notary verifies ownership, checks encumbrances, and registers the transfer with the Centre of Registers. Process is efficient, typically completed within 1–2 weeks.', severity: 'neutral' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Tenant protections', value: 'Moderate, no rent control', details: 'Lithuanian Civil Code provides standard tenant protections. No rent control; rents are freely negotiated. Eviction for non-payment requires court proceedings. Notice period typically 1–3 months.', severity: 'neutral' },
          { label: 'Short-term rentals', value: 'Registration required', details: 'Short-term accommodation services must be registered and comply with hygiene and safety standards. No strict day limits currently. Vilnius is discussing potential additional regulations.', severity: 'neutral' },
          { label: 'Growing tech hub demand', value: 'Strong yields in Vilnius (5–7%)', details: 'Gross yields of 5–7% in Vilnius. Strong demand from tech workers, students, and growing expat community. Lithuania\'s fintech sector drives demand. Kaunas offers similar yields at lower price points.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: '15% flat rate (or ~5% via business certificate)', details: 'Individual rental income is taxed at 15% flat rate. Business license (verslo liudijimas) may offer more favorable treatment (~5%) for small-scale landlords. 20% rate above €100k income threshold.', severity: 'favorable' },
          { label: 'Capital gains tax', value: '15% flat rate', details: 'Capital gains on property sales are taxed at 15% (20% above the high-income threshold). Exempt if the property has been the primary residence for at least 2 years. No holding period exemption for investment properties.', severity: 'neutral' },
          { label: 'Property tax', value: '0.5–2% only above €150k value', details: 'Annual property tax of 0.5–2% applies only to the value of individual-owned property exceeding €150,000. Below this threshold, no property tax for individuals. This effectively exempts most single-property owners.', severity: 'favorable' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Must register at the Migration Department for stays over 3 months. Obtain a personal code (asmens kodas) for administrative purposes.', severity: 'favorable' },
          { label: 'No Golden Visa', value: 'No investment-based residence permit', details: 'Lithuania does not offer a Golden Visa. Non-EU citizens can apply for temporary residence through employment, business activity (company ownership), family reunification, or study.', severity: 'neutral' },
          { label: 'Startup visa', value: 'Available for innovative startups', details: 'Lithuania offers a Startup Visa for non-EU entrepreneurs with innovative tech business ideas. Evaluated by Startup Lithuania. Valid for 2 years. Not directly tied to property investment but facilitates residency.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Low to moderate', details: 'Lithuanian is the official language. English is widely spoken in Vilnius, especially in the tech and business sectors. Younger generations are highly English-proficient. Legal documents are in Lithuanian; translation services available.', severity: 'neutral' },
          { label: 'Market prices', value: 'Affordable, rising fast', details: 'Vilnius prices have been rising 8–15% annually. Still affordable vs. Western Europe at €2,000–3,500/sqm in central Vilnius. Kaunas and Klaipėda are cheaper.', severity: 'favorable' },
          { label: 'Currency', value: 'Euro (since 2015)', details: 'Lithuania adopted the euro in January 2015. No currency risk for eurozone investors. Has improved market confidence and simplified cross-border property investment.', severity: 'favorable' }
        ]
      }
    ]
  },
  {
    countryId: 'cyprus',
    lastUpdated: '2026-01-15',
    disclaimer: 'This information is for general guidance only. Always consult a qualified Cypriot lawyer (δικηγόρος) before making any property purchase.',
    sections: [
      {
        id: 'purchase',
        title: 'Property Purchase Rules',
        icon: 'Home',
        items: [
          { label: 'EU/EEA citizens can buy freely?', value: 'Yes, no restrictions', details: 'EU/EEA citizens can purchase property in Cyprus without restrictions. Non-EU citizens need Council of Ministers approval (usually granted) and are limited to one property up to approximately 4,014 sqm of land.', severity: 'favorable' },
          { label: 'Transfer fees', value: '3–8% progressive (0 for VAT properties)', details: 'Transfer fees: 3% on first €85,000, 5% on €85,001–€170,000, 8% above €170,000. New properties purchased with VAT (19%, reduced to 5% for primary residence) are exempt from transfer fees.', severity: 'neutral' },
          { label: 'Title deeds', value: 'Verify carefully – historical issues', details: 'Cyprus has had historical issues with title deed delays and properties built on mortgaged land. Legislation has improved the situation significantly. Always verify that clean title deeds exist or will be issued. Use a lawyer with local expertise.', severity: 'restrictive' }
        ]
      },
      {
        id: 'rental',
        title: 'Rental Regulations',
        icon: 'Key',
        items: [
          { label: 'Tenant protections', value: 'Moderate, limited rent control', details: 'Rent control only applies to pre-1999 tenancies in designated areas. Newer properties and properties outside controlled areas have minimal tenant protections. Landlord flexibility is generally good for investment properties.', severity: 'favorable' },
          { label: 'Short-term rentals', value: 'Licensed and growing', details: 'Short-term tourist accommodation requires licensing from the Deputy Ministry of Tourism. Properties rated 1–5 stars. Growing market, especially in Paphos, Limassol, and Ayia Napa. Year-round demand from expats and tourists.', severity: 'neutral' },
          { label: 'Expat rental demand', value: 'Strong in Limassol and Paphos (4–7%)', details: 'Gross yields of 4–7% in Limassol, Paphos, and Larnaca. Strong demand from expats, international companies, and students. Limassol has seen significant corporate demand.', severity: 'favorable' }
        ]
      },
      {
        id: 'tax',
        title: 'Tax Regime',
        icon: 'Calculator',
        items: [
          { label: 'Rental income tax', value: 'Progressive rates 0–35%', details: 'Rental income is taxed at progressive rates: 0% up to €19,500, then 20%, 25%, 30%, 35% above €60,000. Non-domiciled residents exempt from Special Defence Contribution (3% on rent). Deductible expenses include 20% gross rent allowance.', severity: 'neutral' },
          { label: 'Corporate tax', value: '12.5% – among EU\'s lowest', details: 'Cyprus corporate tax rate is 12.5%, one of the lowest in the EU. Holding property through a Cypriot company can be tax-efficient. No tax on gains from disposal of shares. Extensive double taxation treaty network (65+ countries).', severity: 'favorable' },
          { label: 'Capital gains tax', value: '20% on immovable property gains', details: 'Capital Gains Tax of 20% applies to gains from sale of immovable property in Cyprus. Lifetime exemptions: €17,086 for any disposal, €85,430 for primary residence (5+ years). No annual property tax (abolished 2017).', severity: 'neutral' }
        ]
      },
      {
        id: 'visa',
        title: 'Visa & Residency',
        icon: 'Stamp',
        items: [
          { label: 'EU/EEA citizens', value: 'Free to reside and purchase', details: 'Full freedom of movement. Register at the Migration Department (MEU3 certificate) for stays over 3 months. Straightforward process with proof of income or employment.', severity: 'favorable' },
          { label: 'Permanent Residence Permit', value: 'Available from €300,000 investment', details: 'Non-EU citizens can obtain a permanent residence permit (Category F) by purchasing new property worth at least €300,000 (plus VAT). Must demonstrate annual income of €50,000+ from abroad. Processed in about 2 months. Does not lead to citizenship automatically.', severity: 'favorable' },
          { label: 'Cyprus Citizenship by Investment', value: 'Programme suspended (2020)', details: 'The Cyprus Investment Programme (CIP) granting citizenship for €2M+ investment was suspended in November 2020 due to abuse concerns. Currently no citizenship-by-investment route available. Naturalization after 7 years of residence possible.', severity: 'neutral' }
        ]
      },
      {
        id: 'practical',
        title: 'Practical Considerations',
        icon: 'Info',
        items: [
          { label: 'Language barrier', value: 'Very low', details: 'English is very widely spoken in Cyprus due to British colonial history. Many lawyers, agents, and officials work in English. Legal documents can be prepared in English. Greek is the official language but English is used extensively in business.', severity: 'favorable' },
          { label: 'Expat-friendly', value: 'Large international community', details: 'Cyprus has a well-established expat community (British, Russian, tech workers). Property management is well-developed. 300+ days of sunshine and Mediterranean lifestyle support long-term rental demand.', severity: 'favorable' },
          { label: 'Northern Cyprus', value: 'Avoid – complex legal situation', details: 'Property in Northern Cyprus (occupied by Turkey since 1974) carries extreme legal risk. Greek Cypriot owners retain legal title under international law. EU acquis is suspended in the north. Avoid purchasing property in the occupied area.', severity: 'restrictive' }
        ]
      }
    ]
  }
];

export function getRegulation(countryId: string): Regulation | undefined {
  return regulations.find(r => r.countryId === countryId);
}
