import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Secret } from '@poppinss/utils'
import { DateTime } from 'luxon'

export default class ApiToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column({
    prepare: (token: Secret<string>) => token.release(),
    consume: (token) => new Secret(token),
  })
  declare token: Secret<string>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: false })
  declare expireAt: DateTime
}
