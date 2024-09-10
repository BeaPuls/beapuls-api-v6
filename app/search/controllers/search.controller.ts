import { HttpContext } from '@adonisjs/core/http'
import SpotifyService from '#spotify/services/spotify.service'
import Track from '#track/models/track'
import Artist from '#artist/models/artist'
import Album from '#album/models/album'
import { inject } from '@adonisjs/core'
import { ApiResponse } from '#classes/api_response'
import Profile from '#profile/models/profile'
import console from 'node:console'

@inject()
export default class SearchController {
  constructor(private spotifyService: SpotifyService) {}

  async search({ auth, request, response }: HttpContext) {
    let { query, types } = request.only(['query', 'types'])

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
            album_name: track.album?.name,
            artist_name: track.artists?.map((artist) => artist.name).join(', ') || null,
            provider_item_uri: track.uri,
            provider_item_image: track.album?.images?.[0]?.url || null,
            provider_item_id: track.id,
          })) || []
      }

      if (types.includes('artist')) {
        results.artists =
          providerResults.artists?.items.map((artist) => ({
            name: artist.name,
            popularity: artist.popularity,
            followers: artist.followers?.total,
            provider_item_uri: artist.uri,
            provider_item_image: artist.images?.[0]?.url || null,
            provider_item_id: artist.id,
          })) || []
      }

      if (types.includes('album')) {
        results.albums =
          providerResults.albums?.items.map((album) => ({
            name: album.name,
            artist_name: album.artists?.map((artist) => artist.name).join(', ') || null,
            provider_item_uri: album.uri,
            provider_item_image: album.images?.[0]?.url || null,
            provider_item_id: album.id,
          })) || []
      }
    }

    return ApiResponse.response({ response }, results, 'Search results', 200)
  }
}
