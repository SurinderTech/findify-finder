
import React, { useState, useEffect } from 'react';
import { Bell, BellDot, Check, Mail, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService, Notification } from '@/services/notificationService';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ItemMatchDetails from '@/components/items/ItemMatchDetails';

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch notifications when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Fetch notifications every 30 seconds to keep them updated
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && open) {
        fetchNotifications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, open]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const notifications = await notificationService.getUserNotifications(user.id);
      setNotifications(notifications);
      setUnreadCount(notifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const success = await notificationService.markAsRead(notificationId);
      if (success) {
        // Update the local state to reflect the change
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      if (unreadNotifications.length === 0) return;

      let allSuccess = true;
      
      // Mark each unread notification as read
      for (const notification of unreadNotifications) {
        if (notification.id) {
          const success = await notificationService.markAsRead(notification.id);
          if (!success) {
            allSuccess = false;
          }
        }
      }

      if (allSuccess) {
        // Update state to mark all as read
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        setUnreadCount(0);
        toast({
          title: "Success",
          description: "All notifications marked as read",
        });
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      });
    }
  };

  const handleViewMatch = (notification: Notification) => {
    setSelectedNotification(notification);
    setMatchDialogOpen(true);
    setOpen(false); // Close the notification sheet
  };

  const viewAllNotifications = () => {
    setOpen(false);
    navigate('/notifications');
  };

  const isMatchNotification = (notification: Notification) => {
    return notification.title.includes('match') && notification.related_item_id;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" onClick={() => fetchNotifications()}>
            {unreadCount > 0 ? (
              <>
                <BellDot className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </>
            ) : (
              <Bell className="h-5 w-5" />
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="mb-4">
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          
          <div className="flex justify-between mb-4">
            <Button variant="outline" size="sm" onClick={viewAllNotifications}>
              View All
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)]">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              </div>
            ) : notifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Mail className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-gray-500">No notifications yet</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-colors ${notification.is_read ? 'bg-card' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatDate(notification.created_at)}</p>
                        
                        {/* For match notifications, add view button */}
                        {isMatchNotification(notification) && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-blue-600 p-0 h-auto font-medium"
                            onClick={() => handleViewMatch(notification)}
                          >
                            View match details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                      {!notification.is_read && notification.id && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 shrink-0" 
                          onClick={() => handleMarkAsRead(notification.id!)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {notifications.length > 10 && (
              <div className="text-center">
                <Button variant="link" onClick={viewAllNotifications}>
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Match Details Dialog */}
      <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Item Match Details</DialogTitle>
          </DialogHeader>
          
          {selectedNotification && selectedNotification.related_item_id && (
            <ItemMatchDetails 
              itemId={selectedNotification.related_item_id} 
              matchId={selectedNotification.related_item_id} // This would be replaced with the actual match ID stored in the notification
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
