import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

const useSocket = () => {
    const [lastEvent, setLastEvent] = useState(null)

    useEffect(() => {
        socket.on('new_event', (event) => {
            setLastEvent(event)
        })

        return () => socket.off('new_event')
    }, [])

    return { lastEvent }
}

export default useSocket