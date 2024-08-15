import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

export enum GenderName {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}
export default class Gender extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(gender: Gender) {
    gender.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: GenderName

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null
}
