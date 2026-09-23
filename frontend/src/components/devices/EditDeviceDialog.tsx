import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateDeviceDto, DeviceType, DeviceVendor, Device } from '@/types';

interface EditDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: Device | null;
}

export function EditDeviceDialog({ open, onOpenChange, device }: EditDeviceDialogProps) {
  const { register, handleSubmit, reset, setValue } = useForm<CreateDeviceDto>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (device) {
      reset({
        name: device.name,
        ipAddress: device.ipAddress,
        type: device.type,
        vendor: device.vendor as DeviceVendor,
        model: device.model,
      });
      setValue('type', device.type);
      setValue('vendor', device.vendor as DeviceVendor);
    }
  }, [device, reset, setValue]);

  const onSubmit = async (data: CreateDeviceDto) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Device updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update device');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register('name', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>IP Address</Label>
              <Input {...register('ipAddress', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Device Type</Label>
              <Select defaultValue={device?.type} onValueChange={(val) => setValue('type', val as DeviceType)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OLT">OLT</SelectItem>
                  <SelectItem value="MIKROTIK">MikroTik</SelectItem>
                  <SelectItem value="SWITCH">Switch</SelectItem>
                  <SelectItem value="ROUTER">Router</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Select defaultValue={device?.vendor} onValueChange={(val) => setValue('vendor', val as DeviceVendor)}>
                <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ZTE">ZTE</SelectItem>
                  <SelectItem value="HUAWEI">Huawei</SelectItem>
                  <SelectItem value="MIKROTIK">MikroTik</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Input {...register('model')} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Update Device'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
