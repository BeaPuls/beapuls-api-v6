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
      newArtist.spotifyId = artist.id
      newArtist.spotifyImage = artist.album?.images[0].url
      newArtist.spotifyUri = artist.uri
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

  async updateFavoriteArtists(profileId: Profile['id'], artistIds: Track['id'][]) {
    // TODO ??
    const markFavorite = await Artist.query()
      .where('profile_id', profileId)
      .whereIn('spotify_id', artistIds)

    return {
      data: markFavorite,
    }
  }
}
