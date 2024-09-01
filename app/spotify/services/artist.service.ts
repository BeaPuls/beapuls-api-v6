import Artist from '#profile/models/artist'
import Profile from '#profile/models/profile'
import Track from '#profile/models/track'
import { inject } from '@adonisjs/fold'

@inject()
export default class ArtistService {
  async saveArtist(profileId: Profile['id'], artists: any[]) {
    for (let artist of artists) {
      const newArtist = new Artist()
      newArtist.name = artist.name
      newArtist.providerItemId = artist.id
      newArtist.providerItemImage =
        artist?.images && artist?.images.length ? artist?.images[0]?.url : null
      newArtist.providerItemUri = artist.uri
      newArtist.popularity = artist.popularity
      newArtist.followers = artist.followers?.total
      newArtist.profileId = profileId
      await newArtist.save()
    }
  }

  getArtistsData(artists: Artist[]) {
    const mappdArtists = artists?.map((artist) => {
      return {
        // popularity: track.popularity,
        name: artist.name,
        artistId: artist.id,
        // album: track?.albun?.name,
      }
    })

    return mappdArtists
  }

  async updateFavoriteArtists(profileId: Profile['id'], artists: any[]) {
    const deletedArtists = await Artist.query().where('profile_id', profileId).delete()

    for (const artist of artists) {
      await Artist.updateOrCreate(
        { profileId, providerItemId: artist.id },
        {
          name: artist.name,
          providerItemId: artist.id,
          providerItemImage:
            artist?.images && artist?.images.length ? artist?.images[0]?.url : null,
          providerItemUri: artist.uri,
          popularity: artist.popularity,
          followers: artist.followers?.total,
        }
      )
    }
  }
}
