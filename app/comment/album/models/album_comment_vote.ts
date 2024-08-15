import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import AlbumComment from './album_comment.js'
import { randomUUID } from 'node:crypto'
import User from '#user/models/user'

export default class AlbumCommentVote extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(albumCommentVote: AlbumCommentVote) {
    albumCommentVote.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  /**
   * Provider Type relation
   */
  @column({ serializeAs: 'commentId' })
  declare commentId: AlbumComment['id']
  @belongsTo(() => AlbumComment, { foreignKey: 'commentId' })
  declare comment: BelongsTo<typeof AlbumComment>

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
