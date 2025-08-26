import app from '@adonisjs/core/services/app'
import { bootSocket } from '#start/socket'

app.ready(async () => {
  const httpServer = await app.container.make('server')
  bootSocket((httpServer as any).nodeServer)
})
