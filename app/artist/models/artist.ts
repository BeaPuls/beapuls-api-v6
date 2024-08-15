import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import ProviderType from '#auth/models/provider_type'
import NotFoundException from '#exceptions/not_found.exception'

export interface ArtistData {
  name: string
  popularity: number | undefined
  followers: number | undefined
  providerItemUri: string
  providerItemImage: string
  providerItemId: string
  providerTypeId: string | undefined
  upVote: number | undefined
  downVote: number | undefined
}

export interface FindBySearchArtistData {
  name: string
  providerTypeId: string
}

export default class Artist extends BaseModel {
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

  @column()
  declare upVote: number

  @column()
  declare downVote: number

  /**
   * Provider Type relation
   */
  @column({ serializeAs: 'providerTypeId' })
  declare providerTypeId: ProviderType['id']
  @belongsTo(() => ProviderType, { foreignKey: 'providerTypeId' })
  declare providerType: BelongsTo<typeof ProviderType>

  @beforeCreate()
  static async setDefaultProviderType(artist: Artist) {
    const providerType = await ProviderType.findBy('name', 'Spotify')
    if (!providerType) {
      throw new NotFoundException()
    }
    artist.providerTypeId = providerType.id
  }

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null
}
