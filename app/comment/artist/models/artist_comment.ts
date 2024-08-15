import Artist from '#artist/models/artist'
import User from '#user/models/user'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

export interface ArtistCommentData {
  userId: string
  comment: string
  upVote?: number | undefined
  downVote?: number | undefined
}

export default class ArtistComment extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(artistComment: ArtistComment) {
    artistComment.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  /**
   * Provider Type relation
   */
  @column({ serializeAs: 'artistId' })
  declare artistId: Artist['id']
  @belongsTo(() => Artist, { foreignKey: 'artistId' })
  declare artist: BelongsTo<typeof Artist>

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
