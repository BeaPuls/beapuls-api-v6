import Gender, { GenderName } from '#profile/models/gender'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Gender.createMany([
      {
        name: GenderName.MALE,
      },
      {
        name: GenderName.FEMALE,
      },
      {
        name: GenderName.OTHER,
      },
    ])
  }
}
