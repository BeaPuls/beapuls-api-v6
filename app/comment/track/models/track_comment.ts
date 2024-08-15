import Track from '#track/models/track'
import User from '#user/models/user'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

export interface TrackCommentData {
  userId: string
  comment: string
  upVote?: number | undefined
  downVote?: number | undefined
}

export default class TrackComment extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(trackComment: TrackComment) {
    trackComment.id = randomUUID()
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
  @column({ serializeAs: 'userId' })
  declare userId: User['id']
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @column()
  declare comment: string

  @column()
  declare upVote: number

  @column()
  declare downVote: number

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null
}
