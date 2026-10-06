import { useEffect, useState } from 'react'

// The server pushes the whole auction state on connect and after every change.
export function useLiveState() {
  const [state, setState] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const source = new EventSource('/api/events')
    source.addEventListener('state', (e) => {
      setState(JSON.parse(e.data))
      setConnected(true)
    })
    source.onerror = () => setConnected(false) // EventSource retries on its own
    return () => source.close()
  }, [])

  return { state, connected }
}
