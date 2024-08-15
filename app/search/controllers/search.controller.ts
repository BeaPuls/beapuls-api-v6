import { HttpContext } from '@adonisjs/core/http'
import SpotifyService from '#spotify/services/spotify.service'
import Track from '#track/models/track'
import Artist from '#artist/models/artist'
import Album from '#album/models/album'
import { inject } from '@adonisjs/core'
import { ApiResponse } from '#classes/api_response'
import Profile from '#profile/models/profile'
import AuthProviders from '#auth/models/auth_providers'

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

    // let searchResults = []
    // switch (providerId) {
    //   case 'spotify':
    //     searchResults = await this.spotifyService.search(user.id, query, types)
    //     break
    //   default:
    //     throw new NotFoundException('Provider not found')
    // }

    const authProvider = await AuthProviders.query().where('user_id', userId).first()

    const authProviderName = authProvider?.name

    if (types.includes('track')) {
      let tracks = await Track.query().whereLike('name', `%${query}%`).limit(4)
      console.log(query)
      console.log(tracks)
      if (tracks.length < 4 && authProviderName === 'spotify') {
        const providerTracks = await this.spotifyService.search(
          auth.user.id,
          query,
          ['track'],
          4 - tracks.length
        )
        let spotifyTracks = tracks.concat(providerTracks.tracks.items.slice(0, 4 - tracks.length))

        spotifyTracks.forEach((track) => {
          tracks.push({
            name: track.name,
            albumName: track.album?.name,
            artistName: track.artists[0]?.name,
            providerItemUri: track.uri,
            providerItemImage: track?.album?.images[0].url,
            providerItemId: track.id,
          })
        })
      }
      results.tracks = tracks
    }

    if (types.includes('artist')) {
      let artists = await Artist.query().whereLike('name', `%${query}%`).limit(4)
      if (artists.length < 4 && authProviderName === 'spotify') {
        const providerArtists = await this.spotifyService.search(auth.user.id, query, ['artist'])
        let spotifyArtists = artists.concat(
          providerArtists.artists.items.slice(0, 4 - artists.length)
        )
        spotifyArtists.forEach((artist) => {
          artists.push({
            name: artist.name,
            popularity: artist.popularity,
            followers: artist.followers?.total,
            providerItemUri: artist.uri,
            providerItemImage: artist?.images[0]?.url,
            providerItemId: artist.id,
          })
        })
      }
      results.artists = artists
    }

    if (types.includes('album')) {
      let albums = await Album.query().whereLike('name', `%${query}%`).limit(4)
      if (albums.length < 4 && authProviderName === 'spotify') {
        const providerAlbums = await this.spotifyService.search(auth.user.id, query, ['album'])
        let spotifyAlbums = albums.concat(providerAlbums.albums.items.slice(0, 4 - albums.length))
        spotifyAlbums.forEach((album) => {
          albums.push({
            name: album.name,
            artistName: album.artists[0].name,
            providerItemUri: album.uri,
            providerItemImage: album?.images[0]?.url,
            providerItemId: album.id,
          })
        })
      }
      results.albums = albums
    }

    return ApiResponse.response({ response }, results, 'Search results', 200)
  }
}
