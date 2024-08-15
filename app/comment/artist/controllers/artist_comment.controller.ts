import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { ArtistCommentService } from '#comment/artist/services/artist_comment.service'
import { createOrUpdateArtistCommentValidator } from '#comment/artist/validators/create_or_update_artist_comment.validator'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import Artist from '#artist/models/artist'
import ArtistComment from '../models/artist_comment.js'

@inject()
export default class ArtistCommentController {
  constructor(private readonly artistCommentService: ArtistCommentService) {}

  private serializeArtistCommentData(data: any) {
    return {
      id: data.id as string,
      userId: data.user_id as string,
      artistId: data.artist_id as string,
      comment: data.comment as string,
      upVote: data.up_vote as number | undefined,
      downVote: data.down_vote as number | undefined,
    }
  }

  async create({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { artistId } = params

    if (!artistId) {
      throw new NotFoundException('Artist id missing')
    }

    const artist = await Artist.find(artistId)

    if (!artist) {
      throw new NotFoundException('Artist not existing')
    }

    const createArtistComment = await request.validateUsing(createOrUpdateArtistCommentValidator)
    let artistCommentData = this.serializeArtistCommentData(createArtistComment)

    artistCommentData = {
      ...artistCommentData,
      artistId: artist.id,
      userId: user.id,
    }
    const created = await this.artistCommentService.create(artistCommentData as ArtistComment)
    if (!created) {
      return ApiResponse.response({ response }, null, 'Artist comment creation failed', 400)
    }
    return ApiResponse.response({ response }, created, 'Artist comment created successfully', 201)
  }

  async findAll({ response }: HttpContext) {
    const artistComments = await this.artistCommentService.findAll()
    if (!artistComments) {
      return ApiResponse.response({ response }, null, 'Artist comments not found', 404)
    }
    return ApiResponse.response(
      { response },
      artistComments,
      'Artist comments found successfully',
      200
    )
  }

  async findOne({ params, response }: HttpContext) {
    const { id } = params

    if (!id) {
      throw new NotFoundException('Artist comment id missing')
    }

    const artistComment = await this.artistCommentService.findOne(id)
    if (!artistComment) {
      return ApiResponse.response({ response }, null, 'Artist comment not found', 404)
    }
    return ApiResponse.response(
      { response },
      artistComment,
      'Artist comment found successfully',
      200
    )
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { id } = params

    if (!id) {
      throw new NotFoundException('Artist comment id missing')
    }

    const artistComment = await ArtistComment.find(id)
    if (!artistComment) {
      throw new NotFoundException('Artist comment not found')
    }

    const updateArtistComment = await request.validateUsing(createOrUpdateArtistCommentValidator)

    let artistCommentData = this.serializeArtistCommentData(updateArtistComment)

    artistCommentData = {
      ...artistCommentData,
      userId: user.id,
    }
    const updated = await this.artistCommentService.update(id, artistCommentData as ArtistComment)
    if (!updated) {
      return ApiResponse.response({ response }, null, 'Artist comment update failed', 400)
    }
    return ApiResponse.response({ response }, updated, 'Artist comment updated successfully', 200)
  }

  async remove({ params, response }: HttpContext) {
    const { id } = params
    if (!id) {
      throw new NotFoundException('Artist comment id missing')
    }

    const removed = await this.artistCommentService.remove(id)
    if (!removed) {
      return ApiResponse.response({ response }, null, 'Artist comment deletion failed', 400)
    }
    return ApiResponse.response({ response }, removed, 'Artist comment deleted successfully', 200)
  }

  @inject()
  async toggleVote({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { id, voteType } = params

    if (!id) {
      throw new NotFoundException('Artist comment id missing')
    }

    const artistComment = await ArtistComment.find(id)
    if (!artistComment) {
      throw new NotFoundException('Artist comment not found')
    }

    const hasVoted = await this.artistCommentService.hasUserVoted(id, user.id)
    let updated

    if (hasVoted) {
      updated = await this.artistCommentService.toggleUserVote(id, user.id, voteType)
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
      updated = await this.artistCommentService.toggleUserVote(id, user.id, voteType)
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
