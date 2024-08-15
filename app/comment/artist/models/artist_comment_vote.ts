import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ArtistComment from './artist_comment.js'
import { randomUUID } from 'node:crypto'
import User from '#user/models/user'

export default class ArtistCommentVote extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(artistCommentVote: ArtistCommentVote) {
    artistCommentVote.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  /**
   * Provider Type relation
   */
  @column({ serializeAs: 'commentId' })
  declare commentId: ArtistComment['id']
  @belongsTo(() => ArtistComment, { foreignKey: 'commentId' })
  declare comment: BelongsTo<typeof ArtistComment>

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
