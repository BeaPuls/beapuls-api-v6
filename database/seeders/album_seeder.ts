import ProviderType, { ProviderTypeName } from '#auth/models/provider_type'
import AlbumComment from '#comment/album/models/album_comment'
import Album from '#album/models/album'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#user/models/user'

export default class extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail({ email: 'test@test.com' })

    const albums = await Album.createMany([
      {
        name: 'Album 1',
        artistName: 'Artiste 1',
        providerItemUri: 'spotify:album:1',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b273123456789abcdef123456789',
        providerItemId: '1',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
        upVote: 100,
        downVote: 10,
      },
      {
        name: 'Album 2',
        artistName: 'Artiste 2',
        providerItemUri: 'spotify:album:2',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b273234567890abcdef234567890',
        providerItemId: '2',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
        upVote: 80,
        downVote: 15,
      },
      {
        name: 'Album 3',
        artistName: 'Artiste 3',
        providerItemUri: 'spotify:album:3',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b273345678901abcdef345678901',
        providerItemId: '3',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
        upVote: 60,
        downVote: 20,
      },
      {
        name: 'Album 4',
        artistName: 'Artiste 4',
        providerItemUri: 'spotify:album:4',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b273456789012abcdef456789012',
        providerItemId: '4',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
        upVote: 40,
        downVote: 25,
      },
      {
        name: 'Album 5',
        artistName: 'Artiste 5',
        providerItemUri: 'spotify:album:5',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b273567890123abcdef567890123',
        providerItemId: '5',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
        upVote: 20,
        downVote: 30,
      },
    ])

    const comments = [
      'Album incroyable !',
      "J'adore cet album",
      'Pas mal du tout',
      'Ça me rappelle de bons souvenirs',
      'Un classique intemporel',
    ]

    for (const album of albums) {
      await AlbumComment.create({
        userId: user.id,
        albumId: album.id,
        comment: comments[Math.floor(Math.random() * comments.length)],
        upVote: Math.floor(Math.random() * 50),
        downVote: Math.floor(Math.random() * 20),
      })
    }
  }
}
