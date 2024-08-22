import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import ProviderType from '#auth/models/provider_type'
import NotFoundException from '#exceptions/not_found.exception'

export interface TrackData {
  name: string
  albumName?: string | undefined
  artistName: string
  providerItemUri: string
  providerItemImage: string
  providerItemId: string
  upVote?: number | undefined
  downVote?: number | undefined
  fromProvider?: boolean | undefined
}

export interface FindBySearchTrackData {
  name: string
  providerTypeId: string
}

export default class Track extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(track: Track) {
    track.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column({ serializeAs: 'albumName' })
  declare albumName?: string

  @column({ serializeAs: 'artistName' })
  declare artistName: string

  @column({ serializeAs: 'providerItemUri' })
  declare providerItemUri?: string

  @column({ serializeAs: 'providerItemImage' })
  declare providerItemImage?: string

  @column({ serializeAs: 'providerItemId' })
  declare providerItemId: string

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
  static async setDefaultProviderType(track: Track) {
    const providerType = await ProviderType.findBy('name', 'Spotify')
    if (!providerType) {
      throw new NotFoundException()
    }
    track.providerTypeId = providerType.id
  }

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null
}
