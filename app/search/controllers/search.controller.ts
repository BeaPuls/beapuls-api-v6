import { HttpContext } from '@adonisjs/core/http'
import SpotifyService from '#spotify/services/spotify.service'
import Track from '#track/models/track'
import Artist from '#artist/models/artist'
import Album from '#album/models/album'
import { inject } from '@adonisjs/core'
import { ApiResponse } from '#classes/api_response'
import Profile from '#profile/models/profile'
import { types } from 'node:util'

@inject()
export default class SearchController {
  constructor(private spotifyService: SpotifyService) {}

  async search({ auth, request, response }: HttpContext) {
    const userId = auth.user?.id ?? null
    const { query, types } = request.only(['query', 'types'])

    const results = {
      profiles: [] as Profile[],
      tracks: [] as Track[],
      artists: [] as Artist[],
      albums: [] as Album[],
    }

    const profiles = await Profile.query().whereLike('username', `%${query}%`).limit(3)
    if (profiles.length > 0) {
      results.profiles = profiles
    }

    // const authProvider = await AuthProviders.query().where('user_id', userId).first()

    // const authProviderName = authProvider?.name
    const authProviderName = 'spotify'

    if (types.includes('track')) {
      // let tracks = await Track.query().whereLike('name', `%${query}%`).limit(4)
      // if (tracks.length < 4 && authProviderName === 'spotify') {
      const providerTracks = await this.spotifyService.search(query, ['track'], 8)
      providerTracks.tracks.items.forEach((track) => {
        results.tracks.push({
          name: track.name,
          albumName: track?.album?.name,
          artistName:
            track?.artists && track?.artists.length
              ? track?.artists.map((artist) => artist.name).join(', ')
              : null,
          providerItemUri: track.uri,
          providerItemImage:
            track?.album?.images && track?.album?.images.length
              ? track?.album?.images[0]?.url
              : null,
          providerItemId: track.id,
        })
      })
    }

    if (types.includes('artist')) {
      const providerArtists = await this.spotifyService.search(query, ['artist'], 8)
      providerArtists.artists.items.forEach((artist) => {
        results.artists.push({
          name: artist.name,
          popularity: artist.popularity,
          followers: artist.followers?.total,
          providerItemUri: artist.uri,
          providerItemImage:
            artist?.images && artist?.images.length ? artist?.images[0]?.url : null,
          providerItemId: artist.id,
        })
      })
    }

    if (types.includes('album')) {
      const providerAlbums = await this.spotifyService.search(query, ['album'], 8)
      providerAlbums.albums.items.forEach((album) => {
        results.albums.push({
          name: album.name,
          artistName:
            album?.artists && album?.artists.length
              ? album?.artists.map((artist) => artist.name).join(', ')
              : null,
          providerItemUri: album.uri,
          providerItemImage: album?.images && album?.images.length ? album?.images[0]?.url : null,
          providerItemId: album.id,
        })
      })
    }

    return ApiResponse.response({ response }, results, 'Search results', 200)
  }
}
