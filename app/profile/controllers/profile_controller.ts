import { default as User } from '#auth/models/user'
import NotFountException from '#exceptions/not_fount.exception'
import Gender from '#profile/models/gender'
import Profile from '#profile/models/profile'
import { createProfileValidator } from '#profile/validators/create_profile_validator'
import { uploadProfileAvatarValidator } from '#profile/validators/upload_profile_avatar_validator'
import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'

type UserInfo = {
  id: number | string
  username: string | null
  dateOfBirth: DateTime
  description: string
  genderId: Gender['id']
  // preferedGenderId: Gender['id']
}

@inject()
export default class ProfileController {
  constructor() {} // private artistService: ArtistService // private trackService: TrackService, // private spotifyService: SpotifyService,

  private serializeUserInfo(user: User, profile: Profile) {
    return {
      id: profile.id,
      userId: user.id,
      username: user.username,
      avatar: profile.avatar,
      dateOfBirth: profile.dateOfBirth,
      description: profile.description,
      genderId: profile.genderId,
      trackIds: profile.tracks,
      albumIds: profile.albums,
      artistIds: profile.artists,
      // preferedGenderId: profile.preferedGenderId,
    }
  }

  async getUserInfo({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const profile = await Profile.query().where('user_id', user.id).first()
    if (!profile) {
      throw new NotFountException()
    }

    const profileData = this.serializeUserInfo(user, profile)
    return response.status(200).send({
      status: true,
      data: {
        ...profileData,
      },
    })
  }

  private async updateUser(user: User, data: Pick<User, 'username'>) {
    user.username = data.username
    return user.save()
  }

  // Add  'preferedGenderId'
  private async updateUserProfile(
    user: User,
    dateOfBirth: Date,
    data: Pick<Profile, 'description' | 'genderId'>
  ) {
    const profile = (await Profile.query().where('user_id', user.id).first()) ?? new Profile()

    // @ts-ignore TODO error type
    profile.dateOfBirth = DateTime.fromJSDate(dateOfBirth)
    profile.description = data.description
    // profile.preferedGenderId = data.preferedGenderId
    profile.genderId = data.genderId
    profile.userId = user.id
    return profile.save()
  }

  async createUserProfile({ auth, request, response }: HttpContext): Promise<void> {
    const user = auth.getUserOrFail()

    const { username, dateOfBirth, ...validatedBody } =
      await request.validateUsing(createProfileValidator)

    const profile = await this.updateUserProfile(user, dateOfBirth, validatedBody)
    const newUserData = await this.updateUser(user, { username })

    // @ts-ignore TODO see dateOfBirth
    return response.created(this.serializeUserInfo(newUserData, profile))
  }

  async uploadUserAvatar({ auth, request }: HttpContext): Promise<UserInfo> {
    const user = auth.getUserOrFail()
    const { avatar } = await request.validateUsing(uploadProfileAvatarValidator)
    await this.saveUserAvatarImage(user, avatar)
    const profile = await Profile.query().where('user_id', user.id).first()
    if (!profile) {
      throw new NotFountException()
    }
    return this.serializeUserInfo(user, profile)
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
    const user = auth.getUserOrFail()
    const avatar = user.profile.avatar

    if (!avatar) {
      throw new NotFountException()
    }
    const absolutePath = app.makePath('uploads', avatar)
    return response.download(absolutePath)
  }
}
