import Profile from '#profile/models/profile'
import { createOrUpdateProfileValidator } from '#profile/validators/create_or_update_profile.validator'
import { uploadProfileAvatarValidator } from '#profile/validators/upload_profile_avatar.validator'
import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import { ErrorMessage } from '#exceptions/error_message'
import User from '#user/models/user'
import ForbiddenException from '#exceptions/forbidden.exception'

// type UserInfo = {
//   id: number | string
//   username: string | null
//   dateOfBirth: DateTime
//   description: string
//   genderId: Gender['id']
// }

@inject()
export default class ProfileController {
  // constructor(private userService: UserService) {} // private artistService: ArtistService // private trackService: TrackService, // private spotifyService: SpotifyService,

  private serializeUserInfo(user: User, profile: Profile) {
    return {
      id: profile.id,
      userId: user.id,
      username: profile.username,
      avatar: profile.avatar,
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
      dateOfBirth: data.date_of_birth as Date,
      description: data.description as string | undefined,
      genderId: data.gender_id as number,
    }
  }

  async getUserProfile({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const profile = await Profile.query().where('user_id', user.id).first()
    if (!profile) {
      throw new NotFoundException()
    }

    const profileData = this.serializeUserInfo(user, profile)
    return ApiResponse.response({ response }, profileData, 'Profile fetched successfully', 200)
  }

  // async getProfiles({ auth }: HttpContext) {
  //   const authUser = auth.getUserOrFail()
  //   const user = await User.query().where('id', authUser.id).preload('profile').first()
  //   const userProfile = user?.profile
  //   if (!userProfile) {
  //     throw new ForbiddenException(ErrorMessage.PROFILE_NOT_SET)
  //   }

  //   const data = await this.userService.getProfilesToShowForProfile(userProfile)
  //   return {
  //     data,
  //   }
  // }

  private async updateUserProfile(user: User, data: Profile) {
    const profile = (await Profile.query().where('user_id', user.id).first()) ?? new Profile()

    profile.username = data.username
    profile.dateOfBirth = DateTime.fromJSDate(data.dateOfBirth)
    profile.description = data.description
    profile.genderId = data.genderId
    profile.userId = user.id
    return profile.save()
  }

  async createUserProfile({ auth, request, response }: HttpContext): Promise<void> {
    const user = auth.getUserOrFail()

    const existingProfile = await Profile.query().where('user_id', user.id).first()
    if (existingProfile) {
      throw new ForbiddenException(ErrorMessage.PROFILE_ALREADY_SET)
    }

    const createProfileData = await request.validateUsing(createOrUpdateProfileValidator)
    const profileData = this.serializeProfileData(createProfileData)

    const profile = await this.updateUserProfile(user, profileData as unknown as Profile)

    // @ts-ignore TODO see dateOfBirth
    return ApiResponse.response(
      { response },
      this.serializeUserInfo(user, profile),
      'Profile created successfully',
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
      this.serializeUserInfo(user, profile),
      'Profile avatar uploaded successfully',
      200
    )
  }

  private buildAvatarFileName(user: User, file: MultipartFile) {
    return `${user.id}.avatar.${file.extname}`
  }

  private async saveUserAvatarImage(user: User, file: MultipartFile): Promise<void> {
    const fileName = this.buildAvatarFileName(user, file)
    await file.move(app.makePath('uploads'), {
      name: fileName,
      overwrite: true,
    })

    const profile = await Profile.updateOrCreate(
      {
        userId: user.id,
      },
      {
        avatar: fileName,
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
    const absolutePath = app.makePath('uploads', avatar)
    ApiResponse.response({ response }, absolutePath, 'Profile avatar fetched successfully', 200)
  }
}
