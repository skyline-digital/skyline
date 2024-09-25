import { cn } from '@/utils/cn'
import { Badge } from '../ui/badge'

export default function LeadStatusBadge({ status }: { status: string }) {
  if (!status) {
    return null
  }

  let statusColor: string

  if (status === 'new') {
    statusColor = 'bg-green-500'
  } else if (status === 'open') {
    statusColor = 'bg-blue-500'
  } else if (status === 'closed') {
    statusColor = 'bg-gray-500'
  } else if (status === 'lost') {
    statusColor = 'bg-red-500'
  } else {
    statusColor = 'bg-gray-500'
  }

  return (
    <Badge
      className={cn('text-nowrap text-xs', statusColor, `hover:${statusColor}`)}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
