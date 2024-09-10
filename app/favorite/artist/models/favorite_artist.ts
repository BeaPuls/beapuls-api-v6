import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import User from '#user/models/user'
import Artist from '#artist/models/artist'

export default class FavoriteArtist extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static async createUUID(favoriteArtist: FavoriteArtist) {
    favoriteArtist.id = randomUUID()
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * User relation
   */
  @column({ serializeAs: 'userId' })
  declare userId: User['id']
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  /**
   * Track relation
   */
  @column({ serializeAs: 'artistId' })
  declare artistId: Artist['id']
  @belongsTo(() => Artist, { foreignKey: 'artistId' })
  declare artist: BelongsTo<typeof Artist>
}
