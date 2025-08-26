import type { HttpContext } from '@adonisjs/core/http'
import Question from '#models/question'
import Room from '#models/room'
import { io } from '#providers/socket_provider.ts'

export default class QuestionsController {
  /**
   * Devuelve la siguiente pregunta de la sala
   */
  public async next({ params, response }: HttpContext) {
    const { code } = params

    // Buscar sala
    const room = await Room.query().where('code', code).firstOrFail()

    // Obtener la siguiente pregunta disponible (puedes mejorar con "sin responder")
    const question = await Question.query().where('roomId', room.id).first()

    if (!question) {
      return response.notFound({ message: 'No hay preguntas disponibles' })
    }

    // Emitir evento a jugadores
    io.emit('new-question', {
      roomCode: room.code,
      question: {
        id: question.id,
        text: question.text,
        options: question.options,
      },
    })

    return response.ok({ question })
  }

  /**
   * Crear una nueva pregunta en la sala
   */
  public async create({ params, request, response }: HttpContext) {
    const { code } = params
    const { text, options, correct, limitSec } = request.only([
      'text',
      'options',
      'correct',
      'limitSec',
    ])
    let optionsArray = options
    // Validar entrada

    // Si llega como string (por ejemplo desde formulario)
    if (typeof options === 'string') {
      optionsArray = options.split(',').map((opt) => opt.trim())
    }
    if (!text || !options || !Array.isArray(options) || options.length < 2) {
      return response.badRequest({ message: 'Pregunta u opciones inválidas' })
    }
    const room = await Room.query().where('code', code).firstOrFail()

    // Guardar pregunta
    const question = await Question.create({
      roomId: room.id,
      text,
      options: optionsArray,
      correct,
      limitSec,
    })

    // Emitir evento de nueva pregunta
    io.emit('new-question', {
      roomCode: room.code,
      question: {
        id: question.id,
        text: question.text,
        options: question.options,
      },
    })

    return response.created({ question })
  }
}
