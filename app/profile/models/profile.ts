import User from '#auth/models/user'
import Gender from '#profile/models/gender'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import Album from './album.js'
import Artist from './artist.js'
import Track from './track.js'

export default class Profile extends BaseModel {
  @beforeCreate()
  static async createUUID(profile: Profile) {
    profile.id = uuid()
  }

  @column({ isPrimary: true })
  declare id: string

  @column.dateTime({ autoCreate: false, autoUpdate: false, serializeAs: 'dateOfBirth' })
  declare dateOfBirth: DateTime

  @column()
  declare description: string

  @column()
  declare avatar: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null

  // /**
  //  * User prefered gender relation
  //  */
  // @column({ serializeAs: 'preferedGenderId' })
  // declare preferedGenderId: Gender['id']
  // @belongsTo(() => Gender, { foreignKey: 'preferedGenderId' })
  // declare preferedGender: BelongsTo<typeof Gender>

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
