import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Secret } from '@poppinss/utils'
import { DateTime } from 'luxon'

export default class ApiToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column({
    prepare: (accessToken: Secret<string>) => accessToken.release(),
    consume: (accessToken) => new Secret(accessToken),
  })
  declare accessToken: Secret<string>

  @column({
    prepare: (accessToken: Secret<string>) => accessToken.release(),
    consume: (accessToken) => new Secret(accessToken),
  })
  declare refreshToken: Secret<string>
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}