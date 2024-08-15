import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import User from '#user/models/user'
import Track from '#track/models/track'

export default class TrackVote extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(trackVote: TrackVote) {
    trackVote.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  /**
   * Provider Type relation
   */
  @column({ serializeAs: 'trackId' })
  declare trackId: Track['id']
  @belongsTo(() => Track, { foreignKey: 'trackId' })
  declare track: BelongsTo<typeof Track>

  /**
   * User relation
   */
  @column()
  declare userId: User['id']
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @column()
  declare voteType: 'up' | 'down'

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null
}
