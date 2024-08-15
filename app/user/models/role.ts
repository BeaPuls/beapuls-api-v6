import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import User from './user.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export enum RoleName {
  USER = 'User',
  ADMIN = 'Admin',
}

export default class Role extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static async createUUID(role: Role) {
    role.id = randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null

  /**
   * Role relation
   */
  @manyToMany(() => User, {
    pivotTable: 'role_users',
    pivotForeignKey: 'role_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof User>
}
