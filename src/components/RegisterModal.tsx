
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle, Briefcase, Mail, Lock, User, Phone } from "lucide-react";

interface RegisterModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userType: 'farmer' | 'executive';
  lang: string;
  t: (key: string) => string;
}

export function RegisterModal({ open, setOpen, userType, lang, t }: RegisterModalProps) {
  const { toast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      // Use AuthContext register method
      await register({
        name,
        email,
        password,
        phone,
        role: userType
      });

      setOpen(false);

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');

      // Route based on user type
      if (userType === 'executive') {
        navigate('/executive-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {userType === 'farmer' ? (
              <UserCircle className="h-5 w-5 text-blue-500" />
            ) : (
              <Briefcase className="h-5 w-5 text-foliage" />
            )}
            {userType === 'farmer' ? 'Farmer Registration' : 'Executive Registration'}
          </DialogTitle>
          <DialogDescription>
            Create an account to access our {userType} services
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Full Name"
                className="pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="email"
                placeholder="Email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="tel"
                placeholder="Phone Number"
                className="pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="password"
                placeholder="Confirm Password"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="terms" 
              className="rounded text-primary focus:ring-primary"
              required 
            />
            <label htmlFor="terms" className="text-sm">
              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </label>
          </div>
          
          <Button 
            type="submit" 
            className={`w-full ${userType === 'farmer' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-foliage hover:bg-foliage-dark'}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          
          <div className="text-center text-sm">
            Already have an account?{' '}
            <a href="#" className="text-primary hover:underline">Login instead</a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
