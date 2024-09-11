import { HttpContext } from '@adonisjs/core/http'
import SpotifyService from '#spotify/services/spotify.service'
import Track from '#track/models/track'
import Artist from '#artist/models/artist'
import Album from '#album/models/album'
import { inject } from '@adonisjs/core'
import { ApiResponse } from '#classes/api_response'
import Profile from '#profile/models/profile'
import drive from '@adonisjs/drive/services/main'

@inject()
export default class SearchController {
  constructor(private spotifyService: SpotifyService) {}

  async search({ request, response }: HttpContext) {
    let { query, types } = request.only(['query', 'types'])

    const defaultImage = await drive.use().getUrl('uploads/profile.png')
    const results = {
      profiles: [] as Profile[],
      tracks: [] as Track[],
      artists: [] as Artist[],
      albums: [] as Album[],
    }

    if (types.includes('profile')) {
      const profiles = await Profile.query().whereLike('username', `%${query}%`).limit(3)
      if (profiles.length > 0) {
        results.profiles = profiles
      }
      types = types.filter((type) => type !== 'profile')
    }

    const authProviderName = 'spotify'

    if (types.length > 0 && authProviderName === 'spotify') {
      const providerResults = await this.spotifyService.search(query, types, 8)

      if (types.includes('track')) {
        results.tracks =
          providerResults.tracks?.items.map((track) => ({
            name: track.name,
            albumName: track.album?.name,
            artistName: track.artists?.map((artist) => artist.name).join(', ') || null,
            providerItemUri: track.uri,
            providerItemImage: track.album?.images?.[0]?.url ?? defaultImage,
            providerItemId: track.id,
          })) || []
      }

      if (types.includes('artist')) {
        results.artists =
          providerResults.artists?.items.map((artist) => ({
            name: artist.name,
            popularity: artist.popularity,
            followers: artist.followers?.total,
            providerItemUri: artist.uri,
            providerItemImage: artist.images?.[0]?.url ?? defaultImage,
            providerItemId: artist.id,
          })) || []
      }

      if (types.includes('album')) {
        results.albums =
          providerResults.albums?.items.map((album) => ({
            name: album.name,
            artistName: album.artists?.map((artist) => artist.name).join(', ') || null,
            providerItemUri: album.uri,
            providerItemImage: album.images?.[0]?.url ?? defaultImage,
            providerItemId: album.id,
          })) || []
      }
    }

    return ApiResponse.response({ response }, results, 'Search results', 200)
  }
}
