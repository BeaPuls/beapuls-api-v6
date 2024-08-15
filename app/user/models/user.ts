import hash from '@adonisjs/core/services/hash'
import {
  BaseModel,
  afterCreate,
  beforeCreate,
  column,
  hasOne,
  manyToMany,
} from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import Profile from '#profile/models/profile'
import { withAuthFinder } from '@adonisjs/auth'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { compose } from '@adonisjs/core/helpers'
import type { HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Role from './role.js'
import { RoleName } from '#user/models/role'
import NotFoundException from '#exceptions/not_found.exception'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static selfAssignPrimaryKey = true

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  currentAccessToken?: AccessToken

  @beforeCreate()
  static async createUUID(user: User) {
    user.id = randomUUID()
  }

  @afterCreate()
  static async setRole(user: User) {
    const role = await Role.findBy('name', RoleName.USER)
    if (!role) {
      throw new NotFoundException('Role not found')
    }
    await user.related('roles').attach([role.id])
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  /**
   * Role relation
   */
  @manyToMany(() => Role, {
    pivotTable: 'role_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'role_id',
  })
  declare roles: ManyToMany<typeof Role>

  /**
   * Profile relation
   */
  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null
}
