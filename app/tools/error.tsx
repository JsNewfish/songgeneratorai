'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <div className="text-4xl">🎶</div>
      <h2 className="text-xl font-semibold">Failed to load tool</h2>
      <p className="text-muted-foreground text-center text-sm max-w-sm">
        The tool encountered an error. Your credits have not been deducted.
      </p>
      <div className="flex gap-3">
        <Button size="sm" onClick={reset}>Retry</Button>
        <Button size="sm" variant="outline" onClick={() => window.location.href = '/'}>
          Back to Home
        </Button>
      </div>
    </div>
  )
}
