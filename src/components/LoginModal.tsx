
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Briefcase, Mail, Lock } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userType: 'farmer' | 'executive';
  lang: string;
  t: (key: string) => string;
}

export function LoginModal({ open, setOpen, userType, lang, t }: LoginModalProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    
    // Simulate loading
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login successful",
        description: `Welcome back ${userType === 'farmer' ? 'farmer' : 'executive'}!`,
      });
      setOpen(false);
      setEmail('');
      setPassword('');
      
      // Route based on user type
      if (userType === 'executive') {
        navigate('/executive-dashboard');
      } else {
        navigate('/dashboard');
      }
    }, 1500);
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
            {userType === 'farmer' ? 'Farmer Login' : 'Executive Login'}
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to access your {userType} account
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" className="rounded text-primary focus:ring-primary" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-primary hover:underline">Forgot password?</a>
          </div>
          
          <Button 
            type="submit" 
            className={`w-full ${userType === 'farmer' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-foliage hover:bg-foliage-dark'}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <a href="#" className="text-primary hover:underline">Register now</a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
