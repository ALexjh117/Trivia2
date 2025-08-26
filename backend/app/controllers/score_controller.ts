import type { HttpContext } from '@adonisjs/core/http'
import Player from '#models/player'
import { io } from '#providers/socket_provider.ts'

export default class ScoreboardController {
  /**
   * Mostrar el ranking de una sala
   */
  public async show({ params, response }: HttpContext) {
    const scoreboard = await Player.query().where('roomId', params.roomId).orderBy('score', 'desc')

    // Emitir evento en tiempo real para todos los clientes de la sala
    io.emit('scoreboard-updated', {
      roomId: params.roomId,
      scoreboard: scoreboard.map((p) => ({
        playerId: p.id,
        nickname: p.nickname,
        score: p.score,
      })),
    })

    return response.ok({ scoreboard })
  }
}
