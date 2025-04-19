"use client"

import { useState, useEffect } from "react"
import { TypingAnimation } from "./typing-animation"

interface TerminalProps {
  commands: {
    command: string
    output: string
    delay?: number
    typingSpeed?: number
  }[]
  className?: string
  prompt?: string
  loop?: boolean
}

export function Terminal({ commands, className = "", prompt = "nanonode@system:~$", loop = false }: TerminalProps) {
  const [visibleCommands, setVisibleCommands] = useState<number[]>([])
  const [visibleOutputs, setVisibleOutputs] = useState<number[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < commands.length) {
      // Show the command
      setVisibleCommands((prev) => [...prev, currentIndex])

      // After command is typed, show output
      const commandDelay = commands[currentIndex].delay || 1000
      const timer = setTimeout(() => {
        setVisibleOutputs((prev) => [...prev, currentIndex])

        // Move to next command after output is shown
        const outputDelay = commands[currentIndex].output.length * 10 + 1000
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1)
        }, outputDelay)
      }, commandDelay)

      return () => clearTimeout(timer)
    } else if (loop) {
      // Reset for loop
      setTimeout(() => {
        setVisibleCommands([])
        setVisibleOutputs([])
        setCurrentIndex(0)
      }, 3000)
    }
  }, [currentIndex, commands, loop])

  return (
    <div className={`glass-panel p-4 font-mono text-green-700 dark:text-green-500/90 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-2 border-b border-gray-200 dark:border-white/5 pb-1">
        <div className="text-xs">Terminal - NanoNode v1.21.0</div>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500/80 rounded-sm"></div>
          <div className="w-3 h-3 bg-yellow-500/80 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-500/80 rounded-sm"></div>
        </div>
      </div>

      <div className="space-y-2">
        {commands.map((cmd, index) => (
          <div key={index} className={index > Math.max(...visibleCommands, 0) ? "hidden" : ""}>
            {visibleCommands.includes(index) && (
              <div className="flex">
                <span className="text-green-700/70 dark:text-green-500/70 mr-2">{prompt}</span>
                <TypingAnimation text={cmd.command} speed={cmd.typingSpeed || 50} cursor={false} />
              </div>
            )}

            {visibleOutputs.includes(index) && (
              <div className="pl-6 text-green-700/80 dark:text-green-400/80 mt-1 whitespace-pre-line">{cmd.output}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

