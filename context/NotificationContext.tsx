'use client';

import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


const NotificationContext = createContext<string[] | undefined>(undefined);

export default function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<string[]>([]);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const leadsSubscription = supabase
      .channel('schema-db-changes')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          setNotifications(prev => [...prev, `You have a new notification: ${payload.new.message}`]);
          toast({
            title: `You have a new notification!`,
            description: `${payload.new.message}`,
          })
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(leadsSubscription)
    }
  }, []);

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used inside a NotificationProvider!')
  }
  return context;
}