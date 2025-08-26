import type { HttpContext } from '@adonisjs/core/http'
import Player from '#models/player'
import { io } from '#providers/socket_provider.ts'

export default class PlayersController {
  /**
   * Mostrar un jugador por ID
   */
  public async show({ params, response }: HttpContext) {
    const player = await Player.findOrFail(params.id)

    // Emitir evento opcional: se visualiza un jugador
    io.emit('create-player', {
      id: player.id,
      nickname: player.nickname,
      score: player.score,
    })
    return response.ok({ Player })
  }

  /*crear jugadores */
  public async create({ request, response }: HttpContext) {
    const { nickname } = request.only(['nickname'])

    const player = await Player.create({
      nickname: nickname,
    })

    // Notificar a todos los clientes conectados
    io.emit('create-player', {
      jugador: player.nickname,
    })

    return response.created({ Player })
  }

  /**
   * Listar jugadores de una sala
   */
  public async listByRoom({ params, response }: HttpContext) {
    const players = await Player.query().where('roomId', params.roomId)

    // Emitir evento en tiempo real para la sala
    io.emit('players-list-updated', {
      roomId: params.roomId,
      players: players.map((p) => ({
        id: p.id,
        nickname: p.nickname,
        score: p.score,
      })),
    })

    return response.ok({ players })
  }
}
