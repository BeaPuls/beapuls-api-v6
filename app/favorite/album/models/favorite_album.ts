import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import User from '#user/models/user'
import Album from '#album/models/album'

export default class FavoriteAlbum extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static async createUUID(favoriteAlbum: FavoriteAlbum) {
    favoriteAlbum.id = randomUUID()
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
   * Album relation
   */
  @column({ serializeAs: 'albumId' })
  declare albumId: Album['id']
  @belongsTo(() => Album, { foreignKey: 'albumId' })
  declare album: BelongsTo<typeof Album>
}
