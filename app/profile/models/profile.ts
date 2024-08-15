import User from '#user/models/user'
import Gender from '#profile/models/gender'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import Album from '../../album/models/album.js'
import Artist from '../../artist/models/artist.js'
import Track from '../../track/models/track.js'

export interface ProfileData {
  username: string
  dateOfBirth: DateTime
  description?: string | undefined
  genderId: Gender['id'] | undefined
}

export default class Profile extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(profile: Profile) {
    profile.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare username: string

  @column.date({ autoCreate: false, autoUpdate: false, serializeAs: 'dateOfBirth' })
  declare dateOfBirth: DateTime

  @column()
  declare description?: string

  @column()
  declare avatar?: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null

  /**
   * User Gender relation
   */
  @column({ serializeAs: 'genderId' })
  declare genderId: Gender['id']
  @belongsTo(() => Gender, { foreignKey: 'genderId' })
  declare gender: BelongsTo<typeof Gender>

  /**
   * User relation
   */
  @column({ serializeAs: 'userId' })
  declare userId: User['id']
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  /**
   * Track relation
   */
  @hasMany(() => Track)
  declare tracks: HasMany<typeof Track>

  /**
   * Artist relation
   */
  @hasMany(() => Artist)
  declare artists: HasMany<typeof Artist>

  /**
   * Artist relation
   */
  @hasMany(() => Album)
  declare albums: HasMany<typeof Album>
}
