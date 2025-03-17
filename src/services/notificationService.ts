
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { User } from '../types/database.types';

export interface Notification {
  id?: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  related_item_id?: string;
  created_at: string;
}

export const notificationService = {
  // Create a new notification
  async createNotification(
    userId: string,
    title: string,
    message: string,
    relatedItemId?: string
  ): Promise<Notification | null> {
    try {
      const newNotification = {
        user_id: userId,
        title,
        message,
        is_read: false,
        related_item_id: relatedItemId,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notifications')
        .insert(newNotification)
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        
        if (error.message.includes('relation "notifications" does not exist')) {
          toast.error("Database table 'notifications' doesn't exist. Please create it in your Supabase dashboard.");
          throw new Error("The 'notifications' table doesn't exist. Please create it in your Supabase dashboard.");
        }
        
        return null;
      }

      // Show a toast notification
      toast.success(title, {
        description: message,
        duration: 5000,
      });

      return data as Notification;
    } catch (error) {
      console.error('Error in createNotification:', error);
      return null;
    }
  },

  // Get notifications for a user
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data as Notification[];
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      return [];
    }
  },

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  },

  // Send an email notification (via Supabase Edge Function)
  async sendEmailNotification(
    toEmail: string,
    subject: string,
    body: string
  ): Promise<boolean> {
    try {
      console.log(`Attempting to send email to ${toEmail}`);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: toEmail,
          subject: subject,
          body: body
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        
        // If the edge function doesn't exist, provide instructions
        if (error.message?.includes('Function not found')) {
          console.error('Supabase Edge Function "send-email" does not exist.');
          toast.error('Email notification function is not set up', {
            description: 'Please create the "send-email" Edge Function in Supabase.',
            duration: 8000,
          });
        }
        
        return false;
      }

      console.log('Email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error in sendEmailNotification:', error);
      return false;
    }
  }
};
