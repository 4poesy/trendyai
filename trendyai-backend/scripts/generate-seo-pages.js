import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wtgwxnhnqdnbzpetltrt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Z3d4bmhucWRuYnpwZXRsdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNjQ2NjUsImV4cCI6MjA4MDY0MDY2NX0.3eblmq4lsnDQU33M9XqZpBqux9bi9hX2G0yUuPScHJA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GLOBAL_CITIES = [
  { city: 'london', country: 'UK', continent: 'Europe' },
  { city: 'manchester', country: 'UK', continent: 'Europe' },
  { city: 'birmingham', country: 'UK', continent: 'Europe' },
  { city: 'leeds', country: 'UK', continent: 'Europe' },
  { city: 'glasgow', country: 'UK', continent: 'Europe' },
  { city: 'edinburgh', country: 'UK', continent: 'Europe' },
  { city: 'bristol', country: 'UK', continent: 'Europe' },
  { city: 'new-york', country: 'USA', continent: 'North America' },
  { city: 'los-angeles', country: 'USA', continent: 'North America' },
  { city: 'chicago', country: 'USA', continent: 'North America' },
  { city: 'houston', country: 'USA', continent: 'North America' },
  { city: 'miami', country: 'USA', continent: 'North America' },
  { city: 'dallas', country: 'USA', continent: 'North America' },
  { city: 'atlanta', country: 'USA', continent: 'North America' },
  { city: 'san-francisco', country: 'USA', continent: 'North America' },
  { city: 'seattle', country: 'USA', continent: 'North America' },
  { city: 'boston', country: 'USA', continent: 'North America' },
  { city: 'phoenix', country: 'USA', continent: 'North America' },
  { city: 'toronto', country: 'Canada', continent: 'North America' },
  { city: 'vancouver', country: 'Canada', continent: 'North America' },
  { city: 'montreal', country: 'Canada', continent: 'North America' },
  { city: 'calgary', country: 'Canada', continent: 'North America' },
  { city: 'sydney', country: 'Australia', continent: 'Oceania' },
  { city: 'melbourne', country: 'Australia', continent: 'Oceania' },
  { city: 'brisbane', country: 'Australia', continent: 'Oceania' },
  { city: 'perth', country: 'Australia', continent: 'Oceania' },
  { city: 'berlin', country: 'Germany', continent: 'Europe' },
  { city: 'amsterdam', country: 'Netherlands', continent: 'Europe' },
  { city: 'paris', country: 'France', continent: 'Europe' },
  { city: 'madrid', country: 'Spain', continent: 'Europe' },
  { city: 'barcelona', country: 'Spain', continent: 'Europe' },
  { city: 'rome', country: 'Italy', continent: 'Europe' },
  { city: 'milan', country: 'Italy', continent: 'Europe' },
  { city: 'stockholm', country: 'Sweden', continent: 'Europe' },
  { city: 'zurich', country: 'Switzerland', continent: 'Europe' },
  { city: 'dublin', country: 'Ireland', continent: 'Europe' },
  { city: 'dubai', country: 'UAE', continent: 'Middle East' },
  { city: 'abu-dhabi', country: 'UAE', continent: 'Middle East' },
  { city: 'riyadh', country: 'Saudi Arabia', continent: 'Middle East' },
  { city: 'doha', country: 'Qatar', continent: 'Middle East' },
  { city: 'singapore', country: 'Singapore', continent: 'Asia' },
  { city: 'hong-kong', country: 'Hong Kong', continent: 'Asia' },
  { city: 'tokyo', country: 'Japan', continent: 'Asia' },
  { city: 'bangalore', country: 'India', continent: 'Asia' },
  { city: 'mumbai', country: 'India', continent: 'Asia' },
  { city: 'kuala-lumpur', country: 'Malaysia', continent: 'Asia' },
  { city: 'lagos', country: 'Nigeria', continent: 'Africa' },
  { city: 'abuja', country: 'Nigeria', continent: 'Africa' },
  { city: 'port-harcourt', country: 'Nigeria', continent: 'Africa' },
  { city: 'nairobi', country: 'Kenya', continent: 'Africa' },
  { city: 'johannesburg', country: 'South Africa', continent: 'Africa' },
  { city: 'cape-town', country: 'South Africa', continent: 'Africa' },
  { city: 'accra', country: 'Ghana', continent: 'Africa' },
  { city: 'cairo', country: 'Egypt', continent: 'Africa' }
];

const SERVICES = [
  { slug: 'web-design', name: 'Web Design & Development' },
  { slug: 'mobile-app-development', name: 'Mobile App Development' },
  { slug: 'seo-services', name: 'SEO Services' },
  { slug: 'social-media-management', name: 'Social Media Management' },
  { slug: 'digital-marketing', name: 'Digital Marketing' },
  { slug: 'branding-design', name: 'Brand Identity & Graphic Design' },
  { slug: 'ecommerce-development', name: 'E-commerce Development' },
  { slug: 'ui-ux-design', name: 'UI/UX Design' },
  { slug: 'wordpress-development', name: 'WordPress Development' },
  { slug: 'nextjs-development', name: 'Next.js Development' }
];

const INDUSTRIES = [
  'restaurants', 'real-estate', 'healthcare', 'startups', 'ecommerce',
  'education', 'finance', 'law-firms', 'hospitality', 'nonprofits',
  'coaches', 'photographers', 'churches', 'gyms', 'beauty-salons',
  'construction', 'logistics', 'fintech', 'saas', 'fashion'
];

const COUNTRIES = [
  { slug: 'uk', name: 'United Kingdom', continent: 'Europe' },
  { slug: 'usa', name: 'United States', continent: 'North America' },
  { slug: 'canada', name: 'Canada', continent: 'North America' },
  { slug: 'australia', name: 'Australia', continent: 'Oceania' },
  { slug: 'nigeria', name: 'Nigeria', continent: 'Africa' },
  { slug: 'ghana', name: 'Ghana', continent: 'Africa' },
  { slug: 'kenya', name: 'Kenya', continent: 'Africa' },
  { slug: 'south-africa', name: 'South Africa', continent: 'Africa' },
  { slug: 'germany', name: 'Germany', continent: 'Europe' },
  { slug: 'netherlands', name: 'Netherlands', continent: 'Europe' },
  { slug: 'france', name: 'France', continent: 'Europe' },
  { slug: 'uae', name: 'United Arab Emirates', continent: 'Middle East' },
  { slug: 'singapore', name: 'Singapore', continent: 'Asia' }
];

const AGENCY_TYPES = [
  { slug: 'web-design-agency', name: 'Web Design Agency' },
  { slug: 'app-development-company', name: 'App Development Company' },
  { slug: 'digital-marketing-agency', name: 'Digital Marketing Agency' },
  { slug: 'seo-company', name: 'SEO Company' },
  { slug: 'social-media-agency', name: 'Social Media Agency' },
  { slug: 'brand-identity-agency', name: 'Brand Identity Agency' },
  { slug: 'ecommerce-agency', name: 'E-commerce Agency' },
  { slug: 'ui-ux-agency', name: 'UI/UX Agency' }
];

const GUIDES = [
  'how-to-hire-a-web-designer',
  'how-much-does-a-website-cost',
  'how-to-build-an-app',
  'what-is-seo',
  'how-to-rank-on-google',
  'social-media-marketing-guide',
  'importance-of-branding-for-business',
  'nextjs-vs-wordpress-for-seo',
  'shopify-vs-custom-ecommerce',
  'mobile-app-development-cost-guide'
];

function titleCase(str) {
  return str.replace(/-/g, ' ')
    .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Generators
function generateServiceLocation(service, city) {
  const cityName = titleCase(city.city);
  const slug = `services/${service.slug}/${city.city}`;
  return {
    slug,
    page_type: 'service-location',
    service: service.slug,
    location: city.city,
    country: city.country,
    continent: city.continent,
    target_keyword: `${service.name.toLowerCase()} ${cityName}`,
    h1: `${service.name} in ${cityName}`,
    title: `${service.name} in ${cityName} | Trendtactics Digital`,
    meta_description: `Looking for professional ${service.name.toLowerCase()} in ${cityName}? Trendtactics Digital delivers world-class solutions for businesses in ${cityName}, ${city.country}. Get a free quote.`,
    intro: `Trendtactics Digital provides expert ${service.name.toLowerCase()} to businesses in ${cityName}. Whether you are a startup, SME, or established enterprise, we deliver digital experiences that drive real results.`,
    content: {
      sections: [
        {
          heading: `Why Choose Trendtactics Digital for ${service.name} in ${cityName}?`,
          body: `Businesses in ${cityName} trust Trendtactics Digital because we combine global technical expertise with local market understanding. Our team has delivered ${service.name.toLowerCase()} for clients globally, giving us unique insight into what works in ${cityName}'s competitive landscape.`
        },
        {
          heading: `Our Proven Development Process`,
          body: `We follow a user-centric methodology: Discovery (understanding your unique business and goals), Strategy (planning the right approach for your target audience), Execution (delivering top-tier custom code), and Launch Optimization.`
        }
      ]
    },
    faq: [
      {
        question: `How much does ${service.name.toLowerCase()} cost in ${cityName}?`,
        answer: `${service.name} pricing in ${cityName} varies based on project scope. At Trendtactics Digital, our services start from competitive rates designed for local businesses. Contact us for a custom quote.`
      },
      {
        question: `How long does a typical project take?`,
        answer: `Timelines vary by project. Most development projects take 2-8 weeks depending on complexity. We provide detailed project timelines during our initial consultation.`
      }
    ],
    internal_links: [
      { text: `${service.name} Cost Guide`, url: `/cost/${service.slug}/${city.country.toLowerCase().replace(/ /g, '-')}` },
      { text: `Hire an Agency`, url: `/hire/${service.slug}-agency` }
    ],
    cta_headline: `Start Your ${service.name} Project in ${cityName} Today`,
    cta_subtext: `Get a free consultation and custom quote within 24 hours. No commitment required.`,
    cta_button: 'Get My Free Quote',
    schema_markup: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Trendtactics Digital",
      "url": "https://trendtacticsdigital.com",
      "areaServed": cityName,
      "serviceType": service.name
    },
    published: true
  };
}

function generateServiceIndustry(service, industry) {
  const industryName = titleCase(industry);
  const slug = `services/${service.slug}/for/${industry}`;
  return {
    slug,
    page_type: 'service-industry',
    service: service.slug,
    industry,
    target_keyword: `${service.name.toLowerCase()} for ${industryName.toLowerCase()}`,
    h1: `${service.name} for ${industryName}`,
    title: `${service.name} for ${industryName} | Trendtactics Digital`,
    meta_description: `Tailored ${service.name.toLowerCase()} for ${industryName.toLowerCase()} businesses. Drive growth, automate operations, and capture leads with Trendtactics Digital.`,
    intro: `We build high-converting, custom ${service.name.toLowerCase()} solutions specifically optimized for the ${industryName.toLowerCase()} industry. Let us help you scale your business operations and digital footprint.`,
    content: {
      sections: [
        {
          heading: `Why ${service.name} Matters for ${industryName}`,
          body: `The ${industryName.toLowerCase()} sector faces unique customer acquisition and operations challenges. Our custom ${service.name.toLowerCase()} solutions are built to address these specific needs, integrating seamless booking, customer management, or high-performance landing pages.`
        },
        {
          heading: `Industry-Focused Strategy`,
          body: `We don't believe in generic design. We study your competitors, analyze customer behaviors, and build interfaces that match the expectations of your ${industryName.toLowerCase()} audience.`
        }
      ]
    },
    faq: [
      {
        question: `Why do ${industryName.toLowerCase()} businesses need specialized ${service.name.toLowerCase()}?`,
        answer: `Specialized solutions align with specific user expectations. For example, a restaurant needs online ordering, while a law firm needs secure contact forms. We build custom features tailored to your industry.`
      }
    ],
    internal_links: [
      { text: `All Services`, url: `/services` },
      { text: `Contact Us`, url: `/contact` }
    ],
    cta_headline: `Ready to Scale Your ${industryName} Business?`,
    cta_subtext: `Connect with our industry specialists for a customized roadmap.`,
    cta_button: 'Consult an Expert',
    schema_markup: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Trendtactics Digital",
      "url": "https://trendtacticsdigital.com",
      "serviceType": service.name
    },
    published: true
  };
}

function generateHireAgency(agency, country) {
  const agencyName = agency.name;
  const slug = `hire/${agency.slug}/${country.slug}`;
  return {
    slug,
    page_type: 'hire-agency',
    service: agency.slug,
    country: country.name,
    continent: country.continent,
    target_keyword: `hire ${agencyName.toLowerCase()} in ${country.name}`,
    h1: `Hire a Top-Rated ${agencyName} in ${country.name}`,
    title: `Hire a ${agencyName} in ${country.name} | Trendtactics Digital`,
    meta_description: `Looking to hire a professional ${agencyName.toLowerCase()} in ${country.name}? Partner with Trendtactics Digital for vetted experts and proven results.`,
    intro: `Find and hire the best ${agencyName.toLowerCase()} in ${country.name}. Our dedicated team offers specialized talent to accelerate your digital projects and hit your business goals.`,
    content: {
      sections: [
        {
          heading: `Why Hire Trendtactics Digital in ${country.name}?`,
          body: `Clients in ${country.name} partner with us because we offer high-end agency quality at competitive prices, backed by our advanced AI-driven TrendyAI platform. We maintain constant communication and deliver exactly on time.`
        }
      ]
    },
    faq: [
      {
        question: `How does the onboarding process work?`,
        answer: `Once you reach out, we set up a discovery call to map your requirements, provide a quote, assign team members, and start execution immediately.`
      }
    ],
    internal_links: [
      { text: `Our Portfolio`, url: `/portfolio` },
      { text: `Contact Us`, url: `/contact` }
    ],
    cta_headline: `Hire Vetted ${agencyName} Experts in ${country.name}`,
    cta_subtext: `Speak to our team today to get started with an onboarding specialist.`,
    cta_button: 'Hire Our Team',
    schema_markup: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Trendtactics Digital",
      "url": "https://trendtacticsdigital.com",
      "areaServed": country.name
    },
    published: true
  };
}

function generateCostGuide(service, country) {
  const slug = `cost/${service.slug}/${country.slug}`;
  return {
    slug,
    page_type: 'cost-guide',
    service: service.slug,
    country: country.name,
    continent: country.continent,
    target_keyword: `${service.name.toLowerCase()} cost in ${country.name}`,
    h1: `How Much Does ${service.name} Cost in ${country.name}?`,
    title: `${service.name} Cost & Pricing Guide in ${country.name} | Trendtactics Digital`,
    meta_description: `Complete guide on ${service.name.toLowerCase()} cost in ${country.name}. Learn about factors affecting pricing, budgets, and how to get the best value.`,
    intro: `Thinking about budget? Here is the ultimate guide to ${service.name.toLowerCase()} pricing and cost expectations in ${country.name} for 2026.`,
    content: {
      sections: [
        {
          heading: `Pricing Overview for ${service.name} in ${country.name}`,
          body: `The cost of ${service.name.toLowerCase()} in ${country.name} typically depends on complexity, features, and custom designs. Standard packages start from competitive rates, while large-scale custom integrations scale accordingly.`
        }
      ]
    },
    faq: [
      {
        question: `Why do prices vary?`,
        answer: `Pricing depends heavily on custom requirements, system integrations, APIs, and timeline constraints. We provide flat rates with zero hidden charges.`
      }
    ],
    internal_links: [
      { text: `Get a Quote`, url: `/contact` },
      { text: `View Pricing Plans`, url: `/pricing` }
    ],
    cta_headline: `Get a Transparent Quote for Your ${service.name} Project`,
    cta_subtext: `No hidden fees. We provide a complete cost breakdown for clients in ${country.name}.`,
    cta_button: 'Get Transparent Pricing',
    schema_markup: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Trendtactics Digital",
      "url": "https://trendtacticsdigital.com"
    },
    published: true
  };
}

function generateGuide(topic) {
  const guideTitle = titleCase(topic);
  const slug = `guides/${topic}`;
  return {
    slug,
    page_type: 'how-to',
    service: 'general',
    target_keyword: guideTitle.toLowerCase(),
    h1: guideTitle,
    title: `${guideTitle} | Trendtactics Digital`,
    meta_description: `Read our expert guide on ${guideTitle.toLowerCase()}. Learn strategies, tips, and best practices from industry leaders.`,
    intro: `Welcome to our comprehensive guide on ${guideTitle.toLowerCase()}. We break down everything you need to know step-by-step.`,
    content: {
      sections: [
        {
          heading: `Introduction to ${guideTitle}`,
          body: `Understanding the fundamentals is key. In this article, we outline best practices, common pitfalls, and practical steps to achieve your digital and technical goals.`
        }
      ]
    },
    faq: [
      {
        question: `How can I apply this to my business?`,
        answer: `You can follow the checklist in this guide or hire our specialized team to design and execute it for you.`
      }
    ],
    internal_links: [
      { text: `All Guides`, url: `/blog` },
      { text: `Contact Us`, url: `/contact` }
    ],
    cta_headline: `Need Professional Assistance?`,
    cta_subtext: `Let our specialists handle the execution while you focus on growing your business.`,
    cta_button: 'Contact Our Specialists',
    schema_markup: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": guideTitle,
      "publisher": {
        "@type": "Organization",
        "name": "Trendtactics Digital",
        "logo": "https://trendtacticsdigital.com/logo.png"
      }
    },
    published: true
  };
}

async function generateAllPages() {
  console.log('Generating all pages in memory...');
  const allPages = [];

  // 1. Service + Location (10 services * 54 locations = 540 pages)
  for (const service of SERVICES) {
    for (const city of GLOBAL_CITIES) {
      allPages.push(generateServiceLocation(service, city));
    }
  }

  // 2. Service + Industry (10 services * 20 industries = 200 pages)
  for (const service of SERVICES) {
    for (const industry of INDUSTRIES) {
      allPages.push(generateServiceIndustry(service, industry));
    }
  }

  // 3. Hire Agency (8 agencies * 13 countries = 104 pages)
  for (const agency of AGENCY_TYPES) {
    for (const country of COUNTRIES) {
      allPages.push(generateHireAgency(agency, country));
    }
  }

  // 4. Cost Guide (10 services * 13 countries = 130 pages)
  for (const service of SERVICES) {
    for (const country of COUNTRIES) {
      allPages.push(generateCostGuide(service, country));
    }
  }

  // 5. Guides (10 topics = 10 pages)
  for (const topic of GUIDES) {
    allPages.push(generateGuide(topic));
  }

  console.log(`Total generated pages: ${allPages.length}`);
  console.log('Upserting to Supabase in batches of 100...');

  const batchSize = 100;
  let totalUpserted = 0;
  const errors = [];

  for (let i = 0; i < allPages.length; i += batchSize) {
    const batch = allPages.slice(i, i + batchSize);
    console.log(`Upserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allPages.length / batchSize)} (${batch.length} items)...`);
    
    const { error } = await supabase
      .from('seo_pages')
      .upsert(batch, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Batch failed:`, error.message);
      errors.push({ batchIndex: i, message: error.message });
    } else {
      totalUpserted += batch.length;
      console.log(`✓ Batch upserted successfully.`);
    }
  }

  console.log(`\n\n✅ Seeding Complete!`);
  console.log(`Successfully upserted: ${totalUpserted}/${allPages.length} pages.`);
  console.log(`Failed batches: ${errors.length}`);
  if (errors.length > 0) {
    process.exit(1);
  }
}

generateAllPages().catch(console.error);
