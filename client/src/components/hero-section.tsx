import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Check, Clock, FolderSync, Play, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary/5 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <Check className="w-3 h-3 mr-1" />
                GDPR, CCPA & DPDP Compliant
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              AI-Generated Legal Documents for{" "}
              <span className="text-primary">Modern Startups</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Stop copying legal templates. Generate tailored privacy policies, terms of service, 
              and compliance documents using AI, automatically updated as laws change.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/generator">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transform hover:scale-105 transition-all shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Documents Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span>Lawyer-reviewed templates</span>
              </div>
              <div className="flex items-center">
                <FolderSync className="w-4 h-4 mr-2" />
                <span>Auto-updates</span>
              </div>
            </div>
          </div>
          
          <div className="lg:ml-8">
            <Card className="rounded-2xl shadow-2xl border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-xs text-gray-500">Privacy Policy Generator</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <span className="text-sm font-medium text-primary">Business Type: SaaS Platform</span>
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-700">Jurisdiction: EU, US, India</span>
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Sparkles className="w-4 h-4 text-primary mr-2" />
                      <span className="text-sm font-medium">AI Generating...</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-3/4 transition-all duration-1000"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
