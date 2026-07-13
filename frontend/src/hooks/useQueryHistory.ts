import { useState, useEffect } from 'react'
import type { QueryResponse } from '@/types/api'

export interface HistoryItem {
  id: string
  question: string
  response: QueryResponse
  timestamp: number
}

const STORAGE_KEY = 'intelrag_history'
const MAX_ITEMS = 50

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useQueryHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory)

  useEffect(() => {
    saveHistory(history)
  }, [history])

  function addItem(question: string, response: QueryResponse) {
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      question,
      response,
      timestamp: Date.now(),
    }
    setHistory(prev => [item, ...prev].slice(0, MAX_ITEMS))
    return item
  }

  function removeItem(id: string) {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  function clearHistory() {
    setHistory([])
  }

  return { history, addItem, removeItem, clearHistory }
}
