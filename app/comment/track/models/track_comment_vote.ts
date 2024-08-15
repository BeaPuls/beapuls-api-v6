import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import TrackComment from './track_comment.js'
import { randomUUID } from 'node:crypto'
import User from '#user/models/user'

export default class TrackCommentVote extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(trackCommentVote: TrackCommentVote) {
    trackCommentVote.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  /**
   * Provider Type relation
   */
  @column({ serializeAs: 'commentId' })
  declare commentId: TrackComment['id']
  @belongsTo(() => TrackComment, { foreignKey: 'commentId' })
  declare comment: BelongsTo<typeof TrackComment>

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
