"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface NodeStatusBarProps {
  version: string
  strategy: string
  strategyFile: string
  network: string
}

export function NodeStatusBar({ version, strategy, strategyFile, network }: NodeStatusBarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="p-2">
      <div className="glass-panel rounded-lg flex justify-between items-center p-2 shadow-md">
        <div className="flex space-x-6">
          <div className="flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Version:</span>
            <span>{version}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Network:</span>
            <span className={network === "OFFLINE" ? "text-red-500" : "text-green-500"}>
              {network === "OFFLINE" ? "OFFLINE" : "Ethereum Mainnet"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Sync:</span>
            <span>{network === "OFFLINE" ? "Not Syncing" : "Syncing (87.5%)"}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Latest Block:</span>
            <span>{network === "OFFLINE" ? "N/A" : "#18,453,782"}</span>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8 rounded-full glass-button"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle theme</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

