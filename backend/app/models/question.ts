import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Room from './room.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Answer from './answer.js'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roomId: number

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: any) => {
      if (!value) return []

      // Si ya es array que devuleva arrayyyy normallll eggg
      if (Array.isArray(value)) {
        return value
      }

      // Si es string intentamos  loooooo parseamosss como JSON
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return value.split(',').map((opt) => opt.trim())
        }
      }

      // en Caso inesperado tofca  devolver vacío
      return []
    },
  })
  declare options: string[]

  @column()
  declare correct: string

  @column()
  declare text: string

  @column()
  declare limitSec: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Room)
  declare room: BelongsTo<typeof Room>

  @hasMany(() => Answer)
  declare answers: HasMany<typeof Answer>
}
