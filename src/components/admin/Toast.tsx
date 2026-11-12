import { CircleAlert, CircleCheck } from 'lucide-react'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type Kind = 'ok' | 'error'
type Item = { id: number; kind: Kind; text: string }
type Push = (text: string, kind?: Kind) => void

const Ctx = createContext<Push>(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const push = useCallback<Push>((text, kind = 'ok') => {
    const id = Date.now() + Math.random()
    setItems((l) => [...l, { id, kind, text }])
    setTimeout(() => setItems((l) => l.filter((i) => i.id !== id)), 3600)
  }, [])

  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="adm-toasts" role="status" aria-live="polite">
        {items.map((i) => (
          <div key={i.id} className={`adm-toast ${i.kind}`}>
            {i.kind === 'ok' ? <CircleCheck size={18} aria-hidden /> : <CircleAlert size={18} aria-hidden />}
            {i.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
