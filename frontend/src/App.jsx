import { useState, useEffect } from 'react'
import { Dices, History, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [currentRoll, setCurrentRoll] = useState(null)
  const [history, setHistory] = useState([])
  const [isRolling, setIsRolling] = useState(false)

  // Fetch initial history from backend when app loads
  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history')
      const data = await response.json()
      setHistory(data)
    } catch (error) {
      console.error("Failed to fetch history:", error)
    }
  }

  const rollDice = async () => {
    setIsRolling(true)
    
    // Artificial delay to make the animation feel "real"
    setTimeout(async () => {
      try {
        const response = await fetch('/api/roll')
        const data = await response.json()
        setCurrentRoll(data.result)
        fetchHistory() // Refresh history after rolling
      } catch (error) {
        alert("Make sure the backend is running!")
      } finally {
        setIsRolling(false)
      }
    }, 600)
  }

  return (
    <div className="max-w-md w-full p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
          <Dices className="w-10 h-10 text-purple-500" />
          Dice Roller
        </h1>
        <p className="text-slate-400">Test your luck with the server-side roll</p>
      </div>

      {/* Main Dice Area */}
      <div className="bg-slate-800 rounded-3xl p-12 shadow-2xl border border-slate-700 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoll || 'empty'}
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: isRolling ? [0, 90, 180, 270, 360] : 0 
            }}
            transition={{ duration: isRolling ? 0.5 : 0.3, repeat: isRolling ? Infinity : 0 }}
            className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          >
            {currentRoll ? (
              <span className="text-6xl font-bold text-slate-900">{currentRoll}</span>
            ) : (
              <span className="text-4xl font-bold text-slate-300">?</span>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={rollDice}
          disabled={isRolling}
          className={`
            group relative px-8 py-4 bg-purple-600 rounded-xl font-bold text-lg 
            transition-all duration-200 active:scale-95
            ${isRolling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]'}
          `}
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
      </div>

      {/* History Section */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4 text-slate-300">
          <h2 className="flex items-center gap-2 font-semibold">
            <History className="w-4 h-4" />
            Recent Rolls
          </h2>
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          {history.length > 0 ? history.map((roll, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className="bg-slate-700 h-10 rounded-lg flex items-center justify-center font-bold text-purple-300 border border-slate-600"
            >
              {roll.value}
            </motion.div>
          )) : (
            <p className="col-span-5 text-center text-slate-500 text-sm py-2">No rolls yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App