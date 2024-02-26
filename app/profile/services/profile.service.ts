import { default as User } from '#auth/models/user'
import Profile from '#profile/models/profile'
import { inject } from '@adonisjs/fold'

@inject()
export default class ProfileService {
  async createUserProfile(user: User, avatarUrl: string) {
    const newProfile = Profile.updateOrCreate(
      {
        userId: user.id,
      },
      {
        userId: user.id,
        avatar: avatarUrl,
      }
    )

    return newProfile
  }
}
