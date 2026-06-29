import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
}

export function ChatMessage({ role, content, loading }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex gap-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-(--color-accent) text-xs font-bold text-white">
          N
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed',
          isUser
            ? 'bg-(--color-accent) text-white rounded-br-sm'
            : 'bg-(--color-bg-subtle) text-(--color-text-primary) rounded-bl-sm border border-(--color-border)',
        )}
      >
        {loading ? (
          <div className="flex gap-1 py-1">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  )
}
