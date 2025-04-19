"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircleIcon } from "lucide-react"

export type NetworkType = {
  id: string
  name: string
  chainId: number
  currency: string
  rpcUrl: string
  blockExplorer?: string
  isTestnet: boolean
}

interface NetworkPickerProps {
  selectedNetwork: string
  onNetworkChange: (networkId: string) => void
  disabled?: boolean
}

export function NetworkPicker({ selectedNetwork, onNetworkChange, disabled = false }: NetworkPickerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [networks, setNetworks] = useState<NetworkType[]>([
    {
      id: "ethereum-mainnet",
      name: "Ethereum Mainnet",
      chainId: 1,
      currency: "ETH",
      rpcUrl: "https://mainnet.infura.io/v3/your-api-key",
      blockExplorer: "https://etherscan.io",
      isTestnet: false,
    },
    {
      id: "ethereum-sepolia",
      name: "Ethereum Sepolia",
      chainId: 11155111,
      currency: "ETH",
      rpcUrl: "https://sepolia.infura.io/v3/your-api-key",
      blockExplorer: "https://sepolia.etherscan.io",
      isTestnet: true,
    },
    {
      id: "polygon-mainnet",
      name: "Polygon Mainnet",
      chainId: 137,
      currency: "MATIC",
      rpcUrl: "https://polygon-rpc.com",
      blockExplorer: "https://polygonscan.com",
      isTestnet: false,
    },
    {
      id: "bsc-mainnet",
      name: "BNB Smart Chain",
      chainId: 56,
      currency: "BNB",
      rpcUrl: "https://bsc-dataseed.binance.org",
      blockExplorer: "https://bscscan.com",
      isTestnet: false,
    },
    {
      id: "arbitrum-one",
      name: "Arbitrum One",
      chainId: 42161,
      currency: "ETH",
      rpcUrl: "https://arb1.arbitrum.io/rpc",
      blockExplorer: "https://arbiscan.io",
      isTestnet: false,
    },
    {
      id: "optimism",
      name: "Optimism",
      chainId: 10,
      currency: "ETH",
      rpcUrl: "https://mainnet.optimism.io",
      blockExplorer: "https://optimistic.etherscan.io",
      isTestnet: false,
    },
    {
      id: "local",
      name: "Local Network",
      chainId: 1337,
      currency: "ETH",
      rpcUrl: "http://localhost:8545",
      isTestnet: true,
    },
  ])

  const [newNetwork, setNewNetwork] = useState<Omit<NetworkType, "id">>({
    name: "",
    chainId: 0,
    currency: "ETH",
    rpcUrl: "",
    blockExplorer: "",
    isTestnet: true,
  })

  const handleAddNetwork = () => {
    if (!newNetwork.name || !newNetwork.rpcUrl || newNetwork.chainId === 0) {
      return
    }

    const id = `custom-${Date.now()}`
    setNetworks([...networks, { ...newNetwork, id }])
    setIsDialogOpen(false)

    // Reset form
    setNewNetwork({
      name: "",
      chainId: 0,
      currency: "ETH",
      rpcUrl: "",
      blockExplorer: "",
      isTestnet: true,
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <Select value={selectedNetwork} onValueChange={onNetworkChange} disabled={disabled}>
          <SelectTrigger className="glass-input border-0">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent className="glass-card">
            {networks.map((network) => (
              <SelectItem key={network.id} value={network.id}>
                <div className="flex items-center">
                  <span>{network.name}</span>
                  {network.isTestnet && (
                    <span className="ml-2 text-xs bg-yellow-100/50 text-yellow-800 dark:bg-yellow-800/50 dark:text-yellow-300 px-1 rounded backdrop-blur-sm">
                      Testnet
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="glass-button rounded-full" disabled={disabled}>
            <PlusCircleIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] glass-dialog">
          <DialogHeader>
            <DialogTitle>Add Custom Network</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newNetwork.name}
                onChange={(e) => setNewNetwork({ ...newNetwork, name: e.target.value })}
                className="col-span-3 glass-input"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chainId" className="text-right">
                Chain ID
              </Label>
              <Input
                id="chainId"
                type="number"
                value={newNetwork.chainId || ""}
                onChange={(e) => setNewNetwork({ ...newNetwork, chainId: Number.parseInt(e.target.value) || 0 })}
                className="col-span-3 glass-input"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                Currency
              </Label>
              <Input
                id="currency"
                value={newNetwork.currency}
                onChange={(e) => setNewNetwork({ ...newNetwork, currency: e.target.value })}
                className="col-span-3 glass-input"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rpcUrl" className="text-right">
                RPC URL
              </Label>
              <Input
                id="rpcUrl"
                value={newNetwork.rpcUrl}
                onChange={(e) => setNewNetwork({ ...newNetwork, rpcUrl: e.target.value })}
                className="col-span-3 glass-input"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="blockExplorer" className="text-right">
                Block Explorer
              </Label>
              <Input
                id="blockExplorer"
                value={newNetwork.blockExplorer || ""}
                onChange={(e) => setNewNetwork({ ...newNetwork, blockExplorer: e.target.value })}
                className="col-span-3 glass-input"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isTestnet" className="text-right">
                Testnet
              </Label>
              <div className="col-span-3 flex items-center">
                <input
                  type="checkbox"
                  id="isTestnet"
                  checked={newNetwork.isTestnet}
                  onChange={(e) => setNewNetwork({ ...newNetwork, isTestnet: e.target.checked })}
                  className="mr-2"
                />
                <Label htmlFor="isTestnet">This is a test network</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleAddNetwork}
              className="bg-blue-600/90 hover:bg-blue-700/90 backdrop-blur-sm text-white"
            >
              Add Network
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

