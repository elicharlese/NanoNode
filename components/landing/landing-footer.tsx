import Link from "next/link"
import { Github, Twitter, DiscIcon as Discord, Terminal } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="py-12 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 border border-green-700/30 dark:border-green-500/30 flex items-center justify-center">
                <Terminal className="h-4 w-4 text-green-700 dark:text-green-500/80" />
              </div>
              <span className="text-xl font-mono font-bold text-green-700 dark:text-green-500/90">NanoNode</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300/70 mb-6 max-w-md font-mono text-sm">
              NanoNode is an open-source blockchain node interface designed to make blockchain development and
              interaction accessible to everyone.
            </p>
            <div className="flex space-x-4">
              <Link href="https://github.com/nanonode/nanonode" target="_blank" rel="noopener noreferrer">
                <div className="w-10 h-10 border border-gray-300 dark:border-white/10 flex items-center justify-center">
                  <Github className="h-5 w-5 text-gray-700 dark:text-gray-300/80" />
                </div>
              </Link>
              <Link href="https://twitter.com/nanonode" target="_blank" rel="noopener noreferrer">
                <div className="w-10 h-10 border border-gray-300 dark:border-white/10 flex items-center justify-center">
                  <Twitter className="h-5 w-5 text-gray-700 dark:text-gray-300/80" />
                </div>
              </Link>
              <Link href="https://discord.gg/nanonode" target="_blank" rel="noopener noreferrer">
                <div className="w-10 h-10 border border-gray-300 dark:border-white/10 flex items-center justify-center">
                  <Discord className="h-5 w-5 text-gray-700 dark:text-gray-300/80" />
                </div>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-mono font-semibold mb-4 text-green-700 dark:text-green-500/80 uppercase">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://docs.nanonode.dev"
                  className="text-gray-700 dark:text-gray-300/70 hover:text-green-700 dark:hover:text-green-500/80 transition-colors font-mono text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/nanonode/nanonode"
                  className="text-gray-700 dark:text-gray-300/70 hover:text-green-700 dark:hover:text-green-500/80 transition-colors font-mono text-sm"
                >
                  GitHub Repository
                </Link>
              </li>
              <li>
                <Link
                  href="/app"
                  className="text-gray-700 dark:text-gray-300/70 hover:text-green-700 dark:hover:text-green-500/80 transition-colors font-mono text-sm"
                >
                  Launch App
                </Link>
              </li>
              <li>
                <Link
                  href="https://nanonode.dev/blog"
                  className="text-gray-700 dark:text-gray-300/70 hover:text-green-700 dark:hover:text-green-500/80 transition-colors font-mono text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-mono font-semibold mb-4 text-green-700 dark:text-green-500/80 uppercase">
              Community
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://discord.gg/nanonode"
                  className="text-gray-700 dark:text-gray-300/70 hover:text-green-700 dark:hover:text-green-500/80 transition-colors font-mono text-sm"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="https://twitter.com/nanonode"
                  className="text-gray-700 dark:text-gray-300/70 hover:text-green-700 dark:hover:text-green-500/80 transition-colors font-mono text-sm"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/nanonode/nanonode/discussions"
                  className="text-gray-700 dark:text-gray-300/70 hover:text-green-700 dark:hover:text-green-500/80 transition-colors font-mono text-sm"
                >
                  Discussions
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/nanonode/nanonode/issues"
                  className="text-gray-700 dark:text-gray-300/70 hover:text-green-700 dark:hover:text-green-500/80 transition-colors font-mono text-sm"
                >
                  Report Issues
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-700 dark:text-gray-300/70 text-sm font-mono">
            &copy; {new Date().getFullYear()} NanoNode. All rights reserved.
          </p>
          <p className="text-gray-700 dark:text-gray-300/70 text-sm font-mono mt-4 md:mt-0">
            <span className="text-green-700 dark:text-green-500/80">&gt;</span> Made by the NanoNode Team
          </p>
        </div>
      </div>
    </footer>
  )
}

