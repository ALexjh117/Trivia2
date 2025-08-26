import { Server } from 'socket.io'
import type { ApplicationService } from '@adonisjs/core/types'

export let io: Server

export default class SocketProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    console.log('🔌 Booting Socket.IO...')

    // 👇 Aquí obtenemos el servidor HTTP nativo de Adonis
    const httpServer: any = await this.app.container.make('server')

    io = new Server(httpServer.instance, {
      cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
      },
    })

    io.on('connection', (socket) => {
      console.log('✅ Cliente conectado:', socket.id)
    })
  }
}
