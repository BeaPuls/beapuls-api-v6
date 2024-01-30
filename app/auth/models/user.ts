import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import { Secret } from '@poppinss/utils'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email:string

  @column({ serializeAs: null })
  declare password: string

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

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  async verifyPasswordForAuth(plainTextPassword: string): Promise<boolean> {
    return hash.verify(this.password, plainTextPassword)
  }
}