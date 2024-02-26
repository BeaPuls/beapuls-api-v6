import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export enum GenderName {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}
export default class Gender extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: GenderName

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null
}
