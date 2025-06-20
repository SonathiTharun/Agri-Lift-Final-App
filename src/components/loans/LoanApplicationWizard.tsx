import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  MapPin, 
  Banknote, 
  FileText, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Phone,
  Mail,
  Calendar,
  Building
} from "lucide-react";
import { GlassCard } from "@/components/market/GlassCard";

interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // Loan Details
  loanType: string;
  loanAmount: string;
  loanPurpose: string;
  tenure: string;
  
  // Financial Info
  monthlyIncome: string;
  existingLoans: string;
  landArea: string;
  
  // Documents
  documents: string[];
  
  // Consent
  termsAccepted: boolean;
  dataConsent: boolean;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  loanType: '',
  loanAmount: '',
  loanPurpose: '',
  tenure: '',
  monthlyIncome: '',
  existingLoans: '',
  landArea: '',
  documents: [],
  termsAccepted: false,
  dataConsent: false
};

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Address', icon: MapPin },
  { id: 3, title: 'Loan Details', icon: Banknote },
  { id: 4, title: 'Documents', icon: FileText },
  { id: 5, title: 'Review', icon: CheckCircle }
];

export const LoanApplicationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    // Handle success
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Apply for Agricultural Loan</h2>
        <p className="text-gray-600">Complete the application in simple steps</p>
      </div>

      {/* Progress Bar */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                ${currentStep >= step.id 
                  ? 'bg-foliage border-foliage text-white' 
                  : 'border-gray-300 text-gray-400'
                }
              `}>
                <step.icon className="h-5 w-5" />
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-0.5 mx-2 transition-all
                  ${currentStep > step.id ? 'bg-foliage' : 'bg-gray-300'}
                `} />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Step {currentStep} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </GlassCard>

      {/* Form Content */}
      <GlassCard className="p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-foliage" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Address */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-foliage" />
                  Address Details
                </CardTitle>
              </CardHeader>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    placeholder="House/Plot No., Street, Area"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      placeholder="Enter your city"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => updateFormData('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => updateFormData('pincode', e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Loan Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-foliage" />
                  Loan Requirements
                </CardTitle>
              </CardHeader>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="loanType">Loan Type *</Label>
                  <Select value={formData.loanType} onValueChange={(value) => updateFormData('loanType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crop-loan">Crop Loan</SelectItem>
                      <SelectItem value="equipment-loan">Equipment Loan</SelectItem>
                      <SelectItem value="land-loan">Land Purchase</SelectItem>
                      <SelectItem value="working-capital">Working Capital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount *</Label>
                  <Input
                    id="loanAmount"
                    value={formData.loanAmount}
                    onChange={(e) => updateFormData('loanAmount', e.target.value)}
                    placeholder="₹ 5,00,000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tenure">Loan Tenure *</Label>
                  <Select value={formData.tenure} onValueChange={(value) => updateFormData('tenure', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tenure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="2">2 Years</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                      <SelectItem value="7">7 Years</SelectItem>
                      <SelectItem value="10">10 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                  <Input
                    id="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={(e) => updateFormData('monthlyIncome', e.target.value)}
                    placeholder="₹ 50,000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="landArea">Land Area (in acres)</Label>
                  <Input
                    id="landArea"
                    value={formData.landArea}
                    onChange={(e) => updateFormData('landArea', e.target.value)}
                    placeholder="10 acres"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loanPurpose">Loan Purpose *</Label>
                  <Input
                    id="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={(e) => updateFormData('loanPurpose', e.target.value)}
                    placeholder="Describe the purpose"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 bg-foliage hover:bg-foliage-dark"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-foliage hover:bg-foliage-dark"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
};
