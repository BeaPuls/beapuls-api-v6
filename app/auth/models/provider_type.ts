import Album from '../../album/models/album.js'
import Artist from '../../artist/models/artist.js'
import Track from '../../track/models/track.js'
import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import AuthProviders from './auth_providers.js'

export enum ProviderTypeName {
  SPOTIFY = 'Spotify',
}
export default class ProviderType extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignUuid(providerType: ProviderType) {
    providerType.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: ProviderTypeName

  /**
   * Track relation
   */
  @hasOne(() => Track)
  declare track: HasOne<typeof Track>

  /**
   * Album relation
   */
  @hasOne(() => Album)
  declare album: HasOne<typeof Album>

  /**
   * Artist relation
   */
  @hasOne(() => Artist)
  declare artist: HasOne<typeof Artist>

  /**
   * Auth relation
   */
  @hasOne(() => AuthProviders)
  declare authProviders: HasOne<typeof AuthProviders>
}
