import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Save, Download, History, FileText } from "lucide-react";
import { Link } from "wouter";
import type { Document, DocumentVersion } from "@shared/schema";

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [changelog, setChangelog] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: document, isLoading } = useQuery<Document>({
    queryKey: [`/api/documents/${id}`],
    enabled: !!id
  });

  const { data: versions } = useQuery<DocumentVersion[]>({
    queryKey: [`/api/documents/${id}/versions`],
    enabled: !!id
  });

  const updateDocumentMutation = useMutation({
    mutationFn: async ({ content, changelog }: { content: string; changelog: string }) => {
      const response = await apiRequest('PUT', `/api/documents/${id}`, {
        content,
        changelog
      });
      return response.json();
    },
    onSuccess: () => {
      setIsEditing(false);
      setChangelog("");
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${id}/versions`] });
      toast({
        title: "Success",
        description: "Document updated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive"
      });
    }
  });

  const handleEdit = () => {
    setEditContent(document?.content || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!changelog.trim()) {
      toast({
        title: "Changelog Required",
        description: "Please provide a description of your changes",
        variant: "destructive"
      });
      return;
    }
    updateDocumentMutation.mutate({ content: editContent, changelog });
  };

  const handleDownload = async (format: string) => {
    try {
      const response = await fetch(`/api/documents/${id}/download/${format}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${document?.title}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Document not found</h2>
            <p className="text-gray-600 mb-4">The document you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/generator">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{document.title}</h1>
                <p className="text-sm text-gray-600">
                  Created {new Date(document.createdAt).toLocaleDateString()} • 
                  Version {document.version}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={document.status === 'published' ? 'default' : 'secondary'}>
                {document.status}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={isEditing}
              >
                {isEditing ? 'Editing...' : 'Edit'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('html')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Document Content</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-96 font-mono text-sm"
                      placeholder="Document content..."
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Changelog (required)
                      </label>
                      <Textarea
                        value={changelog}
                        onChange={(e) => setChangelog(e.target.value)}
                        placeholder="Describe what you changed..."
                        className="text-sm"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSave}
                        disabled={updateDocumentMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateDocumentMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: document.content }}
                      className="text-gray-700 leading-relaxed"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Download Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleDownload('txt')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download as TXT
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleDownload('html')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download as HTML
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleDownload('json')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download as JSON
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <History className="w-4 h-4 mr-2" />
                  Version History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {versions && versions.length > 0 ? (
                  <div className="space-y-3">
                    {versions.map((version) => (
                      <div key={version.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            Version {version.version}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(version.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {version.changelog && (
                          <p className="text-xs text-gray-600">{version.changelog}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No version history available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
