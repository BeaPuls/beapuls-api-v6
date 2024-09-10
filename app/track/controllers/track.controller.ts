import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { TrackService } from '#track/services/track.service'
import { createOrUpdateTrackValidator } from '#track/validators/create_or_update_track.validator'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import Track from '#track/models/track'

@inject()
export default class TrackController {
  constructor(private readonly trackService: TrackService) {}

  private serializePostTrackData(data: any) {
    return {
      id: data.id as string,
      name: data.name as string,
      albumName: data.album_name ?? (data.albumName as string),
      artistName: data.artist_name ?? (data.artistName as string),
      providerItemUri: data.provider_item_uri ?? (data.providerItemUri as string),
      providerItemImage: data.provider_item_image ?? (data.providerItemImage as string),
      providerItemId: data.provider_item_id ?? (data.providerItemId as string),
      providerTypeId: data.provider_type_id ?? (data.providerTypeId as string | undefined),
      upVote: data.up_vote ?? (data.upVote as number),
      downVote: data.down_vote ?? (data.downVote as number),
    }
  }

  private serializeGetTrackData(data: any) {
    return {
      id: data.id as string,
      name: data.name as string,
      albumName: data.album_name ?? (data.albumName as string),
      artistName: data.artist_name ?? (data.artistName as string),
      providerItemUri: data.provider_item_uri ?? (data.providerItemUri as string),
      providerItemImage: data.provider_item_image ?? (data.providerItemImage as string),
      providerItemId: data.provider_item_id ?? (data.providerItemId as string),
      providerTypeId: data.provider_type_id ?? (data.providerTypeId as string | undefined),
      upVote: data.up_vote ?? (data.upVote as number),
      downVote: data.down_vote ?? (data.downVote as number),
      hasVoted: data.has_voted ?? (data.hasVoted as string | false),
    }
  }

  async create({ request, response }: HttpContext) {
    const createTrack = await request.validateUsing(createOrUpdateTrackValidator)
    const serializedTrack = this.serializePostTrackData(createTrack)
    const created = await this.trackService.create(serializedTrack as Track)

    if (!created) {
      return ApiResponse.response({ response }, null, 'Track creation failed', 400)
    }
    return ApiResponse.response({ response }, createTrack, 'Track created successfully', 201)
  }

  async findAll({ response }: HttpContext) {
    const tracks = await this.trackService.findAll()
    if (tracks.length === 0) {
      return ApiResponse.response({ response }, [], 'Tracks not found', 404)
    }
    return ApiResponse.response({ response }, tracks, 'Tracks found successfully', 200)
  }

  async findOneByProviderId({ params, response }: HttpContext) {
    const { providerId } = params
    if (!providerId) {
      throw new NotFoundException('Track provider id not found')
    }
    const track = await this.trackService.findOneByProviderId(providerId)
    if (!track) {
      return ApiResponse.response({ response }, null, 'Track not found', 404)
    }
    return ApiResponse.response({ response }, track, 'Track found successfully', 200)
  }

  async findOneOrCreate({ request, params, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { providerItemId } = params

    let track = await this.trackService.findOneByProviderId(providerItemId)

    if (!track) {
      const searchTrackData = await request.validateUsing(createOrUpdateTrackValidator)
      const serializedTrack = this.serializePostTrackData(searchTrackData)
      track = await this.trackService.create(serializedTrack as Track)
      if (!track) {
        return ApiResponse.response({ response }, null, 'Track creation failed', 400)
      }
    }

    const hasVoted = await this.trackService.hasUserVoted(track.id, user.id)
    const trackData = this.serializeGetTrackData(track)
    trackData.hasVoted = hasVoted
    return ApiResponse.response({ response }, trackData, 'Track found successfully', 200)
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    if (!id) {
      throw new NotFoundException('Track id not found')
    }

    const updateTrack = await request.validateUsing(createOrUpdateTrackValidator)
    const serializedTrack = this.serializePostTrackData(updateTrack)
    const updated = await this.trackService.update(id, serializedTrack as Track)
    if (!updated) {
      return ApiResponse.response({ response }, null, 'Track update failed', 400)
    }
    return ApiResponse.response({ response }, updateTrack, 'Track updated successfully', 200)
  }

  async remove({ params, response }: HttpContext) {
    const { id } = params
    if (!id) {
      throw new NotFoundException('Track id not found')
    }
    const removed = await this.trackService.remove(id)
    if (!removed) {
      return ApiResponse.response({ response }, null, 'Track deletion failed', 400)
    }
    return ApiResponse.response({ response }, removed, 'Track deleted successfully', 200)
  }

  @inject()
  async toggleVote({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { id, voteType } = params

    if (!id) {
      throw new NotFoundException('Track id missing')
    }

    const track = await this.trackService.findOne(id)
    if (!track) {
      throw new NotFoundException('Track not found')
    }

    const hasVoted = await this.trackService.hasUserVoted(id, user.id)
    let updated

    if (hasVoted) {
      updated = await this.trackService.toggleUserVote(id, user.id, voteType)
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
      updated = await this.trackService.toggleUserVote(id, user.id, voteType)
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
