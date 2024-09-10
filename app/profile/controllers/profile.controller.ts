import Profile from '#profile/models/profile'
import { createOrUpdateProfileValidator } from '#profile/validators/create_or_update_profile.validator'
import { uploadProfileAvatarValidator } from '#profile/validators/upload_profile_avatar.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import { ErrorMessage } from '#exceptions/error_message'
import User from '#user/models/user'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'

// type UserInfo = {
//   id: number | string
//   username: string | null
//   dateOfBirth: DateTime
//   description: string
//   genderId: Gender['id']
// }

@inject()
export default class ProfileController {
  private async serializeUserInfo(user: User, profile: Profile) {
    return {
      id: profile.id,
      userId: user.id,
      username: profile.username,
      avatar: profile.avatar ? await drive.use().getUrl(profile.avatar) : null,
      dateOfBirth: profile.dateOfBirth,
      description: profile.description,
      genderId: profile.genderId,
      trackIds: profile.tracks,
      albumIds: profile.albums,
      artistIds: profile.artists,
    }
  }

  private serializeProfileData(data: any) {
    return {
      username: data.username as string,
      dateOfBirth: DateTime.fromJSDate(data.date_of_birth) as Date,
      description: data.description as string | undefined,
      genderId: data.gender_id as number,
      userId: data.user_id as number | string | undefined,
    }
  }

  async getUserProfile({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const profile = await Profile.query().where('user_id', user.id).first()
    if (!profile) {
      throw new NotFoundException()
    }

    const profileData = await this.serializeUserInfo(user, profile)
    return ApiResponse.response({ response }, profileData, 'Profile fetched successfully', 200)
  }

  private async updateUserProfile(profileId: string | undefined, data: Profile) {
    try {
      let action = 'created'
      let profileResult: Profile | any | null = null
      if (profileId) {
        action = 'updated'
        try {
          const currentProfile = await Profile.findOrFail(profileId)

          currentProfile.username = data.username
          currentProfile.dateOfBirth = data.dateOfBirth
          currentProfile.description = data.description
          currentProfile.genderId = data.genderId
          currentProfile.avatar = 'profile.png'
          await currentProfile.save()

          profileResult = currentProfile
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          profileResult = await Profile.create(data)
        } catch (error) {
          console.log(error)
        }
      }
      return {
        profileResult,
        action,
      }
    } catch (error) {
      return false
    }
  }

  async createOrUpdateUserProfile({ auth, request, response }: HttpContext): Promise<void> {
    const user = auth.getUserOrFail()

    const existingProfile = await Profile.query().where('user_id', user.id).first()

    const createProfileData = await request.validateUsing(createOrUpdateProfileValidator)
    const profileData = this.serializeProfileData(createProfileData)
    profileData.userId = user.id

    const profile = await this.updateUserProfile(
      existingProfile?.id as string | undefined,
      profileData as unknown as Profile
    )
    return ApiResponse.response(
      { response },
      await this.serializeUserInfo(user, profile.profileResult),
      `Profile ${profile.action} successfully`,
      201
    )
  }

  async uploadUserAvatar({ auth, request, response }: HttpContext): Promise<void> {
    const user = auth.getUserOrFail()
    const { avatar } = await request.validateUsing(uploadProfileAvatarValidator)
    await this.saveUserAvatarImage(user, avatar)
    const profile = await Profile.query().where('user_id', user.id).first()
    if (!profile) {
      throw new NotFoundException(ErrorMessage.PROFILE_NOT_FOUND)
    }
    ApiResponse.response(
      { response },
      await this.serializeUserInfo(user, profile),
      'Profile avatar uploaded successfully',
      200
    )
  }

  // private buildAvatarFileName(user: User, file: MultipartFile) {
  //   return `${user.id}.avatar.${file.extname}`
  // }

  private async saveUserAvatarImage(user: User, file: any): Promise<void> {
    // const fileName = this.buildAvatarFileName(user, file)
    const fileName = `${cuid()}.${file.extname}`
    const key = `uploads/${fileName}`
    await file.moveToDisk(key)

    const profile = await Profile.updateOrCreate(
      {
        userId: user.id,
      },
      {
        avatar: key,
      }
    )

    profile.save()
  }

  async getUserAvatar({ auth, response }: HttpContext): Promise<void> {
    const user = await auth.getUserOrFail()

    const profile = await Profile.query().where('user_id', user.id).first()
    if (!profile) {
      throw new NotFoundException(ErrorMessage.PROFILE_NOT_FOUND)
    }

    const avatar = profile?.avatar
    if (!avatar) {
      throw new NotFoundException(ErrorMessage.PROFILE_AVATAR_NOT_FOUND)
    }
    const url = await drive.use().getUrl(avatar)
    ApiResponse.response({ response }, url, 'Profile avatar fetched successfully', 200)
  }
}
