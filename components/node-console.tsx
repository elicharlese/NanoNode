"use client"

import { useNodeConsole } from "@/hooks/use-node-console"
import { useEffect, useRef } from "react"

interface NodeConsoleProps {
  isRunning: boolean
}

export function NodeConsole({ isRunning }: NodeConsoleProps) {
  const {
    commandHistory,
    inputValue,
    suggestions,
    showSuggestions,
    selectedSuggestionIndex,
    handleInputChange,
    handleKeyDown,
    handleSuggestionClick,
    executeCommand,
  } = useNodeConsole(isRunning)

  const consoleEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the bottom when new commands are added
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [commandHistory])

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Add welcome message when component mounts
  useEffect(() => {
    if (commandHistory.length === 0) {
      executeCommand("help")
    }
  }, [executeCommand, commandHistory.length])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        // Click is outside suggestions and input
        if (showSuggestions) {
          // Only update if suggestions are currently shown
          handleSuggestionClick("")
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSuggestions, handleSuggestionClick])

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 overflow-auto font-mono text-sm mb-4">
        {commandHistory.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 mr-2">[{item.timestamp}]</span>
              <span className="text-green-600 dark:text-green-500 mr-2">&gt;</span>
              <span className="text-gray-900 dark:text-white">{item.command}</span>
            </div>
            <div
              className={`ml-8 whitespace-pre-wrap ${item.isError ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}
            >
              {item.output}
            </div>
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>

      <div className="relative">
        <div className="flex items-center glass-input rounded-md">
          <span className="text-green-600 dark:text-green-500 px-2">&gt;</span>
          <input
            ref={inputRef}
            id="command-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white p-2 font-mono"
            placeholder={isRunning ? "Type a command (try 'help')" : "Start the node to enable commands..."}
            disabled={!isRunning}
            autoComplete="off"
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 glass-card rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-2 hover:bg-white/30 dark:hover:bg-gray-700/50 cursor-pointer ${
                  index === selectedSuggestionIndex ? "bg-white/30 dark:bg-gray-700/50" : ""
                }`}
                onClick={() => handleSuggestionClick(suggestion.name)}
              >
                <div className="font-mono text-gray-900 dark:text-white">{suggestion.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{suggestion.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 px-2">
        {isRunning
          ? "Tip: Use up/down arrows to navigate history, Tab to complete suggestions"
          : "Node is offline. Start the node to interact with the blockchain."}
      </div>
    </div>
  )
}

