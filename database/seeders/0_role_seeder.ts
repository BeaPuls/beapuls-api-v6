import Role, { RoleName } from '#user/models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      {
        name: RoleName.USER,
      },
      {
        name: RoleName.ADMIN,
      },
    ])
  }
}
