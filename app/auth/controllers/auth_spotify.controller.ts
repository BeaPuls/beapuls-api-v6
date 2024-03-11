import AuthProviders from '#auth/models/auth_providers'
import User from '#auth/models/user'
import Artist from '#profile/models/artist'
import Track from '#profile/models/track'
import ProfileService from '#profile/services/profile.service'
import ArtistService from '#spotify/services/artist.service'
import SpotifyService from '#spotify/services/spotify.service'
import TrackService from '#spotify/services/track.service'
import env from '#start/env'
import { AllyService } from '@adonisjs/ally/types'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { inject } from '@adonisjs/core'
import { type HttpContext } from '@adonisjs/core/http'
import { Exception } from '@poppinss/utils'
import { DateTime } from 'luxon'

@inject()
export default class SpotifyController {
  constructor(
    private profileService: ProfileService,
    private spotifyService: SpotifyService,
    private trackService: TrackService,
    private artistService: ArtistService
  ) {}

  async authorize({ ally }: HttpContext) {
    return ally.use('spotify').stateless().redirect()
  }

  async useSpotify(ally: AllyService) {
    const spotify = ally.use('spotify').stateless()
    /**
     * User has explicitly denied the login request
     */
    if (spotify.accessDenied()) {
      throw new Exception('Access was denied')
    }
    /**
     * Unable to verify the CSRF state
     */
    if (spotify.stateMisMatch()) {
      throw new Exception('Request expired. try again')
    }
    /**
     * There was an unknown error during the redirect
     */
    if (spotify.hasError()) {
      console.log('useSpotify : ', spotify.getError())
      throw new Exception('something went wrong with provider')
    }

    try {
      return await spotify.user()
    } catch (err: any) {
      throw new Exception('External error')
    }
  }

  async callback({ ally, response }: HttpContext) {
    const { token, email, id: providerUserId, nickName, avatarUrl } = await this.useSpotify(ally)
    const user = await User.firstOrCreate(
      {
        email: email as string,
      },
      {
        email: email as string,
        username: nickName as string,
      }
    )
    await AuthProviders.updateOrCreate(
      {
        name: 'spotify',
        userId: user.id,
      },
      {
        accessToken: token.token,
        refreshToken: token.refreshToken,
        type: token.type,
        expiresIn: token.expiresIn,
        expiresAt: DateTime.fromJSDate(token.expiresAt),
        providerUserId,
      }
    )
    const profile = await this.profileService.createUserProfile(user, avatarUrl)

    this.initializeUserData(profile.id, user.id)
    const authToken = await this.generateUserToken(user)
    response.redirect(this.success(authToken, user))
  }

  private success(accessToken: AccessToken, user: User) {
    const url = new URL(env.get('SPOTIFY_SUCCESS_URL', `${env.get('BASE_API_URL')}/auth/success`))
    url.searchParams.append('userToken', accessToken.value!.release())
    url.searchParams.append('userId', user.id)
    return url.toString()
  }

  private async generateUserToken(user: User): Promise<AccessToken> {
    console.log(user)

    return User.accessTokens.create(user)
  }

  private async initializeUserData(profileId: string, userId: string) {
    const trackExist = await Track.query().where('profile_id', userId)

    if (!trackExist.length) {
      const topTracks = await this.spotifyService.getTracks(userId, 5)
      await this.trackService.saveTracks(profileId, topTracks)
    }

    const artistExist = await Artist.query().where('profile_id', userId)
    if (!artistExist.length) {
      const topArtists = await this.spotifyService.getArtists(userId, 5)
      await this.artistService.saveArtist(profileId, topArtists)
    }
  }
}
