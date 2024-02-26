import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import Profile from './profile.js'

export default class Track extends BaseModel {
  @beforeCreate()
  static async createUUID(track: Track) {
    track.id = uuid()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name?: string

  @column({ serializeAs: 'albumName' })
  declare albumName?: string

  @column({ serializeAs: 'artistName' })
  declare artistName?: string

  @column({ serializeAs: 'spotifyUri' })
  declare spotifyUri?: string

  @column({ serializeAs: 'spotifyImage' })
  declare spotifyImage?: string

  @column({ serializeAs: 'spotifyId' })
  declare spotifyId?: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null

  /**
   * Profile relation
   */
  @column({ serializeAs: 'profileId' })
  declare profileId: Profile['id']
  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>
}
