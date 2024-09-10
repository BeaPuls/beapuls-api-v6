import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { AlbumCommentService } from '#comment/album/services/album_comment.service'
import { createOrUpdateAlbumCommentValidator } from '#comment/album/validators/create_or_update_album_comment.validator'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import AlbumComment from '../models/album_comment.js'
import Album from '#album/models/album'
import Profile from '#profile/models/profile'
import drive from '@adonisjs/drive/services/main'

@inject()
export default class AlbumCommentController {
  constructor(private readonly albumCommentService: AlbumCommentService) {}

  private serializePostAlbumCommentData(data: any) {
    return {
      id: data.id as string,
      userId: data.user_id ?? (data.userId as string),
      albumId: data.album_id ?? (data.albumId as string),
      comment: data.comment ?? (data.comment as string),
      upVote: data.up_vote ?? (data.upVote as number | undefined),
      downVote: data.down_vote ?? (data.downVote as number | undefined),
    }
  }

  private serializeGetAlbumCommentData(data: any) {
    return {
      id: data.id as string,
      user: {
        id: data.user_id ?? (data.userId as string),
        username: data.user_username ?? (data.userUsername as string),
        avatar: data.user_avatar ?? (data.userAvatar as string),
      },
      albumId: data.album_id ?? (data.albumId as string),
      comment: data.comment ?? (data.comment as string),
      upVote: data.up_vote ?? (data.upVote as number | undefined),
      downVote: data.down_vote ?? (data.downVote as number | undefined),
      hasVoted: data.has_voted ?? (data.hasVoted as boolean | undefined),
      createdAt: data.created_at ?? (data.createdAt as string),
    }
  }

  async create({ auth, params, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { albumId } = params

    if (!albumId) {
      throw new NotFoundException('Album id missing')
    }

    const album = await Album.find(albumId)

    if (!album) {
      throw new NotFoundException('Album not existing')
    }

    const createAlbumComment = await request.validateUsing(createOrUpdateAlbumCommentValidator)
    let albumCommentData = this.serializePostAlbumCommentData(createAlbumComment)

    albumCommentData = {
      ...albumCommentData,
      albumId: album.id,
      userId: user.id,
    }

    const created = await this.albumCommentService.create(albumCommentData as AlbumComment)
    if (!created) {
      return ApiResponse.response({ response }, null, 'Album comment creation failed', 400)
    }
    const profileUser = await Profile.query().where('user_id', user.id).first()
    const hasVoted = await this.albumCommentService.hasUserVoted(created.id, user.id)
    const albumGetCommentData = this.serializeGetAlbumCommentData(created)
    albumGetCommentData.hasVoted = hasVoted
    if (profileUser) {
      albumGetCommentData.user = {
        id: profileUser.id,
        username: profileUser.username,
        avatar: profileUser.avatar
          ? profileUser.avatar.startsWith('http')
            ? profileUser.avatar
            : await drive.use().getUrl(profileUser.avatar)
          : null,
      }
    }
    return ApiResponse.response(
      { response },
      albumGetCommentData,
      'Album comment created successfully',
      201
    )
  }

  async findAllByAlbumId({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { albumId } = params
    const albumComments = await this.albumCommentService.findAllByAlbumId(albumId)
    if (!albumComments) {
      return ApiResponse.response({ response }, null, 'Album comments not found', 404)
    }

    // const comments = []
    const serializedAlbumComments = await Promise.all(
      albumComments.map(async (comment) => {
        const serializedComment = this.serializeGetAlbumCommentData(comment)
        serializedComment.hasVoted = await this.albumCommentService.hasUserVoted(
          comment.id,
          user.id
        )
        const profileUser = await Profile.query().where('user_id', comment.userId).first()
        if (profileUser) {
          serializedComment.user = {
            ...serializedComment.user,
            username: profileUser.username,
            avatar: profileUser.avatar
              ? profileUser.avatar.startsWith('http')
                ? profileUser.avatar
                : await drive.use().getUrl(profileUser.avatar)
              : null,
          }
        }
        return serializedComment
      })
    )
    return ApiResponse.response(
      { response },
      serializedAlbumComments,
      'Album comments found successfully',
      200
    )
  }

  async findOne({ params, response }: HttpContext) {
    const { id } = params

    if (!id) {
      throw new NotFoundException('Album comment id missing')
    }

    const albumComment = await this.albumCommentService.findOne(id)
    if (!albumComment) {
      return ApiResponse.response({ response }, null, 'Album comment not found', 404)
    }
    return ApiResponse.response({ response }, albumComment, 'Album comment found successfully', 200)
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { id } = params

    if (!id) {
      throw new NotFoundException('Album comment id missing')
    }

    const albumComment = await AlbumComment.find(id)
    if (!albumComment) {
      throw new NotFoundException('Album comment not found')
    }

    const updateAlbumComment = await request.validateUsing(createOrUpdateAlbumCommentValidator)

    let albumCommentData = this.serializePostAlbumCommentData(updateAlbumComment)

    albumCommentData = {
      ...albumCommentData,
      userId: user.id,
    }
    const updated = await this.albumCommentService.update(id, albumCommentData as AlbumComment)
    if (!updated) {
      return ApiResponse.response({ response }, null, 'Album comment update failed', 400)
    }
    return ApiResponse.response({ response }, updated, 'Album comment updated successfully', 200)
  }

  async remove({ params, response }: HttpContext) {
    const { id } = params

    if (!id) {
      throw new NotFoundException('Album comment id missing')
    }

    const removed = await this.albumCommentService.remove(id)
    if (!removed) {
      return ApiResponse.response({ response }, null, 'Album comment deletion failed', 400)
    }
    return ApiResponse.response({ response }, removed, 'Album comment deleted successfully', 200)
  }

  @inject()
  async toggleVote({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { id, voteType } = params

    if (!id) {
      throw new NotFoundException('Album comment id missing')
    }

    const albumComment = await this.albumCommentService.findOne(id)
    if (!albumComment) {
      throw new NotFoundException('Album comment not found')
    }

    const hasVoted = await this.albumCommentService.hasUserVoted(id, user.id)
    let updated

    if (hasVoted) {
      updated = await this.albumCommentService.toggleUserVote(id, user.id, voteType)
      if (!updated) {
        return ApiResponse.response(
          { response },
          null,
          `${voteType.charAt(0).toUpperCase() + voteType.slice(1)}vote removal failed`,
          400
        )
      }
      return ApiResponse.response(
        { response },
        updated,
        `${voteType.charAt(0).toUpperCase() + voteType.slice(1)}vote removed successfully`,
        200
      )
    } else {
      updated = await this.albumCommentService.toggleUserVote(id, user.id, voteType)
      if (!updated) {
        return ApiResponse.response(
          { response },
          null,
          `${voteType.charAt(0).toUpperCase() + voteType.slice(1)}vote failed`,
          400
        )
      }
      return ApiResponse.response(
        { response },
        updated,
        `${voteType.charAt(0).toUpperCase() + voteType.slice(1)}voted successfully`,
        200
      )
    }
  }
}
