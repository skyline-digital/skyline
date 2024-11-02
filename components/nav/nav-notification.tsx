'use client'

import { useNotifications } from "@/context/NotificationContext"
import { Bell, BellDot } from "lucide-react";

export default function NavNotifications() {
  const notifications = useNotifications();

  console.log(notifications);

  return (
    <button>
      {notifications.length > 0 ? <BellDot /> : <Bell />}
    </button>
  )
}