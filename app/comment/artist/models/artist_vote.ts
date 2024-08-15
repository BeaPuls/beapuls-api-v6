import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import User from '#user/models/user'
import Artist from '#artist/models/artist'

export default class ArtistVote extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(artistVote: ArtistVote) {
    artistVote.id = randomUUID()
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
