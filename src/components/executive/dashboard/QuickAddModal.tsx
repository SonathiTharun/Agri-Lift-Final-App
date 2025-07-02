import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ open, onClose }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', role: 'farmer', phone: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1200));
      toast({ title: 'User Added', description: `${form.role === 'farmer' ? 'Farmer' : 'Executive'} ${form.name} added successfully.` });
      onClose();
    } catch {
      toast({ title: 'Error', description: 'Failed to add user.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Add Farmer/Executive</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded p-2">
            <option value="farmer">Farmer</option>
            <option value="executive">Executive</option>
          </select>
          <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddModal; 