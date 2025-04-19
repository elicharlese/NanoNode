"use client"

import { useState, useCallback } from "react"

interface NodeMetrics {
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

interface Log {
  timestamp: string
  source: string
  message: string
  isError?: boolean
  isWarning?: boolean
  isSuccess?: boolean
}

export function useNodeStatus() {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [status, setStatus] = useState("OFFLINE")
  const [version, setVersion] = useState("1.21.0")
  const [network, setNetwork] = useState("OFFLINE")
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum-mainnet")
  const [strategy, setStrategy] = useState("None")
  const [strategyFile, setStrategyFile] = useState("None")
  const [logs, setLogs] = useState<Log[]>([])
  const [logInterval, setLogInterval] = useState<NodeJS.Timeout | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [metrics, setMetrics] = useState<NodeMetrics>({
    trades: 0,
    pnl: 0.0,
    returnPercentage: 0.0,
    cpu: 7.0,
    memory: {
      used: 71.91,
      total: 241.68,
    },
    threads: 13,
    uptime: {
      days: 0,
      time: "00:00:09",
    },
  })

  // Helper to get current time in the format shown in the screenshot
  const getCurrentTime = useCallback(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
  }, [])

  // Helper to increment the uptime
  const incrementTime = useCallback((timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number)
    let newSeconds = seconds + 3 // Add 3 seconds (our interval)
    let newMinutes = minutes
    let newHours = hours

    if (newSeconds >= 60) {
      newSeconds -= 60
      newMinutes += 1
    }

    if (newMinutes >= 60) {
      newMinutes -= 60
      newHours += 1
    }

    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`
  }, [])

  // Simulate log generation
  const startLogSimulation = useCallback(() => {
    // Sample logs similar to the screenshot but with blockchain-specific content
    const sampleLogs = [
      {
        source: "time_synchronizer",
        message: "Error getting server time. (See log file for stack trace dump)",
        isError: true,
      },
      {
        source: "time_synchronizer",
        message: "Could not refresh server time. Check network connection.",
        isError: true,
      },
      {
        source: "eth_rpc",
        message: "There was an error requesting chain info. (See log file for stack trace dump)",
        isError: true,
      },
      {
        source: "network_manager",
        message: "Attempting to reconnect to Ethereum network",
        isWarning: true,
      },
      {
        source: "block_processor",
        message: "Processing block #18453782",
      },
      {
        source: "transaction_pool",
        message: "Added 12 new transactions to mempool",
      },
      {
        source: "consensus_engine",
        message: "Validated block #18453782",
        isSuccess: true,
      },
      {
        source: "eth_sync",
        message: "Downloading block headers (87.5%)",
      },
      {
        source: "peer_manager",
        message: "Peer connection timeout: 0x7a1b2c3d4e5f",
        isWarning: true,
      },
      {
        source: "block_validator",
        message: "Successfully validated block #18453783",
        isSuccess: true,
      },
      {
        source: "transaction_executor",
        message: "Executed transaction 0x8f4e...3a2b with status: SUCCESS",
        isSuccess: true,
      },
      {
        source: "gas_estimator",
        message: "Gas price surge detected: 45 Gwei",
        isWarning: true,
      },
    ]

    // Clear any existing interval
    if (logInterval) {
      clearInterval(logInterval)
    }

    const interval = setInterval(() => {
      if (!isRunning || isPaused) {
        return
      }

      const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)]
      setLogs((prevLogs) => [
        {
          timestamp: getCurrentTime(),
          source: randomLog.source,
          message: randomLog.message,
          isError: randomLog.isError,
          isWarning: randomLog.isWarning,
          isSuccess: randomLog.isSuccess,
        },
        ...prevLogs.slice(0, 19), // Keep only the last 20 logs
      ])

      // Update metrics
      setMetrics((prev) => ({
        ...prev,
        cpu: Math.min(100, prev.cpu + (Math.random() * 2 - 1)),
        memory: {
          used: prev.memory.used + (Math.random() * 0.5 - 0.2),
          total: prev.memory.total,
        },
        uptime: {
          days: prev.uptime.days,
          time: incrementTime(prev.uptime.time),
        },
      }))
    }, 3000)

    setLogInterval(interval)
    return () => clearInterval(interval)
  }, [getCurrentTime, incrementTime, isRunning, isPaused, logInterval])

  // Simulate node starting
  const startNode = useCallback(() => {
    if (isPaused) {
      // Resume from pause
      setIsPaused(false)
      setLogs((prevLogs) => [
        {
          timestamp: getCurrentTime(),
          source: "node_manager",
          message: "Node resumed from pause",
        },
        ...prevLogs,
      ])
      return
    }

    setIsRunning(true)
    setIsPaused(false)
    setNetwork("CONNECTING")

    // Simulate connection process
    setTimeout(() => {
      setNetwork("ONLINE")
      setStatus("RUNNING")

      // Add some initial logs with blockchain-specific information
      setLogs([
        {
          timestamp: getCurrentTime(),
          source: "node_initializer",
          message: "Ethereum node started successfully",
          isSuccess: true,
        },
        {
          timestamp: getCurrentTime(),
          source: "network_manager",
          message: "Connected to Ethereum Mainnet",
          isSuccess: true,
        },
        {
          timestamp: getCurrentTime(),
          source: "blockchain_sync",
          message: "Starting blockchain synchronization",
        },
        {
          timestamp: getCurrentTime(),
          source: "security_monitor",
          message: "Running with default security settings. Consider enabling additional protections.",
          isWarning: true,
        },
      ])

      // Start the log simulation
      startLogSimulation()
    }, 2000)
  }, [getCurrentTime, startLogSimulation, isPaused])

  // Simulate node pausing
  const pauseNode = useCallback(() => {
    if (!isRunning) return

    setIsPaused(true)
    setLogs((prevLogs) => [
      {
        timestamp: getCurrentTime(),
        source: "node_manager",
        message: "Node paused",
      },
      ...prevLogs,
    ])
  }, [isRunning, getCurrentTime])

  // Simulate node stopping
  const stopNode = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setNetwork("OFFLINE")
    setStatus("STOPPED")

    // Add stop log
    setLogs((prevLogs) => [
      {
        timestamp: getCurrentTime(),
        source: "node_manager",
        message: "Node stopped",
      },
      ...prevLogs,
    ])

    // Clear interval
    if (logInterval) {
      clearInterval(logInterval)
      setLogInterval(null)
    }
  }, [getCurrentTime, logInterval])

  // Simulate node resetting
  const resetNode = useCallback(() => {
    // Stop the node if it's running
    if (isRunning || isPaused) {
      stopNode()
    }

    // Clear logs and reset metrics
    setLogs([
      {
        timestamp: getCurrentTime(),
        source: "node_manager",
        message: "Node reset to initial state",
      },
    ])

    // Reset metrics
    setMetrics({
      trades: 0,
      pnl: 0.0,
      returnPercentage: 0.0,
      cpu: 7.0,
      memory: {
        used: 71.91,
        total: 241.68,
      },
      threads: 13,
      uptime: {
        days: 0,
        time: "00:00:00",
      },
    })
  }, [isRunning, isPaused, stopNode, getCurrentTime])

  // Handle network change
  const handleNetworkChange = useCallback(
    (networkId: string) => {
      // If node is running, we need to restart it
      const wasRunning = isRunning
      const wasPaused = isPaused

      if (wasRunning || wasPaused) {
        stopNode()
      }

      setSelectedNetwork(networkId)

      // Add log about network change
      setLogs((prevLogs) => [
        {
          timestamp: getCurrentTime(),
          source: "network_manager",
          message: `Network changed to ${networkId}`,
        },
        ...prevLogs,
      ])

      // Restart node if it was running
      if (wasRunning && !wasPaused) {
        setTimeout(() => {
          startNode()
        }, 1000)
      }
    },
    [isRunning, isPaused, stopNode, getCurrentTime, startNode],
  )

  // Toggle settings dialog
  const toggleSettings = useCallback(() => {
    setShowSettings((prev) => !prev)
  }, [])

  return {
    status,
    version,
    network,
    selectedNetwork,
    strategy,
    strategyFile,
    logs,
    metrics,
    isRunning,
    isPaused,
    showSettings,
    startNode,
    stopNode,
    pauseNode,
    resetNode,
    handleNetworkChange,
    toggleSettings,
  }
}

