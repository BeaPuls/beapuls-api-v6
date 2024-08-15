import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { AlbumCommentService } from '#comment/album/services/album_comment.service'
import { createOrUpdateAlbumCommentValidator } from '#comment/album/validators/create_or_update_album_comment.validator'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import AlbumComment from '../models/album_comment.js'
import Album from '#album/models/album'

@inject()
export default class AlbumCommentController {
  constructor(private readonly albumCommentService: AlbumCommentService) {}

  private serializeAlbumCommentData(data: any) {
    return {
      id: data.id as string,
      userId: data.user_id as string,
      albumId: data.album_id as string,
      comment: data.comment as string,
      upVote: data.up_vote as number | undefined,
      downVote: data.down_vote as number | undefined,
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
    let albumCommentData = this.serializeAlbumCommentData(createAlbumComment)

    albumCommentData = {
      ...albumCommentData,
      albumId: album.id,
      userId: user.id,
    }

    const created = await this.albumCommentService.create(albumCommentData as AlbumComment)
    if (!created) {
      return ApiResponse.response({ response }, null, 'Album comment creation failed', 400)
    }
    return ApiResponse.response({ response }, created, 'Album comment created successfully', 201)
  }

  async findAll({ response }: HttpContext) {
    const albumComments = await this.albumCommentService.findAll()
    if (!albumComments) {
      return ApiResponse.response({ response }, null, 'Album comments not found', 404)
    }
    return ApiResponse.response(
      { response },
      albumComments,
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

    let albumCommentData = this.serializeAlbumCommentData(updateAlbumComment)

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
