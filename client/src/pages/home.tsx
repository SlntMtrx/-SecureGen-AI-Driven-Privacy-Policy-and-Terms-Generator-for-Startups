import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { PricingSection } from "@/components/pricing-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Clock, Headphones } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      
      {/* Compliance Section */}
      <section id="compliance" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Built for Global Compliance</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay ahead of changing privacy laws with documents that meet the most stringent global compliance requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center p-6 bg-gray-50">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">GDPR</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Full compliance with European Union's General Data Protection Regulation for all EU users.
                </p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Compliant
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-gray-50">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">CCPA</h3>
                <p className="text-gray-600 text-sm mb-4">
                  California Consumer Privacy Act compliance for businesses serving California residents.
                </p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Compliant
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-gray-50">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">DPDP Act</h3>
                <p className="text-gray-600 text-sm mb-4">
                  India's Digital Personal Data Protection Act compliance for the growing Indian market.
                </p>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  New Support
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <Card className="bg-gray-50 p-8">
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-900">500+</div>
                  <div className="text-sm text-gray-600">Documents Generated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">15+</div>
                  <div className="text-sm text-gray-600">Jurisdictions Supported</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime Guarantee</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">24/7</div>
                  <div className="text-sm text-gray-600">Legal Support</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <PricingSection />

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">SecureGen</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered legal document generation for modern startups. Stay compliant, save time, and focus on building your business.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Document Generator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance Check</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal Review</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 SecureGen. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
