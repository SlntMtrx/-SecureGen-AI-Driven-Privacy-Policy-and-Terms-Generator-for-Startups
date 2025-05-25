import { Card, CardContent } from "@/components/ui/card";
import { Bot, RefreshCw, Globe, Download, History, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Generation",
    description: "Advanced AI analyzes your business model and generates tailored legal documents that match your specific needs and compliance requirements."
  },
  {
    icon: RefreshCw,
    title: "Automatic Updates",
    description: "Stay compliant as laws change. Our semantic diff engine automatically updates your documents when new regulations are introduced."
  },
  {
    icon: Globe,
    title: "Multi-Jurisdiction",
    description: "Generate compliant documents for GDPR, CCPA, DPDP, and other major privacy frameworks with localized translations."
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Download your documents in PDF, HTML, or plain text. Embed them directly on your website or host on our secure platform."
  },
  {
    icon: History,
    title: "Version Control",
    description: "Track changes, maintain document history, and roll back to previous versions. Perfect for audit trails and compliance reporting."
  },
  {
    icon: ShieldCheck,
    title: "Lawyer Reviewed",
    description: "All templates are reviewed by qualified legal professionals. Get enterprise-grade legal documents at startup-friendly prices."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose SecureGen?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Built for modern startups who need compliant legal documents without the complexity and cost of traditional legal services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
