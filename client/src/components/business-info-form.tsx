import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Save } from "lucide-react";
import { BUSINESS_TYPES, JURISDICTIONS } from "@/lib/types";
import type { BusinessFormData } from "@/lib/types";

const step1Schema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  businessType: z.enum(['saas', 'ecommerce', 'mobile', 'other']),
  jurisdictions: z.array(z.string()).min(1, "Select at least one jurisdiction")
});

const step2Schema = z.object({
  collectsPersonalData: z.boolean(),
  collectsPaymentData: z.boolean(),
  usesCookies: z.boolean(),
  sharesDataWithThirdParties: z.boolean(),
  dataRetentionPeriod: z.string().min(1, "Data retention period is required"),
  userRights: z.array(z.string())
});

interface BusinessInfoFormProps {
  onSubmit: (data: BusinessFormData) => void;
  isLoading?: boolean;
}

export function BusinessInfoForm({ onSubmit, isLoading }: BusinessInfoFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<any>(null);

  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: "",
      website: "",
      businessType: "saas" as const,
      jurisdictions: []
    }
  });

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      collectsPersonalData: true,
      collectsPaymentData: false,
      usesCookies: true,
      sharesDataWithThirdParties: false,
      dataRetentionPeriod: "",
      userRights: []
    }
  });

  const handleStep1Submit = (data: any) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: any) => {
    const formData: BusinessFormData = {
      ...step1Data,
      dataPractices: data
    };
    onSubmit(formData);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <span className={`ml-2 text-sm font-medium ${
            currentStep >= 1 ? 'text-primary' : 'text-gray-500'
          }`}>
            Business Info
          </span>
        </div>
        <div className="w-8 border-t border-gray-300"></div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <span className={`ml-2 text-sm ${
            currentStep >= 2 ? 'text-primary font-medium' : 'text-gray-500'
          }`}>
            Data Practices
          </span>
        </div>
        <div className="w-8 border-t border-gray-300"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
            3
          </div>
          <span className="ml-2 text-sm text-gray-500">Review & Generate</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        {renderStepIndicator()}
      </CardHeader>
      
      <CardContent>
        {currentStep === 1 && (
          <Form {...step1Form}>
            <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Tell us about your business</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={step1Form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={step1Form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourcompany.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={step1Form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        <div className="grid md:grid-cols-2 gap-3">
                          {BUSINESS_TYPES.map((type) => (
                            <label
                              key={type.value}
                              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <RadioGroupItem value={type.value} className="mr-3" />
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <i className={`${type.icon} text-primary mr-2`}></i>
                                  <span className="font-medium">{type.label}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="jurisdictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating Jurisdictions</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {JURISDICTIONS.map((jurisdiction) => (
                          <label
                            key={jurisdiction.value}
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={field.value?.includes(jurisdiction.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, jurisdiction.value]);
                                } else {
                                  field.onChange(field.value?.filter((v) => v !== jurisdiction.value));
                                }
                              }}
                              className="mr-3"
                            />
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <span className="font-medium">{jurisdiction.label}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {jurisdiction.badge}
                                </Badge>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button type="button" variant="ghost" className="text-gray-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Continue to Data Practices
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {currentStep === 2 && (
          <Form {...step2Form}>
            <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Data Collection & Practices</h3>
                <div className="space-y-4">
                  <FormField
                    control={step2Form.control}
                    name="collectsPersonalData"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          We collect personal data (names, emails, etc.)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={step2Form.control}
                    name="collectsPaymentData"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          We process payment information
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={step2Form.control}
                    name="usesCookies"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          We use cookies and tracking technologies
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={step2Form.control}
                    name="sharesDataWithThirdParties"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          We share data with third-party services
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={step2Form.control}
                name="dataRetentionPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How long do you retain user data?</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 2 years after account deletion" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Business Info
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate Documents"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
