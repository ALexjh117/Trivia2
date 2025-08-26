import type { HttpContext } from '@adonisjs/core/http'
import Player from '#models/player'
import Room from '#models/room'
import { nanoid } from 'nanoid/non-secure' // Para generar códigos únicos
import { io } from '#providers/socket_provider.ts' // Instancia de Socket.io

export default class RoomsController {
  /**
   * Crear una sala
   */
  public async create({ request, response }: HttpContext) {
    const { code, status, nickname } = request.only(['code', 'status', 'nickname'])
    const finalCode = code ?? nanoid(4).toUpperCase()

    const room = await Room.create({
      creador: nickname,
      code: finalCode,
      status: status || 'waiting',
    })

    // Notificar a todos los clientes conectados
    io.emit('room-created', {
      roomId: room.id,
      code: room.code,
      status: room.status,
    })

    return response.created({ room })
  }

  /**
   * Unirse a una sala con nickname
   */
  public async join({ params, request, response }: HttpContext) {
    const { code } = params
    const { nickname } = request.only(['nickname'])

    const room = await Room.query().where('code', code).firstOrFail()

    const player = await Player.create({
      nickname,
      roomId: room.id,
      score: 0,
    })

    // Notificar a todos los clientes conectados
    io.emit('player-joined', {
      playerId: player.id,
      nickname: player.nickname,
      roomCode: room.code,
    })

    return response.ok({ player, room })
  }

  /**
   * Obtener información de la sala (jugadores, estado, etc.)
   */
  public async show({ params, response }: HttpContext) {
    const { code } = params
    const room = await Room.query().where('code', code).preload('players').firstOrFail()

    return response.ok({ room })
  }
}
