import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import Profile from '#profile/models/profile'
import { withAuthFinder } from '@adonisjs/auth'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { Secret, compose } from '@adonisjs/core/helpers'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { v4 as uuid } from 'uuid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  currentAccessToken?: AccessToken

  @beforeCreate()
  static async createUUID(user: User) {
    user.id = uuid()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare username: string

  @column()
  declare email: string

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

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null

  /**
   * Profile relation
   */
  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>
}
