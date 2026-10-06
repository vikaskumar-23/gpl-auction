import { useEffect, useState } from 'react'

// The server pings every 15 s when idle. Hearing nothing for 40 s means the connection
// died quietly (Wi-Fi switch, proxy restart), which EventSource alone does not notice.
const STALL_MS = 40_000

// The server pushes the whole auction state on connect and after every change.
export function useLiveState() {
  const [state, setState] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let source
    let stallTimer

    function heard() {
      setConnected(true)
      clearTimeout(stallTimer)
      stallTimer = setTimeout(() => {
        setConnected(false)
        source.close()
        open()
      }, STALL_MS)
    }

    function open() {
      source = new EventSource('/api/events')
      source.addEventListener('state', (e) => {
        setState(JSON.parse(e.data))
        heard()
      })
      source.addEventListener('ping', heard)
      source.onerror = () => setConnected(false) // EventSource retries on its own
    }

    open()
    return () => {
      clearTimeout(stallTimer)
      source.close()
    }
  }, [])

  return { state, connected }
}
