import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateDeviceDto, DeviceType, DeviceVendor } from '@/types';
import { devicesApi } from '@/api/devices.api';

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const { register, handleSubmit, reset, setValue } = useForm<CreateDeviceDto>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const onSubmit = async (data: CreateDeviceDto) => {
    setIsSubmitting(true);
    try {
      await devicesApi.create(data);
      toast.success('Device added successfully');
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['olts'] });
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add device');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>Input device details and credentials to allow the system to fetch data.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">Basic Info</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...register('name', { required: true })} placeholder="e.g. OLT-Main" />
              </div>
              <div className="space-y-2">
                <Label>IP Address</Label>
                <Input {...register('ipAddress', { required: true })} placeholder="192.168.1.1" />
              </div>
              <div className="space-y-2">
                <Label>Device Type</Label>
                <Select onValueChange={(val) => setValue('type', val as DeviceType)}>
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
                <Select onValueChange={(val) => setValue('vendor', val as DeviceVendor)}>
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
                <Input {...register('model')} placeholder="e.g. C320" />
              </div>
              <div className="space-y-2">
                <Label>SNMP Community</Label>
                <Input {...register('snmpCommunity')} placeholder="public" type="password" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">Web / SSH Credentials (Optional)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Web / API Username</Label>
                <Input {...register('apiUsername')} placeholder="admin" />
              </div>
              <div className="space-y-2">
                <Label>Web / API Password</Label>
                <Input {...register('apiPassword')} placeholder="password" type="password" />
              </div>
              <div className="space-y-2">
                <Label>SSH / Telnet Username</Label>
                <Input {...register('sshUsername')} placeholder="admin" />
              </div>
              <div className="space-y-2">
                <Label>SSH / Telnet Password</Label>
                <Input {...register('sshPassword')} placeholder="password" type="password" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Device'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
