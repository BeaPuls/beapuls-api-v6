import hash from '@adonisjs/core/services/hash'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import { Secret } from '@poppinss/utils'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email:string

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

  @column()
  declare spotifyId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime


  async verifyPasswordForAuth(plainTextPassword: string): Promise<boolean> {
    return hash.verify(this.password, plainTextPassword)
  }
}