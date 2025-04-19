"use client"

import { useState } from "react"
import { AlertCircle, AlertTriangle, CheckCircle, Info, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Log {
  timestamp: string
  source: string
  message: string
  isError?: boolean
  isWarning?: boolean
  isSuccess?: boolean
}

interface LogPaneProps {
  logs: Log[]
}

export function LogPane({ logs }: LogPaneProps) {
  const [filter, setFilter] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [activeFilters, setActiveFilters] = useState<{
    errors: boolean
    warnings: boolean
    info: boolean
  }>({
    errors: true,
    warnings: true,
    info: true,
  })

  // Filter logs based on search text and active filters
  const filteredLogs = logs.filter((log) => {
    // Text filter
    const matchesText =
      filter === "" ||
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.source.toLowerCase().includes(filter.toLowerCase())

    // Type filter
    const matchesType =
      (log.isError && activeFilters.errors) ||
      (log.isWarning && activeFilters.warnings) ||
      (!log.isError && !log.isWarning && activeFilters.info)

    return matchesText && matchesType
  })

  // Toggle a specific filter
  const toggleFilter = (filterType: "errors" | "warnings" | "info") => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with controls */}
      <div className="flex justify-between items-center p-4 border-b border-white/10 dark:border-white/5">
        <h3 className="font-bold">Node Logs</h3>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-7 w-7 rounded-full ${activeFilters.errors ? "bg-red-100/30 dark:bg-red-900/20 text-red-600 dark:text-red-500" : "glass-button text-gray-500"}`}
                  onClick={() => toggleFilter("errors")}
                >
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{activeFilters.errors ? "Hide" : "Show"} Errors</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-7 w-7 rounded-full ${activeFilters.warnings ? "bg-yellow-100/30 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500" : "glass-button text-gray-500"}`}
                  onClick={() => toggleFilter("warnings")}
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{activeFilters.warnings ? "Hide" : "Show"} Warnings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-7 w-7 rounded-full ${activeFilters.info ? "bg-blue-100/30 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500" : "glass-button text-gray-500"}`}
                  onClick={() => toggleFilter("info")}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{activeFilters.info ? "Hide" : "Show"} Info</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 glass-button rounded-full"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search Logs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="p-2 border-b border-white/10 dark:border-white/5 flex items-center">
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter logs..."
            className="flex-1 h-8 glass-input text-sm"
          />
          {filter && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-1 glass-button rounded-full"
              onClick={() => setFilter("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Logs list */}
      <div className="flex-1 overflow-auto p-2">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Info className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No logs match your filters</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm flex items-start backdrop-blur-sm ${
                  log.isError
                    ? "bg-red-50/20 dark:bg-red-950/20 border-l-2 border-red-600 dark:border-red-700"
                    : log.isWarning
                      ? "bg-yellow-50/20 dark:bg-yellow-950/20 border-l-2 border-yellow-600 dark:border-yellow-700"
                      : log.isSuccess
                        ? "bg-green-50/20 dark:bg-green-950/20 border-l-2 border-green-600 dark:border-green-700"
                        : "bg-blue-50/10 dark:bg-gray-800/30 border-l-2 border-blue-600 dark:border-blue-700"
                }`}
              >
                <div className="mr-2 mt-0.5">
                  {log.isError ? (
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                  ) : log.isWarning ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  ) : log.isSuccess ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                  ) : (
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span className="font-mono">{log.timestamp}</span>
                    <span className="mx-1">•</span>
                    <span className="font-semibold truncate">{log.source}</span>
                  </div>
                  <div
                    className={`${
                      log.isError
                        ? "text-red-700 dark:text-red-300"
                        : log.isWarning
                          ? "text-yellow-700 dark:text-yellow-300"
                          : log.isSuccess
                            ? "text-green-700 dark:text-green-300"
                            : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {log.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

