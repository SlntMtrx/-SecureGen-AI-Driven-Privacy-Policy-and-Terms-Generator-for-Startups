import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Clock, Shield, Check, AlertCircle } from "lucide-react";
import type { Document } from "@shared/schema";
import type { GeneratedDocument } from "@/lib/types";

interface DocumentPreviewProps {
  document?: Document;
  generatedContent?: GeneratedDocument;
  isGenerating?: boolean;
}

export function DocumentPreview({ document, generatedContent, isGenerating }: DocumentPreviewProps) {
  const [activeTab, setActiveTab] = useState("privacy_policy");

  const handleDownload = async (format: string) => {
    if (!document) return;
    
    try {
      const response = await fetch(`/api/documents/${document.id}/download/${format}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${document.title}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const renderComplianceStatus = () => {
    const compliance = generatedContent?.compliance || { gdpr: false, ccpa: false, dpdp: false };
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Compliance Status</h4>
        <div className="space-y-2">
          {Object.entries(compliance).map(([key, isCompliant]) => (
            <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">
                {key.toUpperCase()} Compliance
              </span>
              {isCompliant ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="text-center text-gray-500 py-12">
      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p className="text-sm mb-2">Complete the form to see your document preview</p>
      <p className="text-xs text-gray-400">
        AI will generate compliant legal documents based on your business information
      </p>
    </div>
  );

  const renderGeneratingState = () => (
    <div className="text-center text-gray-500 py-12">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-sm mb-2">Generating your legal documents...</p>
      <p className="text-xs text-gray-400">This may take 1-2 minutes</p>
    </div>
  );

  const renderDocumentContent = () => {
    const content = document?.content || generatedContent?.content;
    if (!content) return renderEmptyState();

    return (
      <div className="prose prose-sm max-w-none">
        <div 
          className="text-sm leading-relaxed text-gray-700"
          dangerouslySetInnerHTML={{ __html: content.substring(0, 500) + "..." }}
        />
        {content.length > 500 && (
          <p className="text-xs text-gray-500 mt-4">
            Preview showing first 500 characters. Full document available after generation.
          </p>
        )}
      </div>
    );
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Document Preview</CardTitle>
        <p className="text-sm text-gray-600">Live preview of your generated documents</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="privacy_policy" className="text-xs">
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="terms_of_service" className="text-xs">
              Terms of Service
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-64">
              {isGenerating ? renderGeneratingState() : renderDocumentContent()}
            </div>
          </TabsContent>
        </Tabs>

        {renderComplianceStatus()}

        {document && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Download Options</h4>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownload('txt')}
                className="flex-1"
              >
                <Download className="w-3 h-3 mr-1" />
                TXT
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownload('html')}
                className="flex-1"
              >
                <Download className="w-3 h-3 mr-1" />
                HTML
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownload('json')}
                className="flex-1"
              >
                <Download className="w-3 h-3 mr-1" />
                JSON
              </Button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-blue-500 mr-2" />
            <span className="text-sm text-blue-700">
              Estimated generation time: 2-3 minutes
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
