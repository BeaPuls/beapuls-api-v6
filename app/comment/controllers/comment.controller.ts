import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { TrackCommentService } from '#comment/track/services/track_comment.service'
import { ArtistCommentService } from '#comment/artist/services/artist_comment.service'
import { AlbumCommentService } from '#comment/album/services/album_comment.service'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
// import NotFoundException from '#exceptions/not_found.exception'

@inject()
export default class CommentController {
  constructor(
    private readonly trackCommentService: TrackCommentService,
    private readonly artistCommentService: ArtistCommentService,
    private readonly albumCommentService: AlbumCommentService
  ) {}

  async getLastUserComments({ auth, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { limit = 10 } = request.qs()
    try {
      const [trackComments, artistComments, albumComments] = await Promise.all([
        this.trackCommentService.getLastUserComments(user.id, limit),
        this.artistCommentService.getLastUserComments(user.id, limit),
        this.albumCommentService.getLastUserComments(user.id, limit),
      ])

      const formattedComments = await Promise.all([
        ...trackComments.map(async (comment) => ({
          type: 'track',
          entity: await this.trackCommentService.getTrackData(comment.trackId),
        })),
        ...artistComments.map(async (comment) => ({
          type: 'artist',
          entity: await this.artistCommentService.getArtistData(comment.artistId),
        })),
        ...albumComments.map(async (comment) => ({
          type: 'album',
          entity: await this.albumCommentService.getAlbumData(comment.albumId),
        })),
      ])

      const sortedComments = formattedComments
        .sort((a, b) => b.entity.createdAt - a.entity.createdAt)
        .slice(0, 10)

      if (sortedComments.length === 0) {
        throw new NotFoundException('No comments found for this user')
      }
      return ApiResponse.response(
        { response },
        sortedComments,
        "User's latest comments retrieved successfully",
        200
      )
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.response({ response }, null, error.message, 404)
      }
      console.error("Error while retrieving user's latest comments:", error)
      return ApiResponse.response(
        { response },
        null,
        "Error while retrieving user's latest comments",
        500
      )
    }
  }
}
