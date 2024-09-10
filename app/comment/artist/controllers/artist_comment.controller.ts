import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { ArtistCommentService } from '#comment/artist/services/artist_comment.service'
import { createOrUpdateArtistCommentValidator } from '#comment/artist/validators/create_or_update_artist_comment.validator'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import Artist from '#artist/models/artist'
import ArtistComment from '../models/artist_comment.js'
import Profile from '#profile/models/profile'
import drive from '@adonisjs/drive/services/main'

@inject()
export default class ArtistCommentController {
  constructor(private readonly artistCommentService: ArtistCommentService) {}

  private serializePostArtistCommentData(data: any) {
    return {
      id: data.id as string,
      userId: data.user_id ?? (data.userId as string),
      artistId: data.artist_id ?? (data.artistId as string),
      comment: data.comment ?? (data.comment as string),
      upVote: data.up_vote ?? (data.upVote as number | undefined),
      downVote: data.down_vote ?? (data.downVote as number | undefined),
    }
  }

  private serializeGetArtistCommentData(data: any) {
    return {
      id: data.id as string,
      user: {
        id: data.user_id ?? (data.userId as string),
        username: data.user_username ?? (data.userUsername as string),
        avatar: data.user_avatar ?? (data.userAvatar as string),
      },
      artistId: data.artist_id ?? (data.artistId as string),
      comment: data.comment ?? (data.comment as string),
      upVote: data.up_vote ?? (data.upVote as number | undefined),
      downVote: data.down_vote ?? (data.downVote as number | undefined),
      hasVoted: data.has_voted ?? (data.hasVoted as boolean | undefined),
      createdAt: data.created_at ?? (data.createdAt as string),
    }
  }

  async create({ auth, params, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { artistId } = params

    if (!artistId) {
      throw new NotFoundException('Artist id missing')
    }

    const artist = await Artist.find(artistId)
    if (!artist) {
      throw new NotFoundException('Artist not existing')
    }

    const createArtistComment = await request.validateUsing(createOrUpdateArtistCommentValidator)
    let artistCommentData = this.serializePostArtistCommentData(createArtistComment)
    artistCommentData = {
      ...artistCommentData,
      artistId: artist.id,
      userId: user.id,
    }
    const created = await this.artistCommentService.create(artistCommentData as ArtistComment)
    if (!created) {
      return ApiResponse.response({ response }, null, 'Artist comment creation failed', 400)
    }
    const profileUser = await Profile.query().where('user_id', user.id).first()
    const hasVoted = await this.artistCommentService.hasUserVoted(created.id, user.id)
    const artistGetCommentData = this.serializeGetArtistCommentData(created)
    artistGetCommentData.hasVoted = hasVoted
    if (profileUser) {
      artistGetCommentData.user = {
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
      artistGetCommentData,
      'Artist comment created successfully',
      201
    )
  }

  async findAllByArtistId({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { artistId } = params
    const artistComments = await this.artistCommentService.findAllByArtistId(artistId)
    if (!artistComments) {
      return ApiResponse.response({ response }, null, 'Artist comments not found', 404)
    }

    const serializedArtistComments = await Promise.all(
      artistComments.map(async (comment) => {
        const serializedComment = this.serializeGetArtistCommentData(comment)
        serializedComment.hasVoted = await this.artistCommentService.hasUserVoted(
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
      serializedArtistComments,
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
    const user = await auth.getUserOrFail()
    const { id } = params

    if (!id) {
      throw new NotFoundException('Artist comment id missing')
    }

    const artistComment = await ArtistComment.find(id)
    if (!artistComment) {
      throw new NotFoundException('Artist comment not found')
    }

    const updateArtistComment = await request.validateUsing(createOrUpdateArtistCommentValidator)

    let artistCommentData = this.serializePostArtistCommentData(updateArtistComment)

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

  async remove({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { id } = params

    if (!id) {
      throw new NotFoundException("Identifiant du commentaire d'artiste manquant")
    }

    const artistComment = await this.artistCommentService.findOne(id)
    if (!artistComment) {
      throw new NotFoundException("Commentaire d'artiste non trouvé")
    }

    if (artistComment.userId !== user.id) {
      return ApiResponse.response(
        { response },
        null,
        'Non autorisé à supprimer ce commentaire',
        403
      )
    }

    const removed = await this.artistCommentService.remove(id)
    if (!removed) {
      return ApiResponse.response(
        { response },
        null,
        "Échec de la suppression du commentaire d'artiste",
        400
      )
    }
    return ApiResponse.response(
      { response },
      removed,
      "Commentaire d'artiste supprimé avec succès",
      200
    )
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
