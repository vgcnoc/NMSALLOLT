import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreatePopDto } from '@/types';

interface AddPopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPopDialog({ open, onOpenChange }: AddPopDialogProps) {
  const { register, handleSubmit, reset } = useForm<CreatePopDto>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: CreatePopDto) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('POP added successfully');
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add POP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New POP</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register('name', { required: true })} placeholder="Main Data Center" />
          </div>
          <div className="space-y-2">
            <Label>Code</Label>
            <Input {...register('code', { required: true })} placeholder="MDC-01" />
          </div>
          <div className="space-y-2">
            <Label>Region</Label>
            <Input {...register('region')} placeholder="North" />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input {...register('address')} placeholder="123 Main St" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Save POP</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
