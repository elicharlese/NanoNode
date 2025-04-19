"use client"

import { NodeStatusBar } from "@/components/node-status-bar"
import { LogPane } from "@/components/log-pane"
import { NodeConsole } from "@/components/node-console"
import { NodeMetrics } from "@/components/node-metrics"
import { NodeControls } from "@/components/node-controls"
import { NetworkPicker } from "@/components/network-picker"
import { useNodeStatus } from "@/hooks/use-node-status"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Terminal, Minimize2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function NanoNodeDashboard() {
  const {
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
  } = useNodeStatus()

  const [miningEnabled, setMiningEnabled] = useState(false)
  const [miningThreads, setMiningThreads] = useState(4)
  const [gasLimit, setGasLimit] = useState(8000000)
  const [gasPrice, setGasPrice] = useState(20)
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false)

  const toggleConsole = () => {
    setIsConsoleCollapsed(!isConsoleCollapsed)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-200 font-mono">
      <NodeStatusBar version={version} strategy={strategy} strategyFile={strategyFile} network={network} />

      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        {!isConsoleCollapsed && (
          <div className="flex-1 glass-panel rounded-lg overflow-hidden relative shadow-md">
            <NodeConsole isRunning={isRunning && !isPaused} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 glass-button rounded-full"
                    onClick={toggleConsole}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Collapse Console</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {isConsoleCollapsed && (
          <div className="w-12 glass-panel rounded-lg flex flex-col items-center py-2 shadow-md">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 glass-button rounded-full"
                    onClick={toggleConsole}
                  >
                    <Terminal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expand Console</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <div
          className={`${isConsoleCollapsed ? "flex-1" : "w-[40%]"} glass-panel rounded-lg overflow-hidden shadow-md`}
        >
          <LogPane logs={logs} />
        </div>
      </div>

      <div className="p-2">
        <div className="glass-panel rounded-lg shadow-md">
          <NodeMetrics metrics={metrics} />
        </div>
      </div>

      <div className="p-2">
        <div className="glass-panel rounded-lg p-2 flex justify-between items-center shadow-md">
          <NodeControls
            isRunning={isRunning}
            isPaused={isPaused}
            startNode={startNode}
            stopNode={stopNode}
            pauseNode={pauseNode}
            resetNode={resetNode}
            openSettings={toggleSettings}
          />

          <div className="w-64">
            <NetworkPicker
              selectedNetwork={selectedNetwork}
              onNetworkChange={handleNetworkChange}
              disabled={isRunning && !isPaused}
            />
          </div>
        </div>
      </div>

      {/* Node Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={toggleSettings}>
        <DialogContent className="sm:max-w-[500px] glass-dialog">
          <DialogHeader>
            <DialogTitle>Node Settings</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="mining">Mining</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="p-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dataDir" className="text-right">
                    Data Directory
                  </Label>
                  <Input id="dataDir" defaultValue="~/.nanonode/data" className="col-span-3 glass-input" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="logLevel" className="text-right">
                    Log Level
                  </Label>
                  <select id="logLevel" defaultValue="info" className="col-span-3 glass-input p-2 rounded-md">
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rpcPort" className="text-right">
                    RPC Port
                  </Label>
                  <Input id="rpcPort" type="number" defaultValue="8545" className="col-span-3 glass-input" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mining" className="p-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="miningEnabled" className="text-right">
                    Enable Mining
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <input
                      type="checkbox"
                      id="miningEnabled"
                      checked={miningEnabled}
                      onChange={(e) => setMiningEnabled(e.target.checked)}
                      className="mr-2"
                    />
                    <Label htmlFor="miningEnabled">Mine blocks when node is running</Label>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="miningThreads" className="text-right">
                    Mining Threads
                  </Label>
                  <Input
                    id="miningThreads"
                    type="number"
                    value={miningThreads}
                    onChange={(e) => setMiningThreads(Number.parseInt(e.target.value) || 1)}
                    disabled={!miningEnabled}
                    className="col-span-3 glass-input"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="coinbase" className="text-right">
                    Coinbase Address
                  </Label>
                  <Input
                    id="coinbase"
                    defaultValue="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                    disabled={!miningEnabled}
                    className="col-span-3 glass-input"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="p-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gasLimit" className="text-right">
                    Block Gas Limit
                  </Label>
                  <Input
                    id="gasLimit"
                    type="number"
                    value={gasLimit}
                    onChange={(e) => setGasLimit(Number.parseInt(e.target.value) || 8000000)}
                    className="col-span-3 glass-input"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gasPrice" className="text-right">
                    Gas Price (Gwei)
                  </Label>
                  <Input
                    id="gasPrice"
                    type="number"
                    value={gasPrice}
                    onChange={(e) => setGasPrice(Number.parseInt(e.target.value) || 20)}
                    className="col-span-3 glass-input"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hardfork" className="text-right">
                    Hardfork
                  </Label>
                  <select id="hardfork" defaultValue="shanghai" className="col-span-3 glass-input p-2 rounded-md">
                    <option value="shanghai">Shanghai</option>
                    <option value="london">London</option>
                    <option value="berlin">Berlin</option>
                    <option value="istanbul">Istanbul</option>
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vmTrace" className="text-right">
                    VM Tracing
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <input type="checkbox" id="vmTrace" defaultChecked={false} className="mr-2" />
                    <Label htmlFor="vmTrace">Enable VM execution tracing (slower)</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={toggleSettings} className="mr-2 glass-button">
              Cancel
            </Button>
            <Button
              onClick={toggleSettings}
              className="bg-blue-600/90 hover:bg-blue-700/90 backdrop-blur-sm text-white"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

