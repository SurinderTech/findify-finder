
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notificationService, Notification } from '../services/notificationService';
import { Check, Mail, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import ItemMatchDetails from '@/components/items/ItemMatchDetails';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const notifications = await notificationService.getUserNotifications(user.id);
      setNotifications(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const success = await notificationService.markAsRead(notificationId);
      if (success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        toast({
          title: "Success",
          description: "Notification marked as read",
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      if (unreadNotifications.length === 0) return;

      let allSuccess = true;
      
      for (const notification of unreadNotifications) {
        if (notification.id) {
          const success = await notificationService.markAsRead(notification.id);
          if (!success) {
            allSuccess = false;
          }
        }
      }

      if (allSuccess) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: true }))
        );
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isMatchNotification = (notification: Notification) => {
    return notification.title.includes('match') && notification.related_item_id;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {notifications.filter(n => !n.is_read).length > 0 && (
          <Button onClick={markAllAsRead}>Mark all as read</Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Mail className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-medium text-gray-600 mb-2">No notifications</h2>
              <p className="text-gray-500">You don't have any notifications yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Title</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notification) => (
                      <TableRow 
                        key={notification.id}
                        className={notification.is_read ? "" : "bg-blue-50 dark:bg-blue-900/20"}
                      >
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>{notification.message}</TableCell>
                        <TableCell>{formatDate(notification.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {isMatchNotification(notification) && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewMatch(notification)}
                              >
                                View Match
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            )}
                            
                            {!notification.is_read && notification.id && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleMarkAsRead(notification.id!)}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="matches">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Title</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.filter(n => isMatchNotification(n)).map((notification) => (
                      <TableRow 
                        key={notification.id}
                        className={notification.is_read ? "" : "bg-blue-50 dark:bg-blue-900/20"}
                      >
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>{notification.message}</TableCell>
                        <TableCell>{formatDate(notification.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewMatch(notification)}
                            >
                              View Match
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                            
                            {!notification.is_read && notification.id && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleMarkAsRead(notification.id!)}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {notifications.filter(n => isMatchNotification(n)).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500">No match notifications yet</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="unread">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Title</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.filter(n => !n.is_read).map((notification) => (
                      <TableRow 
                        key={notification.id}
                        className="bg-blue-50 dark:bg-blue-900/20"
                      >
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>{notification.message}</TableCell>
                        <TableCell>{formatDate(notification.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {isMatchNotification(notification) && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewMatch(notification)}
                              >
                                View Match
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            )}
                            
                            {notification.id && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleMarkAsRead(notification.id!)}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {notifications.filter(n => !n.is_read).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <Check className="mx-auto h-8 w-8 text-green-500 mb-2" />
                          <p className="text-gray-500">All notifications are read</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
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
    </div>
  );
};

export default Notifications;
