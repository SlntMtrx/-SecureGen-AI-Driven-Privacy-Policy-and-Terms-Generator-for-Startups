import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "per document set",
    features: [
      { text: "Privacy Policy + Terms of Service", included: true },
      { text: "1 jurisdiction (GDPR, CCPA, or DPDP)", included: true },
      { text: "PDF and HTML download", included: true },
      { text: "Basic document hosting", included: true },
      { text: "Auto-updates", included: false }
    ],
    cta: "Get Started",
    variant: "outline" as const
  },
  {
    name: "Professional",
    price: "$79",
    period: "per document set",
    popular: true,
    features: [
      { text: "Complete legal document suite", included: true },
      { text: "All jurisdictions (GDPR, CCPA, DPDP)", included: true },
      { text: "Multiple format downloads", included: true },
      { text: "Custom domain hosting", included: true },
      { text: "Automatic updates for 1 year", included: true },
      { text: "Priority support", included: true }
    ],
    cta: "Start Free Trial",
    variant: "default" as const
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    features: [
      { text: "Unlimited document generation", included: true },
      { text: "White-label hosting", included: true },
      { text: "API access", included: true },
      { text: "Legal review service", included: true },
      { text: "Dedicated account manager", included: true }
    ],
    cta: "Contact Sales",
    variant: "outline" as const
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your business needs. No hidden fees, no long-term contracts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-2 border-primary shadow-lg' : 'border border-gray-200 shadow-sm'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-xl font-semibold text-slate-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="text-3xl font-bold text-slate-900 mb-1">{plan.price}</div>
                <div className="text-sm text-gray-600">{plan.period}</div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-gray-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.variant}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
