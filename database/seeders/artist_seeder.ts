import ProviderType, { ProviderTypeName } from '#auth/models/provider_type'
import ArtistComment from '#comment/artist/models/artist_comment'
import Artist from '#artist/models/artist'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#user/models/user'

export default class extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail({ email: 'test@test.com' })

    const artists = await Artist.createMany([
      {
        name: 'Artiste 1',
        popularity: '80',
        followers: '1000000',
        providerItemUri: 'spotify:artist:1',
        providerItemImage: 'https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d',
        providerItemId: '1',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
        upVote: 100,
        downVote: 10,
      },
      {
        name: 'Artiste 2',
        popularity: '75',
        followers: '750000',
        providerItemUri: 'spotify:artist:2',
        providerItemImage: 'https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d',
        providerItemId: '2',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
        upVote: 80,
        downVote: 15,
      },
      {
        name: 'Artiste 3',
        popularity: '70',
        followers: '500000',
        providerItemUri: 'spotify:artist:3',
        providerItemImage: 'https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d',
        providerItemId: '3',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
        upVote: 60,
        downVote: 20,
      },
      {
        name: 'Artiste 4',
        popularity: '65',
        followers: '250000',
        providerItemUri: 'spotify:artist:4',
        providerItemImage: 'https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d',
        providerItemId: '4',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
        upVote: 40,
        downVote: 25,
      },
      {
        name: 'Artiste 5',
        popularity: '60',
        followers: '100000',
        providerItemUri: 'spotify:artist:5',
        providerItemImage: 'https://i.scdn.co/image/ab6761610000e5eb0c68f6c95232e716f0abee8d',
        providerItemId: '5',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
        upVote: 20,
        downVote: 30,
      },
    ])

    const comments = [
      'Artiste incroyable !',
      "J'adore leur musique",
      'Pas mal du tout',
      'Ça me rappelle de bons souvenirs',
      'Un classique intemporel',
    ]

    for (const artist of artists) {
      await ArtistComment.create({
        userId: user.id,
        artistId: artist.id,
        comment: comments[Math.floor(Math.random() * comments.length)],
        upVote: Math.floor(Math.random() * 50),
        downVote: Math.floor(Math.random() * 20),
      })
    }
  }
}
