import OpenAI from "openai";
import type { Business } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || process.env.API_KEY 
});

interface ComplianceCheck {
  gdpr: boolean;
  ccpa: boolean;
  dpdp: boolean;
}

interface GeneratedDocumentResponse {
  content: string;
  compliance: ComplianceCheck;
  recommendations: string[];
}

export async function generateLegalDocument(
  business: Business,
  documentType: 'privacy_policy' | 'terms_of_service'
): Promise<GeneratedDocumentResponse> {
  if (!openai.apiKey) {
    throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.");
  }

  const prompt = createPrompt(business, documentType);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a legal document generator AI specializing in privacy policies and terms of service for startups. You must generate legally compliant documents based on the provided business information. Always respond in JSON format with the exact structure requested.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent legal content
      max_tokens: 4000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate the response structure
    if (!result.content || !result.compliance || !result.recommendations) {
      throw new Error("Invalid response structure from OpenAI");
    }

    return {
      content: result.content,
      compliance: {
        gdpr: result.compliance.gdpr || false,
        ccpa: result.compliance.ccpa || false,
        dpdp: result.compliance.dpdp || false
      },
      recommendations: result.recommendations || []
    };

  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate ${documentType}: ${error.message}`);
  }
}

function createPrompt(business: Business, documentType: string): string {
  const businessInfo = {
    name: business.name,
    website: business.website,
    businessType: business.businessType,
    jurisdictions: business.jurisdictions,
    dataPractices: business.dataPractices
  };

  const basePrompt = `
Generate a comprehensive ${documentType.replace('_', ' ')} for the following business:

Business Information:
- Company Name: ${businessInfo.name}
- Website: ${businessInfo.website || 'Not provided'}
- Business Type: ${businessInfo.businessType}
- Operating Jurisdictions: ${businessInfo.jurisdictions?.join(', ') || 'Not specified'}
- Data Practices: ${JSON.stringify(businessInfo.dataPractices || {})}

Requirements:
1. The document must be legally compliant for the specified jurisdictions
2. Include specific clauses for the business type and data practices
3. Use clear, professional language suitable for a startup
4. Include all necessary legal disclaimers and user rights
5. Address data collection, processing, storage, and sharing practices
6. Include contact information sections using the provided business details

Jurisdiction-specific requirements:
${businessInfo.jurisdictions?.includes('gdpr') ? '- GDPR compliance: Include right to access, rectification, erasure, data portability, and consent withdrawal' : ''}
${businessInfo.jurisdictions?.includes('ccpa') ? '- CCPA compliance: Include California resident rights, opt-out mechanisms, and non-discrimination clauses' : ''}
${businessInfo.jurisdictions?.includes('dpdp') ? '- DPDP Act compliance: Include India-specific data processing rights and consent mechanisms' : ''}

Document Type Specific Requirements:
${documentType === 'privacy_policy' ? `
Privacy Policy must include:
- Data collection practices
- Purpose of data processing
- Legal basis for processing
- Data sharing and third-party services
- Data retention periods
- User rights and how to exercise them
- Contact information for privacy concerns
- Cookie policy (if applicable)
- International data transfers
- Changes to privacy policy
` : `
Terms of Service must include:
- Service description and acceptable use
- User responsibilities and prohibited activities
- Intellectual property rights
- Payment terms (if applicable)
- Service availability and modifications
- Limitation of liability
- Dispute resolution and governing law
- Termination conditions
- Contact information for legal matters
`}

Please respond with a JSON object in the following format:
{
  "content": "The complete legal document in HTML format with proper headings, paragraphs, and lists",
  "compliance": {
    "gdpr": boolean,
    "ccpa": boolean,
    "dpdp": boolean
  },
  "recommendations": ["Array of recommendations for improving compliance or legal protection"]
}

Ensure the content is comprehensive, legally sound, and tailored to the specific business and jurisdictions provided.
`;

  return basePrompt;
}

// Helper function to validate compliance for specific jurisdictions
export function validateCompliance(
  business: Business,
  documentContent: string
): ComplianceCheck {
  const jurisdictions = business.jurisdictions || [];
  
  return {
    gdpr: jurisdictions.includes('gdpr') && documentContent.includes('right to rectification'),
    ccpa: jurisdictions.includes('ccpa') && documentContent.includes('California residents'),
    dpdp: jurisdictions.includes('dpdp') && documentContent.includes('Digital Personal Data Protection')
  };
}

// Helper function to generate compliance recommendations
export function generateComplianceRecommendations(
  business: Business,
  compliance: ComplianceCheck
): string[] {
  const recommendations: string[] = [];
  const jurisdictions = business.jurisdictions || [];

  if (jurisdictions.includes('gdpr') && !compliance.gdpr) {
    recommendations.push("Add explicit GDPR compliance sections including user rights and consent mechanisms");
  }

  if (jurisdictions.includes('ccpa') && !compliance.ccpa) {
    recommendations.push("Include CCPA-specific language for California residents' privacy rights");
  }

  if (jurisdictions.includes('dpdp') && !compliance.dpdp) {
    recommendations.push("Add India DPDP Act compliance clauses for data processing transparency");
  }

  if (business.dataPractices && (business.dataPractices as any).collectsPaymentData) {
    recommendations.push("Ensure PCI DSS compliance sections are included for payment data processing");
  }

  if (business.dataPractices && (business.dataPractices as any).sharesDataWithThirdParties) {
    recommendations.push("Include comprehensive third-party data sharing disclosure");
  }

  if (!business.website) {
    recommendations.push("Add website URL to business information for complete legal documentation");
  }

  return recommendations;
}
