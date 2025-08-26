import { io } from './socket.js'
import type { Socket } from 'socket.io'

io.on('connection', (socket: Socket) => {
  console.log('Cliente conectado al chat:', socket.id)

  socket.on('message', (data: string) => {
    console.log('📩 Mensaje recibido:', data)

    // reenviar a todos menos al emisor
    socket.broadcast.emit('message', data)
  })
})
