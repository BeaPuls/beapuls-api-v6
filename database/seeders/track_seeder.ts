import ProviderType, { ProviderTypeName } from '#auth/models/provider_type'
import TrackComment from '#comment/track/models/track_comment'
import Track from '#track/models/track'
import User from '#user/models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail({ email: 'test@test.com' })

    const tracks = await Track.createMany([
      {
        name: 'Chanson 1',
        artistName: 'Artiste 1',
        providerItemUri: 'spotify:track:1',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b273344403ed94dcda43160ad0f3',
        providerItemId: '1',
        providerTypeId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        name: 'Chanson 2',
        artistName: 'Artiste 2',
        providerItemUri: 'spotify:track:2',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b273344403ed94dcda43160ad0f3',
        providerItemId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        name: 'Chanson 3',
        artistName: 'Artiste 3',
        providerItemUri: 'spotify:track:3',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b273344403ed94dcda43160ad0f3',
        providerItemId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        name: 'Chanson 4',
        artistName: 'Artiste 4',
        providerItemUri: 'spotify:track:4',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b273344403ed94dcda43160ad0f3',
        providerItemId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
      {
        name: 'Chanson 5',
        artistName: 'Artiste 5',
        providerItemUri: 'spotify:track:5',
        providerItemImage: 'https://i.scdn.co/image/ab67616d0000b273344403ed94dcda43160ad0f3',
        providerItemId: await ProviderType.findByOrFail('name', ProviderTypeName.SPOTIFY).then(
          (pt) => pt.id
        ),
      },
    ])

    const comments = [
      'Superbe chanson !',
      "J'adore ce morceau",
      'Pas mal du tout',
      'Ça me rappelle de bons souvenirs',
      'Un classique intemporel',
    ]

    for (const track of tracks) {
      await TrackComment.create({
        userId: user.id,
        trackId: track.id,
        comment: comments[Math.floor(Math.random() * comments.length)],
        upVote: 3,
        downVote: 2,
      })
    }
  }
}
