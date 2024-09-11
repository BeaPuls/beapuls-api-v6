import { default as User } from '#user/models/user'
import Profile from '#profile/models/profile'
import { inject } from '@adonisjs/fold'
import { ProfileTrackService } from '#profile/services/profile_track.service'
import { ProfileArtistService } from '#profile/services/profile_artist.service'

@inject()
export default class ProfileService {
  constructor(
    private profileTrackService: ProfileTrackService,
    private profileArtistService: ProfileArtistService
  ) {}

  async createUserProfile(user: User, avatarUrl: string, username: string) {
    const newProfile = Profile.updateOrCreate(
      {
        userId: user.id,
      },
      {
        userId: user.id,
        avatar: avatarUrl ?? 'uploads/profile.png',
        username: username,
      }
    )

    return newProfile
  }

  async getProfileTops(profileId: string) {
    try {
      const items = {
        tracks: await this.profileTrackService.getProfileTracks(profileId),
        artists: await this.profileArtistService.getProfileArtists(profileId),
      }

      return items ?? {}
    } catch (error) {
      console.error('Erreur lors de la récupération des entités récentes du profil:', error)
      throw new Error('Erreur lors de la récupération des entités récentes du profil')
    }
  }
}
