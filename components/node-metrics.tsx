"use client"

interface NodeMetricsProps {
  metrics: {
    trades: number
    pnl: number
    returnPercentage: number
    cpu: number
    memory: {
      used: number
      total: number
    }
    threads: number
    uptime: {
      days: number
      time: string
    }
  }
}

export function NodeMetrics({ metrics }: NodeMetricsProps) {
  const isRunning = metrics.uptime.time !== "00:00:00"

  return (
    <div className="flex justify-between items-center p-2 text-sm">
      <div className="flex space-x-4">
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Peers:</span>
          <span>{isRunning ? "12" : "0"}</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Blocks:</span>
          <span>{isRunning ? "18,453,782" : "0"}</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">TXs:</span>
          <span>{isRunning ? "156" : "0"}</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Gas:</span>
          <span>{isRunning ? "32 Gwei" : "N/A"}</span>
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">CPU:</span>
          <span>{metrics.cpu.toFixed(1)}%</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Mem:</span>
          <span>
            {metrics.memory.used.toFixed(2)} MB ({metrics.memory.total.toFixed(2)} MB)
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Threads:</span>
          <span>{metrics.threads}</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Uptime:</span>
          <span>
            {metrics.uptime.days} day(s), {metrics.uptime.time}
          </span>
        </div>
      </div>
    </div>
  )
}

