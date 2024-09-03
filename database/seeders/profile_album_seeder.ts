import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Album from '#profile/models/album'
import User from '#user/models/user'
import ProviderType, { ProviderTypeName } from '#auth/models/provider_type'
import Profile from '#profile/models/profile'

export default class extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail({ email: 'test@test.com' })
    const profile = await Profile.findByOrFail({ userId: user.id })

    const profileAlbums = [
      {
        profileId: profile.id,
        name: "L'Amour Toujours",
        artistName: "Gigi D'Agostino",
        providerItemUri: 'spotify:album:1234567890',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b2738913380f2f0fa08834ca19ec',
        providerItemId: '1234567890',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        profileId: profile.id,
        name: 'Racine Carrée',
        artistName: 'Stromae',
        providerItemUri: 'spotify:album:0987654321',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b2738913380f2f0fa08834ca19ec',
        providerItemId: '0987654321',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        profileId: profile.id,
        name: 'Random Access Memories',
        artistName: 'Daft Punk',
        providerItemUri: 'spotify:album:2468101214',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b2738913380f2f0fa08834ca19ec',
        providerItemId: '2468101214',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        profileId: profile.id,
        name: 'Nevermind',
        artistName: 'Nirvana',
        providerItemUri: 'spotify:album:1357924680',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b2738913380f2f0fa08834ca19ec',
        providerItemId: '1357924680',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        profileId: profile.id,
        name: '21',
        artistName: 'Adele',
        providerItemUri: 'spotify:album:9876543210',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b2738913380f2f0fa08834ca19ec',
        providerItemId: '9876543210',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
    ]

    await Album.createMany(profileAlbums)
  }
}
