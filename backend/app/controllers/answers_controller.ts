import type { HttpContext } from '@adonisjs/core/http'
import Answer from '#models/answer'
import Player from '#models/player'
import Question from '#models/question'
import Room from '#models/room'

export default class AnswersController {
  /**
   * Evaluar respuestas y actualizar puntajes
   */
  public async evaluate({ request, response }: HttpContext) {
    const { roomCode, answers } = request.only(['roomCode', 'answers'])

    if (!answers || !Array.isArray(answers)) {
      return response.badRequest({ message: 'Formato de respuestas inválido' })
    }

    const room = await Room.query().where('code', roomCode).firstOrFail()

    const results: any[] = []

    for (const ans of answers) {
      const question = await Question.findOrFail(ans.questionId)
      const player = await Player.findOrFail(ans.playerId)

      const isCorrect = ans.value === question.correct
      let points = 0

      if (isCorrect) {
        const maxTime = question.limitSec * 1000 // tiempo máximo en ms
        const factor = Math.max(0, 1 - ans.timeMs / maxTime)
        points = Math.floor(100 * factor)
      }

      // Guardar respuesta
      await Answer.create({
        roomId: room.id,
        playerId: player.id,
        questionId: question.id,
        value: ans.value,
        isCorrect,
        timeMs: ans.timeMs,
      })

      // Actualizar puntaje del jugador
      player.score += points
      await player.save()

      results.push({
        playerId: player.id,
        nickname: player.nickname,
        isCorrect,
        points,
        totalScore: player.score,
      })
    }

    // Scoreboard ordenado por puntaje
    const scoreboard = await Player.query().where('roomId', room.id).orderBy('score', 'desc')

    return response.ok({ results, scoreboard })
  }
}
