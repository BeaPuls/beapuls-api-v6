import ProviderType, { ProviderTypeName } from '#auth/models/provider_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await ProviderType.createMany([
      {
        name: ProviderTypeName.SPOTIFY,
      },
    ])
  }
}
