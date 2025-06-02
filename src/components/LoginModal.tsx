
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "./LanguageContext";
import { Eye, EyeOff, User, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'farmer' | 'executive'>('farmer');
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock authentication logic
      if (userType === 'executive' && email.includes('admin')) {
        toast({
          title: "Login Successful",
          description: "Welcome to AgriLift Executive Portal!",
        });
        onClose();
        navigate('/executive-dashboard');
      } else if (userType === 'farmer') {
        toast({
          title: "Login Successful", 
          description: "Welcome to AgriLift!",
        });
        onSuccess();
        onClose();
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials for selected user type');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type: 'farmer' | 'executive') => {
    setUserType(type);
    if (type === 'executive') {
      setEmail('admin@agrilift.com');
      setPassword('admin123');
    } else {
      setEmail('farmer@example.com');  
      setPassword('farmer123');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center animate-fade-in">
            {t('login')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 animate-fade-in">
          {/* User Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Login As:</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={userType === 'farmer' ? 'default' : 'outline'}
                onClick={() => setUserType('farmer')}
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <User className="h-4 w-4" />
                Farmer
              </Button>
              <Button
                type="button"
                variant={userType === 'executive' ? 'default' : 'outline'}
                onClick={() => setUserType('executive')}
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Shield className="h-4 w-4" />
                Executive
              </Button>
            </div>
          </div>

          {/* Demo Login Buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Demo Login:</Label>
            <div className="grid grid-cols-1 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('farmer')}
                className="text-sm hover:scale-105 transition-transform"
                disabled={isLoading}
              >
                Demo Farmer Login
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('executive')}
                className="text-sm hover:scale-105 transition-transform"
                disabled={isLoading}
              >
                Demo Executive Login
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={userType === 'executive' ? "admin@agrilift.com" : "farmer@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all focus:scale-105"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 transition-all focus:scale-105"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full hover:scale-105 transition-transform" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </div>
              ) : (
                t('login')
              )}
            </Button>
          </form>

          {userType === 'executive' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg animate-slide-in">
              <p className="text-sm text-blue-800">
                <strong>Executive Access:</strong> Use admin credentials to access the executive portal with full platform management capabilities.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
