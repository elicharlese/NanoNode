"use client"

import { useState, useCallback, useEffect } from "react"

import type React from "react"

type CommandResult = {
  command: string
  output: string
  isError?: boolean
  timestamp: string
}

type CommandInfo = {
  name: string
  description: string
  category: string
  examples?: string[]
}

export function useNodeConsole(isNodeRunning: boolean) {
  const [commandHistory, setCommandHistory] = useState<CommandResult[]>([])
  const [inputValue, setInputValue] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<CommandInfo[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // List of available commands with descriptions
  const availableCommands: CommandInfo[] = [
    // Blockchain Commands
    {
      name: "getblock",
      description: "Get block information",
      category: "blockchain",
      examples: ["getblock latest", "getblock 12345", "getblock 0x..."],
    },
    { name: "getbalance", description: "Get account balance", category: "blockchain", examples: ["getbalance 0x..."] },
    { name: "gettx", description: "Get transaction details", category: "blockchain", examples: ["gettx 0x..."] },
    {
      name: "sendtx",
      description: "Send a test transaction",
      category: "blockchain",
      examples: ["sendtx 0x... 0x... 1.5"],
    },
    { name: "getaccounts", description: "List available accounts", category: "blockchain" },
    { name: "getnetwork", description: "Show current network info", category: "blockchain" },
    { name: "getpeers", description: "List connected peers", category: "blockchain" },

    // Contract Commands
    {
      name: "deploy",
      description: "Deploy a smart contract",
      category: "contract",
      examples: ["deploy MyContract.sol"],
    },
    {
      name: "call",
      description: "Call a contract method (read-only)",
      category: "contract",
      examples: ["call 0x... method arg1 arg2"],
    },
    {
      name: "send",
      description: "Execute a contract method (write)",
      category: "contract",
      examples: ["send 0x... method arg1 arg2"],
    },
    { name: "events", description: "Get contract events", category: "contract", examples: ["events 0x... Transfer"] },
    { name: "abi", description: "Get contract ABI", category: "contract", examples: ["abi 0x..."] },

    // Account Commands
    { name: "createaccount", description: "Create a new account", category: "account" },
    {
      name: "importaccount",
      description: "Import an account from private key",
      category: "account",
      examples: ["importaccount 0x..."],
    },
    { name: "listaccounts", description: "List all accounts", category: "account" },
    { name: "unlock", description: "Unlock an account for signing", category: "account", examples: ["unlock 0x..."] },

    // Utility Commands
    {
      name: "estimategas",
      description: "Estimate gas for a transaction",
      category: "utility",
      examples: ["estimategas --to 0x... --value 1.5"],
    },
    { name: "gasprices", description: "Get current gas price recommendations", category: "utility" },
    { name: "trace", description: "Trace transaction execution", category: "utility", examples: ["trace 0x..."] },
    { name: "debug", description: "Debug transaction execution", category: "utility", examples: ["debug 0x..."] },
    { name: "mempool", description: "Show pending transactions", category: "utility" },
    { name: "logs", description: "Get blockchain logs", category: "utility", examples: ["logs --fromBlock 1000000"] },

    // System Commands
    {
      name: "config",
      description: "Get/set node configuration",
      category: "system",
      examples: ["config", "config key", "config key value"],
    },
    { name: "metrics", description: "Show node performance metrics", category: "system" },
    { name: "version", description: "Show node version information", category: "system" },
    { name: "clear", description: "Clear console history", category: "system" },
    { name: "exit", description: "Exit the console", category: "system" },
    { name: "help", description: "Show help information", category: "system", examples: ["help", "help command"] },
  ]

  // Get current timestamp
  const getTimestamp = () => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
  }

  // Update suggestions based on input
  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const parts = inputValue.trim().split(" ")
    const currentWord = parts[parts.length - 1].toLowerCase()

    // If we're at the beginning of the command, suggest commands
    if (parts.length === 1) {
      const matchedCommands = availableCommands.filter((cmd) =>
        cmd.name.toLowerCase().startsWith(currentWord.toLowerCase()),
      )
      setSuggestions(matchedCommands)
    }
    // If we're typing a command with arguments, suggest examples if available
    else {
      const command = parts[0].toLowerCase()
      const commandInfo = availableCommands.find((cmd) => cmd.name === command)

      if (commandInfo?.examples) {
        // Filter examples that match the current input pattern
        const matchingExamples = commandInfo.examples
          .filter((example) => example.startsWith(inputValue.trim()) && example !== inputValue.trim())
          .map((example) => ({
            name: example,
            description: "Example usage",
            category: commandInfo.category,
          }))

        setSuggestions(matchingExamples)
      } else {
        setSuggestions([])
      }
    }

    setShowSuggestions(true)
    setSelectedSuggestionIndex(-1)
  }, [inputValue])

  // Execute a command
  const executeCommand = useCallback(
    (command: string) => {
      if (!command.trim()) return

      // If node is not running, return an error
      if (!isNodeRunning) {
        const result: CommandResult = {
          command,
          output: "Error: Node is not running. Start the node first.",
          isError: true,
          timestamp: getTimestamp(),
        }
        setCommandHistory((prev) => [...prev, result])
        return
      }

      // Process commands
      let output = ""
      let isError = false

      // Simple command parser
      const parts = command.trim().split(" ")
      const mainCommand = parts[0].toLowerCase()

      // Extract flags
      const flags: Record<string, string | boolean> = {}
      for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith("--")) {
          const flagName = parts[i].substring(2)
          if (i + 1 < parts.length && !parts[i + 1].startsWith("--")) {
            flags[flagName] = parts[i + 1]
            i++
          } else {
            flags[flagName] = true
          }
        } else if (parts[i].startsWith("-")) {
          const flagName = parts[i].substring(1)
          flags[flagName] = true
        }
      }

      // Mocked data for metrics and version
      const metrics = {
        uptime: {
          days: Math.floor(Math.random() * 30),
          time: `${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
        },
        cpu: Math.random() * 50,
        memory: {
          used: Math.random() * 500,
          total: Math.random() * 1000,
        },
      }

      const version = "0.1.0"

      const getCurrentTime = () => {
        const now = new Date()
        return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      }

      try {
        switch (mainCommand) {
          case "help":
            output = `
Available commands:

BLOCKCHAIN COMMANDS:
  getblock [number|hash] [--raw] [--txs]   - Get block information
  getbalance [address] [--wei]             - Get account balance
  gettx [hash] [--raw] [--receipt]         - Get transaction details
  sendtx [from] [to] [amount] [--gas]      - Send a test transaction
  getaccounts                              - List available accounts
  getnetwork                               - Show current network info
  getpeers                                 - List connected peers
  
CONTRACT COMMANDS:
  deploy [file] [--args] [--gas]           - Deploy a smart contract
  call [address] [method] [args]           - Call a contract method (read-only)
  send [address] [method] [args] [--value] - Execute a contract method (write)
  events [address] [event] [--fromBlock]   - Get contract events
  abi [address]                            - Get contract ABI
  
ACCOUNT COMMANDS:
  createaccount [--password]               - Create a new account
  importaccount [key] [--password]         - Import an account from private key
  listaccounts                             - List all accounts
  unlock [address] [--duration]            - Unlock an account for signing
  
UTILITY COMMANDS:
  estimategas [tx]                         - Estimate gas for a transaction
  gasprices                                - Get current gas price recommendations
  trace [tx] [--mode]                      - Trace transaction execution
  debug [tx]                               - Debug transaction execution
  mempool                                  - Show pending transactions
  logs [--filter] [--fromBlock] [--toBlock] - Get blockchain logs
  
SYSTEM COMMANDS:
  config [key] [value]                     - Get/set node configuration
  metrics                                  - Show node performance metrics
  version                                  - Show node version information
  clear                                    - Clear console history
  exit                                     - Exit the console (node keeps running)
  
Use --help after any command for more detailed information.
`
            break

          case "getblock":
            if (parts[1] === "--help") {
              output = `
Usage: getblock [number|hash] [options]

Get information about a block by number or hash.

Options:
  --raw         Return the raw block data
  --txs         Include full transaction details
  --json        Format output as JSON
  
Examples:
  getblock latest
  getblock 12345
  getblock 0x7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b --txs
`
            } else if (parts[1]) {
              const blockNum = parts[1] === "latest" ? 18453782 : Number.parseInt(parts[1])
              const showRaw = flags["raw"] === true
              const showTxs = flags["txs"] === true

              if (showRaw) {
                output = `
{
  "number": ${blockNum},
  "hash": "0x${Math.random().toString(16).substring(2, 42)}",
  "parentHash": "0x${Math.random().toString(16).substring(2, 42)}",
  "nonce": "0x${Math.random().toString(16).substring(2, 18)}",
  "timestamp": ${Math.floor(Date.now() / 1000)},
  "difficulty": "0x${Math.floor(Math.random() * 1000000).toString(16)}",
  "gasLimit": "0x${Math.floor(Math.random() * 10000000).toString(16)}",
  "gasUsed": "0x${Math.floor(Math.random() * 8000000).toString(16)}",
  "miner": "0x${Math.random().toString(16).substring(2, 42)}",
  "transactions": ${showTxs ? '[{"hash": "0x..."}]' : '["0x..."]'},
  "size": ${Math.floor(Math.random() * 50000)}
}`
              } else {
                output = `
Block #${blockNum}
Hash: 0x${Math.random().toString(16).substring(2, 42)}
Timestamp: ${new Date().toISOString()}
Transactions: ${Math.floor(Math.random() * 100)}
Gas Used: ${Math.floor(Math.random() * 8000000)}
Size: ${Math.floor(Math.random() * 50000)} bytes
${showTxs ? "\nTransaction Details: [...]" : ""}
`
              }
            } else {
              output =
                "Latest Block: #18,453,782\nHash: 0x7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b\nTimestamp: " +
                new Date().toISOString()
            }
            break

          case "getbalance":
            if (parts[1] === "--help") {
              output = `
Usage: getbalance [address] [options]

Get the balance of an account.

Options:
  --wei         Show balance in wei instead of ether
  --block       Specify block number (default: latest)
  
Examples:
  getbalance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  getbalance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --wei
  getbalance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --block 12345
`
            } else if (parts[1]) {
              const address = parts[1]
              const inWei = flags["wei"] === true
              const balance = Math.random() * 10

              if (inWei) {
                output = `Balance for ${address}: ${Math.floor(balance * 1e18)} wei`
              } else {
                output = `Balance for ${address}: ${balance.toFixed(4)} ETH`
              }
            } else {
              output = "Error: Address required. Usage: getbalance [address]"
              isError = true
            }
            break

          case "gettx":
            if (parts[1] === "--help") {
              output = `
Usage: gettx [hash] [options]

Get transaction details by hash.

Options:
  --raw         Return the raw transaction data
  --receipt     Include transaction receipt
  --json        Format output as JSON
  
Examples:
  gettx 0x7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b
  gettx 0x7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b --receipt
`
            } else if (parts[1]) {
              const txHash = parts[1]
              const showRaw = flags["raw"] === true
              const showReceipt = flags["receipt"] === true

              if (showRaw) {
                output = `
{
  "hash": "${txHash}",
  "blockHash": "0x${Math.random().toString(16).substring(2, 42)}",
  "blockNumber": ${18453782 - Math.floor(Math.random() * 10)},
  "from": "0x${Math.random().toString(16).substring(2, 42)}",
  "to": "0x${Math.random().toString(16).substring(2, 42)}",
  "value": "0x${Math.floor(Math.random() * 5 * 1e18).toString(16)}",
  "gas": "0x${Math.floor(Math.random() * 100000).toString(16)}",
  "gasPrice": "0x${Math.floor(Math.random() * 100 * 1e9).toString(16)}",
  "nonce": "0x${Math.floor(Math.random() * 1000).toString(16)}"
}`
              } else {
                output = `
Transaction: ${txHash}
Status: Confirmed
Block: #${18453782 - Math.floor(Math.random() * 10)}
From: 0x${Math.random().toString(16).substring(2, 42)}
To: 0x${Math.random().toString(16).substring(2, 42)}
Value: ${(Math.random() * 5).toFixed(4)} ETH
Gas Used: ${Math.floor(Math.random() * 100000)}
`
                if (showReceipt) {
                  output += `
Receipt:
  Status: 1 (Success)
  Gas Used: ${Math.floor(Math.random() * 100000)}
  Logs: ${Math.floor(Math.random() * 5)}
  Block Number: ${18453782 - Math.floor(Math.random() * 10)}
  Block Hash: 0x${Math.random().toString(16).substring(2, 42)}
`
                }
              }
            } else {
              output = "Error: Transaction hash required. Usage: gettx [hash]"
              isError = true
            }
            break

          case "sendtx":
            if (parts[1] === "--help") {
              output = `
Usage: sendtx [from] [to] [amount] [options]

Send a transaction from one account to another.

Options:
  --gas         Gas limit (default: 21000)
  --gasprice    Gas price in Gwei (default: current network price)
  --data        Transaction data in hex
  --nonce       Nonce value (default: auto)
  
Examples:
  sendtx 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 1.5
  sendtx 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 0.1 --gas 50000
`
            } else if (parts.length >= 4) {
              const from = parts[1]
              const to = parts[2]
              const amount = parts[3]
              const gas = flags["gas"] || "21000"

              output = `
Transaction sent!
Hash: 0x${Math.random().toString(16).substring(2, 42)}
From: ${from}
To: ${to}
Amount: ${amount} ETH
Gas Limit: ${gas}
Status: Pending
`
            } else {
              output = "Error: Missing parameters. Usage: sendtx [from] [to] [amount]"
              isError = true
            }
            break

          case "deploy":
            if (parts[1] === "--help") {
              output = `
Usage: deploy [file] [options]

Deploy a smart contract.

Options:
  --args        Constructor arguments, comma-separated
  --gas         Gas limit (default: auto)
  --from        Address to deploy from (default: first account)
  
Examples:
  deploy MyContract.sol
  deploy MyContract.sol --args "Hello World",123
  deploy MyContract.sol --gas 4000000 --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
`
            } else if (parts[1]) {
              const file = parts[1]
              const args = flags["args"] || ""
              const gas = flags["gas"] || "auto"
              const from = flags["from"] || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

              output = `
Contract deployment initiated!
File: ${file}
Constructor Args: ${args}
Gas Limit: ${gas}
From: ${from}

Transaction Hash: 0x${Math.random().toString(16).substring(2, 42)}
Contract Address: 0x${Math.random().toString(16).substring(2, 42)}
Block: #${18453782}
Status: Success
Gas Used: ${Math.floor(Math.random() * 4000000)}
`
            } else {
              output = "Error: File required. Usage: deploy [file]"
              isError = true
            }
            break

          case "call":
            if (parts[1] === "--help") {
              output = `
Usage: call [address] [method] [args] [options]

Call a contract method (read-only).

Options:
  --from        Address to call from
  --block       Block number to execute against (default: latest)
  --gas         Gas limit (default: auto)
  
Examples:
  call 0x1234... balanceOf "0xabcd..."
  call 0x1234... totalSupply
  call 0x1234... getUser 123 --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
`
            } else if (parts.length >= 3) {
              const address = parts[1]
              const method = parts[2]
              const args = parts
                .slice(3)
                .filter((arg) => !arg.startsWith("-"))
                .join(", ")

              output = `
Contract call executed:
Address: ${address}
Method: ${method}
Arguments: ${args || "none"}

Result: ${Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : `"${Math.random().toString(36).substring(2, 10)}"`}
`
            } else {
              output = "Error: Missing parameters. Usage: call [address] [method] [args]"
              isError = true
            }
            break

          case "events":
            if (parts[1] === "--help") {
              output = `
Usage: events [address] [event] [options]

Get contract events.

Options:
  --fromBlock   Starting block (default: 0)
  --toBlock     Ending block (default: latest)
  --filter      Filter criteria in JSON format
  
Examples:
  events 0x1234... Transfer
  events 0x1234... Transfer --fromBlock 1000000
  events 0x1234... Transfer --filter '{"from":"0x1234..."}'
`
            } else if (parts.length >= 3) {
              const address = parts[1]
              const event = parts[2]
              const fromBlock = flags["fromBlock"] || "0"
              const toBlock = flags["toBlock"] || "latest"

              output = `
Events found for ${event} at ${address}:
From block: ${fromBlock}
To block: ${toBlock}

Event #1:
  Block: #${18453782 - Math.floor(Math.random() * 100)}
  Transaction: 0x${Math.random().toString(16).substring(2, 42)}
  Values: {
    from: "0x${Math.random().toString(16).substring(2, 42)}",
    to: "0x${Math.random().toString(16).substring(2, 42)}",
    value: ${Math.floor(Math.random() * 1000)}
  }

Event #2:
  Block: #${18453782 - Math.floor(Math.random() * 100)}
  Transaction: 0x${Math.random().toString(16).substring(2, 42)}
  Values: {
    from: "0x${Math.random().toString(16).substring(2, 42)}",
    to: "0x${Math.random().toString(16).substring(2, 42)}",
    value: ${Math.floor(Math.random() * 1000)}
  }
`
            } else {
              output = "Error: Missing parameters. Usage: events [address] [event]"
              isError = true
            }
            break

          case "estimategas":
            if (parts[1] === "--help") {
              output = `
Usage: estimategas [tx] [options]

Estimate gas for a transaction.

Options:
  --from        Address to send from
  --to          Address to send to
  --value       Amount in ETH
  --data        Transaction data in hex
  
Examples:
  estimategas --to 0x1234... --value 1.5
  estimategas --to 0x1234... --data 0xabcdef...
`
            } else {
              const to = flags["to"] || parts[1]
              const value = flags["value"] || "0"

              if (to) {
                output = `
Gas Estimation:
To: ${to}
Value: ${value} ETH
${flags["data"] ? `Data: ${flags["data"]}` : ""}

Estimated Gas: ${Math.floor(Math.random() * 100000 + 21000)}
`
              } else {
                output = "Error: Transaction details required. Use --to, --value, --data"
                isError = true
              }
            }
            break

          case "gasprices":
            output = `
Current Gas Price Recommendations:

Low (Slow): ${Math.floor(Math.random() * 20 + 10)} Gwei
Average (< 5 min): ${Math.floor(Math.random() * 20 + 30)} Gwei
Fast (< 2 min): ${Math.floor(Math.random() * 30 + 50)} Gwei
Urgent (< 30 sec): ${Math.floor(Math.random() * 50 + 80)} Gwei

Base Fee: ${Math.floor(Math.random() * 20 + 10)} Gwei
Max Priority Fee: ${Math.floor(Math.random() * 5 + 1)} Gwei
`
            break

          case "createaccount":
            const password = flags["password"] || "********"

            output = `
New account created!
Address: 0x${Math.random().toString(16).substring(2, 42)}
Private Key: [ENCRYPTED]
Password: ${password}

Important: Make sure to backup your keystore file!
`
            break

          case "getaccounts":
            output = `
Available Accounts:
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (100 ETH)
(1) 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (100 ETH)
(2) 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (100 ETH)
(3) 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (100 ETH)
(4) 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (100 ETH)

Private Keys are available in the node logs.
`
            break

          case "getnetwork":
            output = `
Network: Ethereum Mainnet
Chain ID: 1
Latest Block: #18,453,782
Gas Price: 32 Gwei
Sync Status: 87.5% complete
Protocol Version: 66
Network ID: 1
Mining Enabled: ${Math.random() > 0.5 ? "Yes" : "No"}
Peers: 12
Client: Geth/v1.10.26
`
            break

          case "getpeers":
            output = `
Connected Peers: 12
1. Node enode://8f4e...3a2b@192.168.1.101:30303 (Geth/v1.10.23)
2. Node enode://7c3d...9f1a@52.74.12.43:30303 (Geth/v1.10.25)
3. Node enode://2e5f...1c8d@34.239.87.12:30303 (Nethermind/v1.14.1)
...and 9 more
`
            break

          case "mempool":
            output = `
Pending Transactions: ${Math.floor(Math.random() * 1000 + 100)}
Queued Transactions: ${Math.floor(Math.random() * 100)}

Top Pending Transactions:
1. 0x${Math.random().toString(16).substring(2, 42)} - ${Math.floor(Math.random() * 100 + 20)} Gwei - ${Math.floor(Math.random() * 100000)} gas
2. 0x${Math.random().toString(16).substring(2, 42)} - ${Math.floor(Math.random() * 100 + 20)} Gwei - ${Math.floor(Math.random() * 100000)} gas
3. 0x${Math.random().toString(16).substring(2, 42)} - ${Math.floor(Math.random() * 100 + 20)} Gwei - ${Math.floor(Math.random() * 100000)} gas
4. 0x${Math.random().toString(16).substring(2, 42)} - ${Math.floor(Math.random() * 100 + 20)} Gwei - ${Math.floor(Math.random() * 100000)} gas
5. 0x${Math.random().toString(16).substring(2, 42)} - ${Math.floor(Math.random() * 100 + 20)} Gwei - ${Math.floor(Math.random() * 100000)} gas
`
            break

          case "trace":
            if (parts[1]) {
              const txHash = parts[1]
              const mode = flags["mode"] || "vmTrace"

              output = `
Trace for transaction ${txHash}:
Mode: ${mode}

CALL 0x${Math.random().toString(16).substring(2, 42)} -> 0x${Math.random().toString(16).substring(2, 42)} (value: 0 wei)
  GAS: 100000
  INPUT: 0x${Math.random().toString(16).substring(2, 64)}
  
  CALL 0x${Math.random().toString(16).substring(2, 42)} -> 0x${Math.random().toString(16).substring(2, 42)} (value: 0 wei)
    GAS: 50000
    INPUT: 0x${Math.random().toString(16).substring(2, 32)}
    RETURN: 0x${Math.random().toString(16).substring(2, 64)}
  
  SLOAD [${Math.floor(Math.random() * 1000)}] -> 0x${Math.random().toString(16).substring(2, 66)}
  SSTORE [${Math.floor(Math.random() * 1000)}] <- 0x${Math.random().toString(16).substring(2, 66)}
  
  RETURN: 0x${Math.random().toString(16).substring(2, 64)}
`
            } else {
              output = "Error: Transaction hash required. Usage: trace [tx]"
              isError = true
            }
            break

          case "config":
            if (parts.length === 1) {
              output = `
Current Configuration:
datadir: ~/.nanonode/data
networkid: 1
port: 30303
rpcport: 8545
rpcaddr: 127.0.0.1
maxpeers: 50
miner.threads: 4
miner.gasprice: 20000000000
miner.gaslimit: 8000000
`
            } else if (parts.length === 2) {
              output = `${parts[1]}: ${Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : "~/.nanonode/data"}`
            } else {
              output = `Configuration updated: ${parts[1]} = ${parts[2]}`
            }
            break

          case "metrics":
            output = `
Node Metrics:
Uptime: ${metrics.uptime.days} days, ${metrics.uptime.time}
CPU Usage: ${metrics.cpu.toFixed(1)}%
Memory: ${metrics.memory.used.toFixed(2)} MB / ${metrics.memory.total.toFixed(2)} MB
Disk I/O: ${Math.floor(Math.random() * 100)} MB/s read, ${Math.floor(Math.random() * 50)} MB/s write
Network: ${Math.floor(Math.random() * 1000)} KB/s in, ${Math.floor(Math.random() * 500)} KB/s out
Peers: ${Math.floor(Math.random() * 30 + 10)}
Pending Transactions: ${Math.floor(Math.random() * 100)}
Blocks Processed: ${Math.floor(Math.random() * 1000)}
`
            break

          case "version":
            output = `
NanoNode v${version}
Platform: ${Math.random() > 0.5 ? "linux/amd64" : "darwin/amd64"}
Go Version: go1.19.5
Architecture: amd64
Protocol Versions: [66, 67, 68]
API Versions: ["eth", "net", "web3", "personal", "txpool", "debug"]
`
            break

          case "logs":
            const fromBlock = flags["fromBlock"] || "latest-100"
            const toBlock = flags["toBlock"] || "latest"
            const filter = flags["filter"] || "all"

            output = `
Logs from block ${fromBlock} to ${toBlock} (filter: ${filter}):

[${getCurrentTime()}] [INFO] Processed block #18453782 (hash: 0x${Math.random().toString(16).substring(2, 42)})
[${getCurrentTime()}] [INFO] Added 12 transactions to the pool
[${getCurrentTime()}] [WARN] Peer 0x${Math.random().toString(16).substring(2, 10)} disconnected: timeout
[${getCurrentTime()}] [INFO] New peer connected: 0x${Math.random().toString(16).substring(2, 10)}
[${getCurrentTime()}] [INFO] Processed block #18453783 (hash: 0x${Math.random().toString(16).substring(2, 42)})
`
            break

          case "clear":
            setCommandHistory([])
            return

          case "exit":
            output = "Exiting console. Node will continue running in the background."
            break

          default:
            output = `Unknown command: ${mainCommand}. Type 'help' for available commands.`
            isError = true
        }
      } catch (error) {
        output = `Error executing command: ${error}`
        isError = true
      }

      const result: CommandResult = {
        command,
        output,
        isError,
        timestamp: getTimestamp(),
      }

      setCommandHistory((prev) => [...prev, result])
      setHistoryIndex(-1)
      setShowSuggestions(false)
    },
    [isNodeRunning],
  )

  // Handle command input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Handle key presses for command history navigation and suggestion selection
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
        // If a suggestion is selected, use it
        setInputValue(suggestions[selectedSuggestionIndex].name)
        setShowSuggestions(false)
      } else {
        // Otherwise execute the current command
        executeCommand(inputValue)
        setInputValue("")
        setShowSuggestions(false)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (showSuggestions && suggestions.length > 0) {
        // Navigate suggestions
        setSelectedSuggestionIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1))
      } else {
        // Navigate command history
        if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1
          setHistoryIndex(newIndex)
          setInputValue(commandHistory[commandHistory.length - 1 - newIndex].command)
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (showSuggestions && suggestions.length > 0) {
        // Navigate suggestions
        setSelectedSuggestionIndex((prev) => (prev >= suggestions.length - 1 ? 0 : prev + 1))
      } else {
        // Navigate command history
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          setInputValue(commandHistory[commandHistory.length - 1 - newIndex].command)
        } else if (historyIndex === 0) {
          setHistoryIndex(-1)
          setInputValue("")
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      if (suggestions.length > 0) {
        // Use the first suggestion or the selected one
        const suggestionToUse =
          selectedSuggestionIndex >= 0 ? suggestions[selectedSuggestionIndex].name : suggestions[0].name
        setInputValue(suggestionToUse)
        setShowSuggestions(false)
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setShowSuggestions(false)
    // Focus the input after selecting a suggestion
    setTimeout(() => {
      const inputElement = document.getElementById("command-input")
      if (inputElement) {
        inputElement.focus()
      }
    }, 0)
  }

  return {
    commandHistory,
    inputValue,
    suggestions,
    showSuggestions,
    selectedSuggestionIndex,
    handleInputChange,
    handleKeyDown,
    handleSuggestionClick,
    executeCommand,
  }
}

