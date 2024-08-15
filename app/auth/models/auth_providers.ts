import User from '#user/models/user'
import { SocialProviders } from '@adonisjs/ally/types'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import ProviderType from './provider_type.js'

export default class AuthProviders extends BaseModel {
  @column({ isPrimary: true })
  declare name: keyof SocialProviders

  /**
   * Provider Type relation
   */
  @column({ serializeAs: 'providerTypeId' })
  declare providerTypeId: ProviderType['id']
  @belongsTo(() => ProviderType, { foreignKey: 'providerTypeId' })
  declare providerType: BelongsTo<typeof ProviderType>

  @beforeCreate()
  static async setDefaultProviderType(authProvider: AuthProviders) {
    const providerType = await ProviderType.findByOrFail('name', 'Spotify')
    authProvider.providerTypeId = providerType.id
  }

  /**
   * Value of the token
   */
  @column()
  declare accessToken: string

  /**
   * Refresh token
   */
  @column()
  declare refreshToken: string

  /**
   * Token type
   */
  @column()
  declare type: string

  /**
   * Static time in seconds when the token will expire
   */
  @column()
  declare expiresIn: number

  /**
   * Timestamp at which the token expires
   */
  @column.dateTime({
    autoCreate: false,
    autoUpdate: false,
  })
  declare expiresAt: DateTime

  /**
   * Provider User Id
   */
  @column()
  declare providerUserId: string

  /**
   * User relation
   */
  @column()
  declare userId: User['id']
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
