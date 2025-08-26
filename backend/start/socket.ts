// start/socket.ts
import { Server } from 'socket.io'
import Player from '#models/player'
import Room from '#models/room'

export let io: Server

export const bootSocket = (nodeServer: any) => {
  console.log('🔌 Booting Socket.IO...')

  // 👇 aquí el cambio importante: usar .instance
  io = new Server(nodeServer.instance, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('✅ Cliente conectado:', socket.id)

    socket.on('join-room', ({ roomCode }) => {
      socket.join(roomCode)
      console.log(`Jugador ${socket.id} se unió a la sala ${roomCode}`)
    })

    socket.on('end-round', async ({ roomCode }) => {
      try {
        const room = await Room.query().where('code', roomCode).firstOrFail()
        const scoreboard = await Player.query()
          .where('roomId', room.id)
          .select('id as playerId', 'nickname', 'score')

        io.to(roomCode).emit('round-ended', { roomCode, scoreboard })
      } catch (error) {
        console.error('Error finalizando ronda:', error)
      }
    })

    socket.on('disconnect', () => {
      console.log('❌ Cliente desconectado:', socket.id)
    })
  })
}
