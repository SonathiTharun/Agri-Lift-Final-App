import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface AssignTaskModalProps {
  open: boolean;
  onClose: () => void;
}

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({ open, onClose }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', role: 'farmer', task: '', due: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1200));
      toast({ title: 'Task Assigned', description: `Task assigned to ${form.role} ${form.name}.` });
      onClose();
    } catch {
      toast({ title: 'Error', description: 'Failed to assign task.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Assignee Name" value={form.name} onChange={handleChange} required />
          <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded p-2">
            <option value="farmer">Farmer</option>
            <option value="executive">Executive</option>
          </select>
          <Input name="task" placeholder="Task Description" value={form.task} onChange={handleChange} required />
          <Input name="due" placeholder="Due Date" value={form.due} onChange={handleChange} type="date" required />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Assigning...' : 'Assign'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskModal; 