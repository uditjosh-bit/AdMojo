import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Settings, 
  Plus, 
  Trash2, 
  FileText, 
  Database, 
  Zap, 
  Layout, 
  RefreshCw,
  ShieldCheck,
  Thermometer,
  AlertTriangle,
  Infinity,
  ArrowRight,
  Upload,
  Cpu,
  Globe,
  AlignLeft,
  Smartphone,
  CheckCircle,
  XCircle,
  Save,
  Download,
  Search,
  Image as ImageIcon,
  X,
  Type, 
  ShoppingBag, 
  Share2
} from 'lucide-react';

const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash-preview-09-2025', name: 'Gemini 2.5 Flash (Preview - Supported)' },
  { id: 'gemini-3.0-pro-exp', name: 'Gemini 3.0 Pro (Exp)' },
  { id: 'gemini-3.0-flash-exp', name: 'Gemini 3.0 Flash (Exp)' },
  { id: 'gemini-2.5-pro-preview-09-2025', name: 'Gemini 2.5 Pro (Preview)' },
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Exp)' }
];

const ASSET_TYPES = [
  {
    id: 'pla_titles',
    label: 'Product Listing Ads (PLA) Titles',
    description: 'Optimize merchant titles for Google Shopping campaigns with front-loaded specs.',
    icon: ShoppingBag,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  {
    id: 'search_headlines',
    label: 'Search Ads (RSA) Headlines',
    description: 'Generate high-CTR, 30-character headlines for Google Search text ads.',
    icon: Search,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'search_descriptions',
    label: 'Search Ads (RSA) Descriptions',
    description: 'Draft compelling 90-character descriptions to highlight value propositions.',
    icon: Type,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    id: 'social_copy',
    label: 'Social Media Ad Copy',
    description: 'Engaging primary text for Facebook, Instagram, or LinkedIn performance ads.',
    icon: Share2,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  {
    id: 'pmax_assets',
    label: 'Performance Max Asset Groups',
    description: 'Create a cohesive mix of short headlines, long headlines, and descriptions.',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  }
];

const DEFAULT_PLA_GEN_PROMPT = `You're a specialized Marketing Copywriter, acting strictly as a Title Reviewer and Editor. Your job is to create {{num_titles}} unique, concise headlines from a single merchant-provided title and description. Remember, strict source adherence and compliance are more important than creativity, except for approved abbreviations. Your final headlines must be factual, highly concise, and designed to boost online ad performance.

Your process must be sequential and adhere to all rules:

Step 1: Identify and Extract Core Components
First, pin down the brand name and the product name.
Extract brand name from the merchant provided title. If it cannot be found in the provided title, the product is considered "unbranded".
If the product is a set or kit, don't highlight just part of it as the core product; the core product must represent the entire set. Next, identify the Model/Series Name and the most fundamental product type (the irreducible core name). Any additional descriptive words directly attached to this fundamental product type in the title should be initially captured as title attributes, not part of the core product name itself. Finally, check for any factual conflicts between the Title and the Description. If a conflict exists, use only the information from the Title.

Step 2: Extract and Filter Valuable Details
Go through the Title and Description and identify potential phrases or attributes that offer new, unique and valuable information (especially material/size/variants/quantity/functionality). This list forms your final set of attributes. Filter this list by applying these criteria:

- Does it describe a generic statement of functionality or a feature that is expected of all products of this type? If so, discard it.
- Is it puffery marketing language? If so, discard it.
- Does it highlight a problem without a solution verb? If so, discard it.
- Does it contain any shipping, delivery, or fulfillment-related information (including channel, availability, ...)? If so, it must be unconditionally discarded, because such information will be displayed in other places. Including them here will cause duplication.
- Is it a negative disclosure, a disclaimer, or a warranty detail? If so, discard it.
- Is it not specifically about the product's physical attributes, material, function, or measurable performance? If so, discard it.

Step 3: Construct and Format Headlines
* **Source & Quantity:** Using only the core components from Step 1 and the filtered details from Step 2, construct the requested headline options.
* **Mandatory Title Details:** Every headline **must** include all physical attributes, material, function, or measurable performance details extracted *from the original title* (excluding color for apparel).
* **Optional Description Details:** Identify the top 5 most valuable selling points extracted from the description in Step 2. Each headline can *optionally* include at most 2 description details to maximize appeal and product identity.

Non-Negotiable Identity Rule: The headline must always clearly establish the product's full identity. You must use the fundamental product type and the Model/Series Name as unbreakable units. Crucially, ensure the headline is contextually clear to a customer regarding its source, type, or function.

Adhere to the following rules based on the product's brand status, determined in Step 1:

Unbranded Product:
- Inclusion: Brand name MUST BE OMITTED from all final headlines.

Branded Product:
- Inclusion: Brand name MUST BE INCLUDED in every final headline.

Positioning Logic (Applies only to Branded products):
- If the Brand is the FIRST WORD of the original title: The final headline MUST begin with the Brand Name.
- If the Brand is NOT the first word of the original title: The final headline MUST NOT begin with the Brand Name. The Brand Name must be placed later in the headline.

Prioritize Key Features: Structure the headline to feature Product Name, Model/Series Name, Fundamental Product Type at the beginning.

Avoid sensitive demographic phrases: Don't create phrases that combine a descriptor (e.g., "black") with a demographic (e.g., "women's") unless that exact phrase exists as an unbreakable unit in the source text.
Vary the first 3 to 6 words to showcase different product aspects.

Step 4: Refine and Finalize Output
Apply all final formatting and cleaning rules to the constructed headlines.
Refined Abbreviation Rule: Strict source adherence is mandatory, EXCEPT for approved abbreviations. You can use the following:
Standard Unit Abbreviations (e.g., foot to ', ounces to oz, pack of N to N-Pack, count to ct, piece to pc, dozen to doz).
Hyphenated Modifiers: A contiguous sequence of words may be combined into a hyphenated modifier if it improves conciseness (e.g., "15 minutes" can become "15-Min").
Attribute Consolidation: For conciseness, slashes (/) may be used to separate and consolidate closely related, short attributes (e.g., "Black/White" for "Black and White").
Clarity Omission: When condensing a multi-word feature, you may omit non-essential connecting words, redundant verbs, or subjective starts provided the remaining core fact/benefit is strictly sourced and contextually clear. EXCEPTION: Non-essential connecting words, such as "for," MUST NOT BE OMITTED when introducing the Optional Description Details that define the product's function or target audience. The explicit functional connector is mandatory for these attributes to meet clarity and source compliance rules.
Correct all words to standard title casing.
Omit "dangling" words where appropriate.

Separate logical groups (like the core product identity) with a single pipe "|".
Punctuation Note: Omit the serial comma (Oxford comma) before the ampersand (&) in a list for maximum conciseness (e.g., "A, B & C" is preferred over "A, B, & C").

Ensure each final headline is 90 characters or less. If creating a high-quality, rule-compliant headline under the character limit is impossible, the correct action is to return an empty array for the “assets” field.

Output ONLY the list of titles as plain text, one per line. No numbering, no bullets, no intro.

User Criteria:
{{criteria}}

-------
Your Turn
- Advertiser Title: {{advertiser_title}}
- Description: {{description}}
- Landing Page: {{landing_page}}
- User Query: {{user_query}}`;

const DEFAULT_PLA_EVAL_PROMPT = `# Role
You are a Brand Compliance Auditor. Your SOLE purpose is to protect the identity of the Merchant Brand, 3rd Party Brands, and the Core Product.

# Input Data Structure
* \`#\`: Row number.
* \`offer_id\`: Unique Product ID (Must be preserved in output).
* \`merchant_provided_title\`: **Primary Source of Truth.**
* \`Generated Title\`: The rewrite to evaluate.

# Task
Determine if a **Brand Compliance Violation** exists based on the original title. Output Pass or Fail, and categorize it into:
1) Incorrect or Misspelled Brand/Product Name
2) Brand/Product Name Jumbled
3) Brand & Product/Component names broken
4) Incorrect Trademarks

| # | offer_id | Original Title | Generated Title | Pass/Fail | Violation Category | Reasoning |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

-------
Evaluation Data:
offer_id: {{offer_id}}
merchant_provided_title: {{advertiser_title}}
merchant_provided_description: {{description}}
User Query: {{user_query}}

Generated Titles to Evaluate (Process each one as a separate row):
{{titles_list}}`;

const ASSET_CONFIG = {
  pla_titles: {
    fields: [
      { id: 'advertiser_title', label: 'Advertiser Title', type: 'text' },
      { id: 'landing_page', label: 'Landing Page URL', type: 'text' },
      { id: 'user_query', label: 'User Query Context', type: 'text' },
      { id: 'description', label: 'Product Description', type: 'textarea' }
    ],
    genPrompt: DEFAULT_PLA_GEN_PROMPT,
    evalPrompt: DEFAULT_PLA_EVAL_PROMPT
  },
  search_headlines: {
    fields: [
      { id: 'keywords', label: 'Target Keywords', type: 'text' },
      { id: 'brand_name', label: 'Brand/Business Name', type: 'text' },
      { id: 'landing_page', label: 'Final URL', type: 'text' },
      { id: 'value_prop', label: 'Value Proposition & Offers', type: 'textarea' }
    ],
    genPrompt: `You are an expert Search Ads copywriter. Generate {{num_titles}} RSA headlines.
Rules:
- Strictly under 30 characters each.
- Capitalize the first letter of each major word.
- Focus on driving high CTR and embedding keywords.
- Output ONLY the list of titles as plain text, one per line. No numbering, no bullets.

Data:
Keywords: {{keywords}}
Brand: {{brand_name}}
Value Prop: {{value_prop}}
URL: {{landing_page}}
{{criteria}}`,
    evalPrompt: `Evaluate the following RSA headlines for strict length limits.
Rules:
- Headline MUST be under 30 characters.
- MUST include a target keyword if contextually appropriate.

| # | target | Headline | Pass/Fail | Character Count | Reasoning |
|---|---|---|---|---|---|

Data:
{{keywords}}
{{titles_list}}`
  },
  search_descriptions: {
    fields: [
      { id: 'keywords', label: 'Target Keywords', type: 'text' },
      { id: 'brand_name', label: 'Brand Name', type: 'text' },
      { id: 'features', label: 'Key Features', type: 'text' },
      { id: 'value_prop', label: 'Value Proposition & Call to Action', type: 'textarea' }
    ],
    genPrompt: `You are an expert Search Ads copywriter. Generate {{num_titles}} RSA descriptions.
Rules:
- Strictly under 90 characters each.
- Include a strong Call to Action (CTA).
- Focus on value and features.
- Output ONLY the list of descriptions as plain text, one per line. No bullets.

Data:
Keywords: {{keywords}}
Brand: {{brand_name}}
Features: {{features}}
Value Prop: {{value_prop}}
{{criteria}}`,
    evalPrompt: `Evaluate the following RSA descriptions for length limits.
Rules:
- Description MUST be under 90 characters.

| # | target | Description | Pass/Fail | Character Count | Reasoning |
|---|---|---|---|---|---|

Data:
{{titles_list}}`
  },
  social_copy: {
    fields: [
      { id: 'product_name', label: 'Product/Campaign Name', type: 'text' },
      { id: 'target_audience', label: 'Target Audience', type: 'text' },
      { id: 'promo_offer', label: 'Promotional Offer', type: 'text' },
      { id: 'creative_desc', label: 'Creative/Image Context', type: 'textarea' }
    ],
    genPrompt: `You are an engaging Social Media Manager. Write {{num_titles}} variants of Primary Text for a Facebook/Instagram ad.
Rules:
- Use an engaging hook to grab attention.
- Use 1-2 relevant emojis naturally.
- Include the promotional offer clearly.
- Separate each variant by a double newline. Do not use numbers or bullets.

Data:
Product: {{product_name}}
Target Audience: {{target_audience}}
Offer: {{promo_offer}}
Creative Context: {{creative_desc}}
{{criteria}}`,
    evalPrompt: `Review these social media posts for tone, emoji usage, and offer inclusion.
Rules:
- Must mention the offer.
- Tone should be engaging and appropriate for the audience.

| # | post | Pass/Fail | Tone | Feedback |
|---|---|---|---|---|

{{titles_list}}`
  },
  pmax_assets: {
    fields: [
      { id: 'campaign_theme', label: 'Campaign Theme', type: 'text' },
      { id: 'landing_page', label: 'Landing Page URL', type: 'text' },
      { id: 'audiences', label: 'Audience Signals', type: 'text' },
      { id: 'core_benefits', label: 'Core Benefits/Products', type: 'textarea' }
    ],
    genPrompt: `Create a Performance Max asset group text bundle ({{num_titles}} total variants).
For each variant, provide a short headline (max 30 chars), long headline (max 90 chars), and description (max 90 chars) formatted logically.
Format:
Headline (Short): [text]
Headline (Long): [text]
Description: [text]

Data:
Theme: {{campaign_theme}}
URL: {{landing_page}}
Audiences: {{audiences}}
Benefits: {{core_benefits}}`,
    evalPrompt: `Evaluate the following PMax assets to ensure strict character limit adherence.
Short Headline < 30 chars
Long Headline < 90 chars
Description < 90 chars

| # | Asset Type | Text | Length Check | Pass/Fail |
|---|---|---|---|---|

{{titles_list}}`
  }
};

const CRITERIA_OPTIONS = [
  { id: 'ctr', label: 'Optimize for High CTR', prompt_add: 'Focus on action verbs and urgent language to drive clicks.' },
  { id: 'relevance', label: 'User Query Relevance', prompt_add: 'Ensure the target query or keywords are prioritized in the output.' },
  { id: 'brand', label: 'Brand Prominence', prompt_add: 'Make sure the Brand Name is the very first word.' },
  { id: 'specs', label: 'Front-load Specs', prompt_add: 'Start with key specs (Size, Color, Material, Model) immediately.' },
  { id: 'problem_sol', label: 'Problem-Solution Framing', prompt_add: 'Frame the text as a solution to a specific user problem.' },
];

function AssetSelectorScreen({ onSelectAndContinue }) {
  const [selectedAsset, setSelectedAsset] = useState(ASSET_TYPES[0].id);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500 h-full flex flex-col justify-center">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-200">
           <Zap size={32} fill="currentColor" />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">What are we building today?</h2>
        <p className="text-slate-500 text-lg">Select an ad format to load the appropriate AI generation pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {ASSET_TYPES.map((asset) => {
          const isSelected = selectedAsset === asset.id;
          const Icon = asset.icon;
          
          return (
            <div 
              key={asset.id}
              onClick={() => setSelectedAsset(asset.id)}
              className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.02]' 
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className={`p-3 rounded-lg ${asset.bgColor} ${asset.color} shrink-0`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {asset.label}
                </h3>
                <p className="text-sm text-slate-600 leading-snug">
                  {asset.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center border-t border-slate-200 pt-8">
        <button 
          onClick={() => onSelectAndContinue(selectedAsset)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-all text-lg"
        >
          Configure Pipeline <ArrowRight size={22}/>
        </button>
      </div>
    </div>
  );
}

const generateWithGemini = async (prompt, modelId, temperature = 0.7) => {
  const apiKey = ""; // API Key provided by execution environment
  
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: temperature
    }
  };

  const delays = [1000, 2000, 4000, 8000, 16000];
  let lastError = null;

  for (let attempt = 0; attempt <= 5; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const responseText = await response.text();
      
      if (!response.ok) {
         let errorMessage = `API Request Failed (${response.status})`;
         try {
           if (responseText) {
             const errData = JSON.parse(responseText);
             errorMessage = errData.error?.message || errorMessage;
           }
         } catch (e) {
           errorMessage = `${errorMessage}: ${responseText}`;
         }
         
         const error = new Error(errorMessage);
         error.status = response.status;
         throw error;
      }
      
      if (!responseText) throw new Error("Empty response received from API");

      const data = JSON.parse(responseText);
      
      if (!data.candidates || data.candidates.length === 0) {
          return "Error: No candidates returned (Safety filter may have triggered)";
      }

      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No text generated.";
      
    } catch (error) {
      lastError = error;
      if (error.status === 401 || error.status === 400 || error.status === 403) {
        break;
      }
      if (attempt < 5) {
        await new Promise(resolve => setTimeout(resolve, delays[attempt]));
      }
    }
  }
  
  console.error("Gemini Gen Error after retries:", lastError);
  return `Error: ${lastError.message || 'Failed after retries.'}`;
};

const MarkdownTable = ({ content }) => {
  if (!content) return null;

  const parseTable = (text) => {
    const lines = text.trim().split('\n');
    const tableLines = lines.filter(line => line.trim().startsWith('|'));
    
    if (tableLines.length < 2) return null; 

    const headers = tableLines[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
    const dataRows = tableLines.slice(2).map(line => 
      line.split('|').filter((c, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim())
    );

    return { headers, dataRows };
  };

  const tableData = parseTable(content);

  if (!tableData) {
    return <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-lg">{content}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-slate-100 text-slate-700 uppercase text-xs font-bold">
          <tr>
            {tableData.headers.map((h, i) => (
              <th key={i} className="px-4 py-3 border-b border-r border-slate-200 last:border-r-0 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {tableData.dataRows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
              {row.map((cell, j) => {
                const isPass = cell.toLowerCase().includes('pass');
                const isFail = cell.toLowerCase().includes('fail');
                return (
                  <td key={j} className="px-4 py-3 border-r border-slate-100 last:border-r-0 align-top">
                     {isPass && <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-200"><CheckCircle size={12}/> PASS</span>}
                     {isFail && <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-xs font-bold border border-rose-200"><XCircle size={12}/> FAIL</span>}
                     {!isPass && !isFail && cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const extractDomain = (url) => {
  if (!url) return 'Example Store';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch (e) {
    return 'Example Store';
  }
};

const copyToClipboard = (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (error) {
      console.error('Failed to copy text', error);
    }
    textArea.remove();
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('selector'); 
  const [assetType, setAssetType] = useState('pla_titles'); 
  const [selectedModel, setSelectedModel] = useState(GEMINI_MODELS[0].id);
  
  const [genPrompt, setGenPrompt] = useState(ASSET_CONFIG['pla_titles'].genPrompt);
  const [evalPrompt, setEvalPrompt] = useState(ASSET_CONFIG['pla_titles'].evalPrompt);
  const [detectedParams, setDetectedParams] = useState([]);

  const [numTitles, setNumTitles] = useState(3);
  const [autoMode, setAutoMode] = useState(false); 
  const [creativity, setCreativity] = useState(0.7); 
  const [selectedCriteria, setSelectedCriteria] = useState(['relevance']);
  
  // Pre-populated data state so the user doesn't start with a blank slate
  const [offers, setOffers] = useState([
    { 
      id: 'ROW-1', 
      advertiser_title: 'Premium Wireless Noise-Cancelling Headphones', 
      description: 'Experience immersive sound with our latest over-ear headphones featuring 30-hour battery life and active noise cancellation. Includes carrying case.', 
      user_query: 'noise cancelling headphones',
      landing_page: 'https://example.com/headphones',
      keywords: 'noise cancelling, wireless headphones',
      brand_name: 'AudioTech',
      features: '30h battery, ANC, over-ear',
      value_prop: 'Immersive sound on the go',
      product_name: 'AudioTech Pro X',
      target_audience: 'Audiophiles and travelers',
      promo_offer: '20% off with code AUDIO20',
      creative_desc: 'Product shot of headphones on a sleek wooden desk',
      campaign_theme: 'Summer Travel Audio',
      audiences: 'Travelers, Commuters',
      core_benefits: 'Block out the world, long lasting battery'
    }
  ]);

  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  
  const [results, setResults] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [appError, setAppError] = useState('');
  
  const [simulationOffer, setSimulationOffer] = useState(null);

  useEffect(() => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...genPrompt.matchAll(regex)].map(m => m[1]);
    setDetectedParams([...new Set(matches)]);
  }, [genPrompt]);

  const handleAssetSelection = (selectedId) => {
    const config = ASSET_CONFIG[selectedId];
    setAssetType(selectedId);
    setGenPrompt(config.genPrompt);
    setEvalPrompt(config.evalPrompt);
    // When changing asset types, reset to a generic single pre-populated row
    setOffers([{ 
      id: 'ROW-1',
      advertiser_title: 'Premium Wireless Noise-Cancelling Headphones', 
      description: 'Experience immersive sound with our latest over-ear headphones featuring 30-hour battery life and active noise cancellation.', 
      user_query: 'noise cancelling headphones',
      landing_page: 'https://example.com/headphones',
      keywords: 'noise cancelling, wireless headphones',
      brand_name: 'AudioTech',
      features: '30h battery, ANC, over-ear',
      value_prop: 'Immersive sound on the go',
      product_name: 'AudioTech Pro X',
      target_audience: 'Audiophiles and travelers',
      promo_offer: '20% off',
      creative_desc: 'Product shot of headphones on a sleek wooden desk',
      campaign_theme: 'Summer Travel Audio',
      audiences: 'Travelers, Commuters',
      core_benefits: 'Block out the world, long lasting battery'
    }]); 
    setResults({});
    setActiveTab('setup');
  };

  const handleAddOffer = () => {
    setOffers([...offers, { id: `ROW-${offers.length + 1}` }]);
  };

  const handleDeleteOffer = (id) => {
    setOffers(offers.filter(o => o.id !== id));
  };

  const updateOffer = (id, field, value) => {
    setOffers(offers.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const parseBulkInput = () => {
    if (!bulkText.trim()) return;
    
    const configFields = ASSET_CONFIG[assetType].fields;
    
    const rows = bulkText.trim().split('\n');
    const newOffers = rows.map((row, idx) => {
      const delimiter = row.includes('\t') ? '\t' : ',';
      const cols = row.split(delimiter).map(c => c.trim());
      
      const newObj = { id: `BULK-${Date.now()}-${idx}` };
      configFields.forEach((f, i) => {
        newObj[f.id] = cols[i] || '';
      });
      return newObj;
    });

    setOffers([...offers, ...newOffers]);
    setBulkText('');
    setBulkMode(false);
  };

  const toggleCriteria = (id) => {
    setSelectedCriteria(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const validateInputs = () => {
    if (offers.length === 0) return "No inputs to process.";
    return null;
  };

  const exportCSV = () => {
    let csv = "Row ID,Generated Asset,Char Count,Status\n";
    offers.forEach(offer => {
      const res = results[offer.id];
      if (res && res.titles) {
        res.titles.forEach(t => {
          csv += `"${offer.id}","${t.replace(/"/g, '""')}",${t.length},Generated\n`;
        });
      }
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assetType}_exports.csv`;
    a.click();
  };

  const runGeneration = async () => {
    setAppError('');
    const error = validateInputs();
    if (error) return setAppError(error);

    setIsProcessing(true);
    setActiveTab('results');
    
    const criteriaText = selectedCriteria
      .map(c => CRITERIA_OPTIONS.find(opt => opt.id === c)?.prompt_add)
      .join(' ');

    const initialResults = { ...results };
    offers.forEach(offer => {
       if (!initialResults[offer.id]) initialResults[offer.id] = { titles: [], status: 'pending' };
    });
    setResults(initialResults);

    for (let i = 0; i < offers.length; i++) {
       const offer = offers[i];
       setProcessingStage(`Generating ${i + 1}/${offers.length}...`);

       let finalPrompt = genPrompt;
       const qtyInstruction = autoMode 
        ? "as many high-quality variations as possible (up to 20)" 
        : `exactly ${numTitles}`;
        
       finalPrompt = finalPrompt.replace(/{{num_titles}}/g, qtyInstruction);
       finalPrompt = finalPrompt.replace(/{{criteria}}/g, criteriaText);
       
       ASSET_CONFIG[assetType].fields.forEach(field => {
         const regex = new RegExp(`{{${field.id}}}`, 'g');
         finalPrompt = finalPrompt.replace(regex, offer[field.id] || '');
       });

       try {
         const generatedText = await generateWithGemini(finalPrompt, selectedModel, creativity);
         
         let lines = [];
         if (generatedText && !generatedText.startsWith("Error")) {
            lines = generatedText.split('\n')
              .map(l => l.replace(/^[\d\*]+[\.\)]\s*|-\s*/, '').trim()) 
              .filter(l => l.length > 5 && !l.toLowerCase().includes('here are')); 
         } else {
            lines = [generatedText];
         }

         setResults(prev => ({
           ...prev,
           [offer.id]: { titles: lines, evaluation: null, status: 'generated', timestamp: new Date().toISOString() }
         }));

       } catch (e) {
         setResults(prev => ({
           ...prev, [offer.id]: { titles: ["Error: Generation failed"], status: 'error', error: e.message }
         }));
       }
       await new Promise(r => setTimeout(r, 200)); 
    }

    setIsProcessing(false);
    setProcessingStage('');
  };

  const runFullQualityCheck = async () => {
    setAppError('');
    const error = validateInputs();
    if (error) return setAppError(error);
    
    setIsProcessing(true);
    setProcessingStage('Evaluating...');
    
    const offersToProcess = offers.filter(o => results[o.id]?.titles?.length > 0);
    
    for (let i = 0; i < offersToProcess.length; i++) {
      const offer = offersToProcess[i];
      const result = results[offer.id];
      
      setProcessingStage(`Evaluating ${i + 1}/${offersToProcess.length}...`);

      let prompt = evalPrompt;
      prompt = prompt.replace(/{{offer_id}}/g, offer.id);
      prompt = prompt.replace(/{{titles_list}}/g, result.titles.map((t, i) => `${i+1}. ${t}`).join('\n'));
      
      ASSET_CONFIG[assetType].fields.forEach(field => {
        const regex = new RegExp(`{{${field.id}}}`, 'g');
        prompt = prompt.replace(regex, offer[field.id] || '');
      });

      try {
        const evalOutput = await generateWithGemini(prompt, selectedModel, 0.1);
        setResults(prev => ({
          ...prev, [offer.id]: { ...prev[offer.id], evaluation: evalOutput, status: 'evaluated' }
        }));
      } catch (e) {
        console.error("Eval Error", e);
      }
      await new Promise(r => setTimeout(r, 200)); 
    }

    setIsProcessing(false);
    setProcessingStage('');
  };

  const ParamsBadge = ({ label }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-mono font-medium mr-2 mb-2 transition-colors ${
      detectedParams.includes(label) ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
    }`}>
      {`{{${label}}}`}
    </span>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      
      {activeTab !== 'selector' && (
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-indigo-200 shadow-lg cursor-pointer transition-transform hover:scale-105" onClick={() => setActiveTab('selector')} title="Back to menu">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Ad copy generator</h1>
              <p className="text-xs text-slate-500 font-medium">The Funky Copy Generator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isProcessing && (
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold animate-pulse border border-indigo-100">
                  <RefreshCw size={12} className="animate-spin" />
                  {processingStage}
                </div>
            )}
            <nav className="flex p-1 bg-slate-100 rounded-lg">
              {[
                { id: 'setup', label: 'Setup', icon: Settings },
                { id: 'data', label: 'Data', icon: Database },
                { id: 'results', label: 'Generate', icon: Layout },
                { id: 'quality', label: 'Quality Checks', icon: ShieldCheck },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1 overflow-hidden relative">
        {appError && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-rose-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
            <AlertTriangle size={18} />
            <span className="font-medium text-sm">{appError}</span>
            <button onClick={() => setAppError('')} className="ml-2 text-white/80 hover:text-white"><X size={16} /></button>
          </div>
        )}
        
        {activeTab === 'selector' ? (
          <AssetSelectorScreen onSelectAndContinue={handleAssetSelection} />
        ) : (
          <div className="max-w-7xl mx-auto h-full p-6 overflow-auto animate-in fade-in">
            
            {activeTab === 'setup' && (
              <div className="grid grid-cols-12 gap-8 h-full pb-20">
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full overflow-y-auto pr-2">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[500px]">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-xl">
                      <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                        <FileText size={18} className="text-purple-500" /> 
                        Generation Prompt Template
                      </h2>
                      <span className="text-xs text-slate-400 font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">{ASSET_TYPES.find(a=>a.id===assetType)?.label}</span>
                    </div>
                    <textarea 
                      className="flex-1 w-full p-5 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed"
                      value={genPrompt}
                      onChange={(e) => setGenPrompt(e.target.value)}
                      spellCheck={false}
                    />
                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-1 rounded-b-xl">
                      <span className="text-xs text-slate-400 mr-2 py-1">Variables detected:</span>
                      {detectedParams.map(p => <ParamsBadge key={p} label={p} />)}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Cpu size={18} /> Model Selection
                    </h3>
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {GEMINI_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-6">
                    <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Output Settings</h3>
                    <div className={`transition-opacity ${autoMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                      <label className="text-sm text-slate-600 flex justify-between mb-2">
                        Variants per Row <span className="font-bold text-purple-600">{numTitles}</span>
                      </label>
                      <input 
                        type="range" min="1" max="10" 
                        value={numTitles} onChange={(e) => setNumTitles(e.target.value)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>

                    <label className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-100 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${autoMode ? 'bg-purple-600 border-purple-600' : 'bg-white border-slate-300'}`}>
                        {autoMode && <Infinity size={12} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={autoMode} onChange={(e) => setAutoMode(e.target.checked)} />
                      <div>
                        <span className="text-sm font-semibold text-purple-900 group-hover:text-purple-700">Infinite Mode</span>
                        <p className="text-[10px] text-purple-700 leading-tight">Generate max high-quality variants (up to 20)</p>
                      </div>
                    </label>

                    <div>
                      <label className="text-sm text-slate-600 flex justify-between mb-2">
                        <span className="flex items-center gap-1"><Thermometer size={14}/> Creativity</span>
                        <span className="font-bold text-purple-600">{Math.round(creativity * 100)}%</span>
                      </label>
                      <input 
                        type="range" min="0" max="1" step="0.1"
                        value={creativity} onChange={(e) => setCreativity(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex-1 overflow-y-auto">
                    <h3 className="font-semibold text-slate-800 mb-4">Generation Criteria</h3>
                    <div className="space-y-3">
                      {CRITERIA_OPTIONS.map(option => (
                        <label 
                          key={option.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedCriteria.includes(option.id) ? 'bg-purple-50 border-purple-200' : 'bg-white border-slate-200 hover:border-purple-200'
                          }`}
                        >
                          <input 
                            type="checkbox" checked={selectedCriteria.includes(option.id)} onChange={() => toggleCriteria(option.id)}
                            className="mt-1 w-4 h-4 text-purple-600 rounded"
                          />
                          <div>
                            <div className={`text-sm font-medium ${selectedCriteria.includes(option.id) ? 'text-purple-800' : 'text-slate-700'}`}>{option.label}</div>
                            {selectedCriteria.includes(option.id) && <p className="text-xs text-purple-600 mt-1 leading-tight">{option.prompt_add}</p>}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="col-span-12 flex justify-end pt-4 border-t border-slate-200 mt-auto">
                    <button onClick={() => setActiveTab('data')} className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-slate-700 hover:scale-105 transition-all">
                      Next Step: Data Input <ArrowRight size={18}/>
                    </button>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="max-w-5xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Source Data</h2>
                    <div className="flex items-center gap-2 mt-2">
                       <label className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm border ${bulkMode ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-slate-300 text-slate-600'}`}>
                          <input type="checkbox" checked={bulkMode} onChange={(e) => setBulkMode(e.target.checked)} className="hidden"/>
                          {bulkMode ? <CheckCircle size={14}/> : <Upload size={14}/>}
                          <span className="font-semibold">Bulk Import Mode</span>
                       </label>
                    </div>
                  </div>
                  {!bulkMode && (
                    <button onClick={handleAddOffer} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                      <Plus size={16} /> Add New Row
                    </button>
                  )}
                </div>

                {bulkMode ? (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in">
                     <div className="mb-4 bg-purple-50 text-purple-800 p-3 rounded-lg text-sm flex items-start gap-2 border border-purple-100">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0"/>
                        <div>
                          <strong>Instructions:</strong> Paste your spreadsheet data below. One entry per line.
                          <div className="mt-1 font-mono text-xs opacity-75">
                            Expected Columns (Tabs): {ASSET_CONFIG[assetType].fields.map(f => `[${f.label}]`).join(' \t ')}
                          </div>
                        </div>
                     </div>
                     <textarea
                        className="w-full h-96 p-4 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none whitespace-pre"
                        value={bulkText} onChange={(e) => setBulkText(e.target.value)}
                     />
                     <div className="mt-4 flex justify-end">
                        <button onClick={parseBulkInput} disabled={!bulkText.trim()} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
                          Parse & Load Data
                        </button>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {offers.map((offer, index) => (
                        <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded">{offer.id}</span>
                              <span className="text-sm font-medium text-slate-500">Entry #{index + 1}</span>
                            </div>
                            <button onClick={() => handleDeleteOffer(offer.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                          </div>
                          
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {ASSET_CONFIG[assetType].fields.map((field) => (
                              <div key={field.id} className={field.type === 'textarea' ? 'col-span-1 md:col-span-2 h-32' : 'col-span-1'}>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-2">
                                  {field.label}
                                </label>
                                {field.type === 'textarea' ? (
                                  <textarea 
                                    className="w-full h-[calc(100%-1.75rem)] px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm resize-none focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                                    value={offer[field.id] || ''} 
                                    onChange={(e) => updateOffer(offer.id, field.id, e.target.value)}
                                  />
                                ) : (
                                  <input 
                                    type="text" 
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                                    value={offer[field.id] || ''} 
                                    onChange={(e) => updateOffer(offer.id, field.id, e.target.value)}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                    ))}
                  </div>
                )}
                 
                 <div className="flex justify-end pt-8 mt-4 border-t border-slate-200">
                    <button onClick={() => setActiveTab('results')} className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-slate-700 hover:scale-105 transition-all">
                      Next Step: Generation <ArrowRight size={18}/>
                    </button>
                 </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="max-w-6xl mx-auto pb-20">
                 <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xl font-bold text-slate-800">Generation Results</h2>
                      {Object.keys(results).length > 0 && (
                        <button onClick={exportCSV} className="text-slate-500 hover:text-purple-600 flex items-center gap-1 text-sm font-medium">
                          <Download size={16}/> CSV
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={runGeneration}
                      disabled={isProcessing || offers.length === 0}
                      className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold shadow-sm transition-all ${
                        isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 hover:shadow-md'
                      }`}
                    >
                      {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
                      {isProcessing ? 'Generating...' : 'Run Generation'}
                    </button>
                 </div>

                 {!Object.keys(results).length ? (
                   <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <Layout size={48} className="mb-4 opacity-50" />
                      <p className="text-lg font-medium">Ready to Generate</p>
                      <p className="text-sm">Click the button above to start.</p>
                   </div>
                 ) : (
                   <div className="space-y-8 animate-in fade-in duration-500">
                      {offers.map((offer, idx) => {
                        const result = results[offer.id];
                        if (!result) return null;
                        
                        const primaryFieldId = ASSET_CONFIG[assetType].fields[0].id;

                        return (
                          <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                                 <div className="flex items-center gap-2 mb-1">
                                   <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{offer.id}</span>
                                   <h3 className="font-bold text-slate-800 text-lg truncate">{offer[primaryFieldId] || `Entry #${idx+1}`}</h3>
                                 </div>
                            </div>

                            <div className="p-6">
                              {result.titles.length === 0 ? (
                                 <div className="text-red-500 text-sm italic">Generation failed or returned empty. Check API Key.</div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {result.titles.map((title, idx) => (
                                    <div key={idx} className="flex flex-col justify-between p-4 rounded-lg bg-white border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all group">
                                      <p className="text-slate-800 font-medium text-sm leading-snug mb-3 selection:bg-purple-100">{title}</p>
                                      <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${title.length > 75 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                          {title.length} chars
                                        </span>
                                        <div className="flex gap-2">
                                          <button className="text-slate-300 hover:text-purple-500 transition-colors" onClick={() => copyToClipboard(title)} title="Copy"><Save size={14}/></button>
                                          <span className="text-xs text-slate-300 font-bold">#{idx + 1}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      <div className="flex justify-center pt-8 pb-10">
                        <button onClick={() => setActiveTab('quality')} className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-700 hover:scale-105 transition-all">
                          Next: Configure & Run Quality Checks <ArrowRight size={20}/>
                        </button>
                      </div>
                   </div>
                 )}
              </div>
            )}

            {activeTab === 'quality' && (
              <div className="max-w-6xl mx-auto pb-20">
                 <div className="grid grid-cols-12 gap-8">
                   <div className="col-span-12 mb-8">
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                         <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div>
                              <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                <ShieldCheck size={20} className="text-emerald-500" /> 
                                Autorater Prompt
                              </h2>
                              <p className="text-xs text-slate-500">Configure how the AI evaluates your generated titles.</p>
                            </div>
                            <button 
                              onClick={runFullQualityCheck} disabled={isProcessing}
                              className={`bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2 shadow-sm transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isProcessing ? <RefreshCw className="animate-spin" size={18}/> : <Play size={18} fill="currentColor"/>}
                              {isProcessing ? 'Evaluating...' : 'Run Evaluation'}
                            </button>
                         </div>
                         <textarea 
                            className="w-full h-48 p-5 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed"
                            value={evalPrompt} onChange={(e) => setEvalPrompt(e.target.value)} spellCheck={false}
                          />
                          <div className="px-5 py-2 bg-slate-50 text-xs text-slate-400 border-t border-slate-100 font-mono flex gap-2 overflow-x-auto whitespace-nowrap">
                            <span>Available Vars:</span>
                            <span className="bg-slate-200 px-1 rounded text-slate-600">{`{{titles_list}}`}</span>
                            {ASSET_CONFIG[assetType].fields.map(f => (
                               <span key={f.id} className="bg-slate-200 px-1 rounded text-slate-600">{`{{${f.id}}}`}</span>
                            ))}
                          </div>
                      </div>
                   </div>

                   <div className="col-span-12 space-y-8">
                      {Object.keys(results).length === 0 ? (
                         <div className="text-center text-slate-400 py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            Generate assets first before running evaluation.
                         </div>
                      ) : (
                        offers.map((offer, idx) => {
                          const result = results[offer.id];
                          if (!result || !result.titles || result.titles.length === 0) return null;
                          const primaryFieldId = ASSET_CONFIG[assetType].fields[0].id;

                          return (
                             <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-500">
                                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                                   <span className="font-bold text-slate-700 truncate max-w-lg">{offer[primaryFieldId] || `Entry #${idx+1}`}</span>
                                   <div className="flex items-center gap-3">
                                     {assetType === 'pla_titles' && (
                                       <button onClick={() => setSimulationOffer(offer)} className="flex items-center gap-1 text-sm bg-white border border-slate-300 px-3 py-1 rounded shadow-sm hover:bg-slate-50 hover:border-purple-300 hover:text-purple-600 transition-all font-medium text-slate-600">
                                         <Smartphone size={14}/> Simulation
                                       </button>
                                     )}
                                     <span className={`text-xs font-bold px-2 py-1 rounded border ${result.evaluation ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                        {result.evaluation ? 'Evaluated' : 'Pending Check'}
                                     </span>
                                   </div>
                                </div>
                                <div className="p-6">
                                   {result.evaluation ? (
                                     <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                                        <MarkdownTable content={result.evaluation} />
                                     </div>
                                   ) : (
                                     <div className="text-center py-8 text-slate-400 flex flex-col items-center">
                                        <ShieldCheck size={32} className="mb-2 opacity-20"/>
                                        <p>Ready to analyze {result.titles.length} variants.</p>
                                     </div>
                                   )}
                                </div>
                             </div>
                          )
                        })
                      )}
                   </div>
                 </div>
              </div>
            )}
          </div>
        )}
      </main>

      {simulationOffer && results[simulationOffer.id] && assetType === 'pla_titles' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden transform scale-100">
             
             <div className="p-4 border-b flex items-center gap-4 bg-white shrink-0">
                <div className="w-full bg-slate-100 rounded-full px-5 py-3 flex items-center border border-slate-200 shadow-inner">
                   <Search size={20} className="text-blue-500 mr-3 shrink-0"/>
                   <span className="text-slate-800 text-lg flex-1 truncate">{simulationOffer.user_query || "Search for a product..."}</span>
                </div>
                <button onClick={() => setSimulationOffer(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors shrink-0"><X size={24}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto bg-slate-50 p-6 relative">
                <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-1">Sponsored <span className="w-1 h-1 bg-slate-400 rounded-full inline-block"></span> Search Results</p>
                <div className="flex gap-4 overflow-x-auto pb-6 snap-x">
                   {results[simulationOffer.id].titles.map((title, idx) => {
                     const merchantName = extractDomain(simulationOffer.landing_page);
                     const mockPrice = `$${(19 + (idx * 23) % 180).toFixed(2)}`;
                     return (
                       <div key={idx} className="flex flex-col w-40 sm:w-48 bg-white overflow-hidden shrink-0 cursor-pointer group snap-start border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all">
                         <div className="w-full aspect-square bg-slate-100 flex items-center justify-center border-b border-slate-100 group-hover:bg-slate-50 transition-colors">
                           <ImageIcon size={32} className="text-slate-300" />
                         </div>
                         <div className="p-3 space-y-1">
                           <h4 className="text-[13px] leading-snug text-blue-700 group-hover:underline line-clamp-3 h-[58px]" title={title}>{title}</h4>
                           <div className="text-[15px] font-bold text-slate-900 pt-1">{mockPrice}</div>
                           <div className="text-[11px] text-slate-500 truncate" title={merchantName}>{merchantName}</div>
                           <div className="text-[10px] text-green-700 font-medium">Free shipping</div>
                         </div>
                       </div>
                     );
                   })}
                   <div className="flex flex-col w-40 sm:w-48 bg-white overflow-hidden shrink-0 cursor-pointer group snap-start border border-slate-200 rounded-lg opacity-60">
                     <div className="w-full aspect-square bg-slate-100 flex items-center justify-center border-b border-slate-100"><ImageIcon size={32} className="text-slate-300" /></div>
                     <div className="p-3 space-y-1">
                       <h4 className="text-[13px] leading-snug text-blue-700 line-clamp-3 h-[58px]">Competitor Alternative Product</h4>
                       <div className="text-[15px] font-bold text-slate-900 pt-1">$45.99</div>
                       <div className="text-[11px] text-slate-500 truncate">competitor.com</div>
                     </div>
                   </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-6 space-y-6">
                  {[1, 2].map(i => (
                    <div key={i} className="max-w-2xl">
                      <div className="text-[12px] text-slate-600 truncate mb-1">https://www.example.com › category › item</div>
                      <div className="text-lg text-blue-700 hover:underline cursor-pointer leading-tight mb-1">Learn more about {simulationOffer.user_query || 'this product'}</div>
                      <div className="text-sm text-slate-600 line-clamp-2">This is a simulated organic search result showing how standard links appear beneath the sponsored Product Listing Ads carousel...</div>
                    </div>
                  ))}
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
