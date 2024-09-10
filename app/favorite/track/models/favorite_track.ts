import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import User from '#user/models/user'
import Track from '#track/models/track'

export default class FavoriteTrack extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static async createUUID(favoriteTrack: FavoriteTrack) {
    favoriteTrack.id = randomUUID()
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
  @column({ serializeAs: 'trackId' })
  declare trackId: Track['id']
  @belongsTo(() => Track, { foreignKey: 'trackId' })
  declare track: BelongsTo<typeof Track>
}
