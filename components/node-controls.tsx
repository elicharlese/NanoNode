"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PauseIcon, PlayIcon, MonitorStopIcon as StopIcon, RefreshCwIcon, Settings2Icon } from "lucide-react"

interface NodeControlsProps {
  isRunning: boolean
  isPaused: boolean
  startNode: () => void
  stopNode: () => void
  pauseNode: () => void
  resetNode: () => void
  openSettings: () => void
}

export function NodeControls({
  isRunning,
  isPaused,
  startNode,
  stopNode,
  pauseNode,
  resetNode,
  openSettings,
}: NodeControlsProps) {
  return (
    <div className="flex items-center">
      {/* Left section with controls */}
      <div className="flex space-x-2">
        <TooltipProvider>
          {!isRunning ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="glass-button text-green-500 hover:text-green-400 rounded-full"
                  onClick={startNode}
                >
                  <PlayIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start Node</p>
              </TooltipContent>
            </Tooltip>
          ) : isPaused ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="glass-button text-green-500 hover:text-green-400 rounded-full"
                  onClick={pauseNode}
                >
                  <PlayIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Resume Node</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="glass-button text-yellow-500 hover:text-yellow-400 rounded-full"
                  onClick={pauseNode}
                >
                  <PauseIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pause Node</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="glass-button text-red-500 hover:text-red-400 rounded-full"
                onClick={stopNode}
                disabled={!isRunning && !isPaused}
              >
                <StopIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop Node</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="glass-button text-blue-500 hover:text-blue-400 rounded-full"
                onClick={resetNode}
              >
                <RefreshCwIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset Node</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="glass-button text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full"
                onClick={openSettings}
              >
                <Settings2Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Node Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Center section with status text - ensuring it stays on one line */}
      <div className="flex-1 flex justify-center ml-32">
        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis px-3 py-1 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-sm">
          {isRunning && !isPaused ? "Node is running" : isPaused ? "Node is paused" : "Node is stopped"}
        </span>
      </div>

      {/* Right section remains empty for the network picker */}
      <div className="flex-1" />
    </div>
  )
}

