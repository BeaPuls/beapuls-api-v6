import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import Profile from './profile.js'
import AuthProviders from '#auth/models/auth_providers'
import ProviderType from '#auth/models/provider_type'

export default class Artist extends BaseModel {
  static table = 'profile_artists'
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(artist: Artist) {
    artist.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name?: string

  @column()
  declare popularity?: string

  @column()
  declare followers?: string

  @column({ serializeAs: 'providerItemUri' })
  declare providerItemUri?: string

  @column({ serializeAs: 'providerItemImage' })
  declare providerItemImage?: string

  @column({ serializeAs: 'providerItemId' })
  declare providerItemId?: string

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
   * Profile relation
   */
  @column({ serializeAs: 'profileId' })
  declare profileId: Profile['id']
  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null
}
