
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { BellRing, BellOff, BellPlus } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationPermissionProps {
  className?: string;
}

export const NotificationPermission = ({ className = '' }: NotificationPermissionProps) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { permission, requestPermission, loading, isSupported } = usePushNotifications();
  
  useEffect(() => {
    // Show prompt if notifications are supported and permission hasn't been granted yet
    const shouldShowPrompt = 
      isSupported && 
      permission !== 'granted' && 
      localStorage.getItem('notification-prompt-dismissed') !== 'true';
    
    setShowPrompt(shouldShowPrompt);
  }, [permission, isSupported]);
  
  const handleEnable = async () => {
    try {
      await requestPermission();
      toast.success('Notifications enabled successfully!');
      setShowPrompt(false);
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Failed to enable notifications');
    }
  };
  
  const handleDismiss = () => {
    localStorage.setItem('notification-prompt-dismissed', 'true');
    setShowPrompt(false);
  };
  
  if (!isSupported) {
    return null;
  }
  
  // If permission already granted or permanently denied, don't show
  if (permission === 'granted' || !showPrompt) {
    return null;
  }
  
  return (
    <div className={`rounded-md bg-primary/10 p-4 ${className}`}>
      <div className="flex items-start gap-4">
        <BellRing className="h-6 w-6 text-primary mt-1" />
        <div className="flex-1">
          <h4 className="font-semibold">Enable notifications</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Get notified about new messages, orders, bookings, and promotions.
          </p>
          <div className="mt-3 flex gap-3">
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleEnable}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <BellPlus className="h-4 w-4" />
              Enable
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDismiss}
              className="flex items-center gap-2"
            >
              <BellOff className="h-4 w-4" />
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
