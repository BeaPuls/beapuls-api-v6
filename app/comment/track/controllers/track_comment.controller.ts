import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { TrackCommentService } from '#comment/track/services/track_comment.service'
import { createOrUpdateTrackCommentValidator } from '#comment/track/validators/create_or_update_track_comment.validator'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import Track from '#track/models/track'
import TrackComment from '../models/track_comment.js'
import drive from '@adonisjs/drive/services/main'
import Profile from '#profile/models/profile'

@inject()
export default class TrackCommentController {
  constructor(private readonly trackCommentService: TrackCommentService) {}

  private serializePostTrackCommentData(data: any) {
    return {
      id: data.id as string,
      userId: data.user_id ?? (data.userId as string),
      trackId: data.track_id ?? (data.trackId as string),
      comment: data.comment ?? (data.comment as string),
      upVote: data.up_vote ?? (data.upVote as number | undefined),
      downVote: data.down_vote ?? (data.downVote as number | undefined),
    }
  }

  private serializeGetTrackCommentData(data: any) {
    return {
      id: data.id as string,
      user: {
        id: data.user_id ?? (data.userId as string),
        username: data.user_username ?? (data.userUsername as string),
        avatar: data.user_avatar ?? (data.userAvatar as string),
      },
      trackId: data.track_id ?? (data.trackId as string),
      comment: data.comment ?? (data.comment as string),
      upVote: data.up_vote ?? (data.upVote as number | undefined),
      downVote: data.down_vote ?? (data.downVote as number | undefined),
      hasVoted: data.has_voted ?? (data.hasVoted as boolean | undefined),
      createdAt: data.created_at ?? (data.createdAt as string),
    }
  }

  async create({ auth, params, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { trackId } = params
    if (!trackId) {
      throw new NotFoundException('Track id missing')
    }

    const track = await Track.find(trackId)
    if (!track) {
      throw new NotFoundException('Track not existing')
    }

    const createTrackComment = await request.validateUsing(createOrUpdateTrackCommentValidator)
    let trackCommentData = this.serializePostTrackCommentData(createTrackComment)
    trackCommentData = {
      ...trackCommentData,
      trackId: track.id,
      userId: user.id,
    }
    const created = await this.trackCommentService.create(trackCommentData as TrackComment)
    if (!created) {
      return ApiResponse.response({ response }, null, 'Track comment creation failed', 400)
    }
    const profileUser = await Profile.query().where('user_id', user.id).first()
    const hasVoted = await this.trackCommentService.hasUserVoted(created.id, user.id)
    const trackGetCommentData = this.serializeGetTrackCommentData(created)
    trackGetCommentData.hasVoted = hasVoted
    if (profileUser) {
      trackGetCommentData.user = {
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
      trackGetCommentData,
      'Track comment created successfully',
      201
    )
  }

  async findAllByTrackId({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { trackId } = params
    const trackComments = await this.trackCommentService.findAllByTrackId(trackId)
    if (!trackComments) {
      return ApiResponse.response({ response }, null, 'Track comments not found', 404)
    }

    const serializedTrackComments = await Promise.all(
      trackComments.map(async (comment) => {
        const serializedComment = this.serializeGetTrackCommentData(comment)
        serializedComment.hasVoted = await this.trackCommentService.hasUserVoted(
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
      serializedTrackComments,
      'Track comments found successfully',
      200
    )
  }

  async findOne({ params, response }: HttpContext) {
    const { id } = params
    if (!id) {
      throw new NotFoundException('Track comment id missing')
    }

    const trackComment = await this.trackCommentService.findOne(id)
    if (!trackComment) {
      return ApiResponse.response({ response }, null, 'Track comment not found', 404)
    }
    return ApiResponse.response({ response }, trackComment, 'Track comment found successfully', 200)
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { id } = params
    if (!id) {
      throw new NotFoundException('Track comment id missing')
    }

    const trackComment = await TrackComment.find(id)
    if (!trackComment) {
      throw new NotFoundException('Track comment not found')
    }

    const updateTrackComment = await request.validateUsing(createOrUpdateTrackCommentValidator)

    let trackCommentData = this.serializePostTrackCommentData(updateTrackComment)

    trackCommentData = {
      ...trackCommentData,
      userId: user.id,
    }

    const updated = await this.trackCommentService.update(id, trackCommentData as TrackComment)
    if (!updated) {
      return ApiResponse.response({ response }, null, 'Track comment update failed', 400)
    }
    return ApiResponse.response({ response }, updated, 'Track comment updated successfully', 200)
  }

  async remove({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { id } = params

    if (!id) {
      throw new NotFoundException('Identifiant du commentaire de piste manquant')
    }

    const trackComment = await this.trackCommentService.findOne(id)
    if (!trackComment) {
      throw new NotFoundException('Commentaire de piste non trouvé')
    }

    if (trackComment.userId !== user.id) {
      return ApiResponse.response(
        { response },
        null,
        'Non autorisé à supprimer ce commentaire',
        403
      )
    }

    const removed = await this.trackCommentService.remove(id)
    if (!removed) {
      return ApiResponse.response(
        { response },
        null,
        'Échec de la suppression du commentaire de piste',
        400
      )
    }
    return ApiResponse.response(
      { response },
      removed,
      'Commentaire de piste supprimé avec succès',
      200
    )
  }

  @inject()
  async toggleVote({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { id, voteType } = params
    if (!id) {
      throw new NotFoundException('Track comment id missing')
    }

    const trackComment = await TrackComment.find(id)
    if (!trackComment) {
      throw new NotFoundException('Track comment not found')
    }

    const hasVoted = await this.trackCommentService.hasUserVoted(id, user.id)
    let updated

    if (hasVoted) {
      updated = await this.trackCommentService.toggleUserVote(id, user.id, voteType)
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
      updated = await this.trackCommentService.toggleUserVote(id, user.id, voteType)
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
