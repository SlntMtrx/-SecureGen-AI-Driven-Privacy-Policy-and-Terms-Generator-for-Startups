import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BusinessInfoForm } from "@/components/business-info-form";
import { DocumentPreview } from "@/components/document-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BusinessFormData, GeneratedDocument } from "@/lib/types";
import type { Document, Business } from "@shared/schema";
import { ArrowLeft, FileText, Download, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Generator() {
  const [currentStep, setCurrentStep] = useState<'form' | 'generating' | 'complete'>('form');
  const [business, setBusiness] = useState<Business | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedDocument | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBusinessMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      const response = await apiRequest('POST', '/api/businesses', {
        userId: 1, // In a real app, this would come from authentication
        ...data
      });
      return response.json();
    },
    onSuccess: (business) => {
      setBusiness(business);
      generateDocuments(business.id);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save business information",
        variant: "destructive"
      });
    }
  });

  const generateDocumentsMutation = useMutation({
    mutationFn: async (businessId: number) => {
      const privacyResponse = await apiRequest('POST', '/api/documents/generate', {
        businessId,
        documentType: 'privacy_policy'
      });
      const privacyResult = await privacyResponse.json();

      const termsResponse = await apiRequest('POST', '/api/documents/generate', {
        businessId,
        documentType: 'terms_of_service'
      });
      const termsResult = await termsResponse.json();

      return {
        privacy: privacyResult,
        terms: termsResult
      };
    },
    onSuccess: (results) => {
      setDocuments([results.privacy.document, results.terms.document]);
      setGeneratedContent(results.privacy.generatedContent);
      setCurrentStep('complete');
      toast({
        title: "Success!",
        description: "Your legal documents have been generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate documents. Please try again.",
        variant: "destructive"
      });
      setCurrentStep('form');
    }
  });

  const handleFormSubmit = (data: BusinessFormData) => {
    setCurrentStep('generating');
    createBusinessMutation.mutate(data);
  };

  const generateDocuments = (businessId: number) => {
    generateDocumentsMutation.mutate(businessId);
  };

  const renderFormStep = () => (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <BusinessInfoForm 
          onSubmit={handleFormSubmit}
          isLoading={createBusinessMutation.isPending}
        />
      </div>
      <div className="lg:col-span-1">
        <DocumentPreview />
      </div>
    </div>
  );

  const renderGeneratingStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <Card>
        <CardContent className="pt-12 pb-12">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Generating Your Legal Documents
          </h2>
          <p className="text-gray-600 mb-6">
            Our AI is analyzing your business information and creating compliant legal documents.
            This process typically takes 2-3 minutes.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Business information processed
            </div>
            <div className="flex items-center justify-center">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
              Generating privacy policy...
            </div>
            <div className="flex items-center justify-center text-gray-400">
              <div className="w-4 h-4 mr-2"></div>
              Generating terms of service...
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-slate-900 mb-2">
                Documents Generated Successfully!
              </CardTitle>
              <p className="text-gray-600">
                Your legal documents are ready. Review, download, or make edits as needed.
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                {doc.title}
              </CardTitle>
              <p className="text-sm text-gray-600">
                Generated {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-700 line-clamp-3">
                  {doc.content.substring(0, 200)}...
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-3 h-3 mr-2" />
                    Download
                  </Button>
                  <Link href={`/documents/${doc.id}`}>
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit
                    </Button>
                  </Link>
                </div>
                
                {generatedContent && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">Compliance:</p>
                    <div className="flex space-x-2">
                      {Object.entries(generatedContent.compliance).map(([key, compliant]) => (
                        <Badge 
                          key={key} 
                          variant={compliant ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {key.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline" className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <Button onClick={() => setCurrentStep('form')}>
          Generate More Documents
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Generate Your Legal Documents
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answer a few questions about your business, and our AI will generate compliant 
            legal documents tailored to your needs.
          </p>
        </div>

        {currentStep === 'form' && renderFormStep()}
        {currentStep === 'generating' && renderGeneratingStep()}
        {currentStep === 'complete' && renderCompleteStep()}
      </div>
    </div>
  );
}
