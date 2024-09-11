import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Artist from '#profile/models/profile_artist'
import User from '#user/models/user'
import ProviderType, { ProviderTypeName } from '#auth/models/provider_type'
import Profile from '#profile/models/profile'

export default class extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail({ email: 'test@test.com' })
    const profile = await Profile.findByOrFail({ userId: user.id })

    const profileArtists = [
      {
        profileId: profile.id,
        name: "Gigi D'Agostino",
        popularity: '75',
        followers: '1000000',
        providerItemUri: 'spotify:artist:1234567890',
        providerItemImage: 'https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d',
        providerItemId: '1234567890',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        profileId: profile.id,
        name: 'Stromae',
        popularity: '80',
        followers: '2000000',
        providerItemUri: 'spotify:artist:0987654321',
        providerItemImage: 'https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d',
        providerItemId: '0987654321',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        profileId: profile.id,
        name: 'Daft Punk',
        popularity: '85',
        followers: '5000000',
        providerItemUri: 'spotify:artist:2468101214',
        providerItemImage: 'https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d',
        providerItemId: '2468101214',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        profileId: profile.id,
        name: 'Nirvana',
        popularity: '82',
        followers: '8000000',
        providerItemUri: 'spotify:artist:1357924680',
        providerItemImage: 'https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d',
        providerItemId: '1357924680',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        profileId: profile.id,
        name: 'Adele',
        popularity: '90',
        followers: '10000000',
        providerItemUri: 'spotify:artist:9876543210',
        providerItemImage: 'https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d',
        providerItemId: '9876543210',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
    ]

    await Artist.createMany(profileArtists)
  }
}
