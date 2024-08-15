import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { TrackService } from '#track/services/track.service'
import { createOrUpdateTrackValidator } from '#track/validators/create_or_update_track.validator'
// import { findBySearchTrackValidator } from '#track/validators/find_by_search_track_validator'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import Track from '#track/models/track'

@inject()
export default class TrackController {
  constructor(private readonly trackService: TrackService) {}

  private serializeTrackData(data: any) {
    return {
      name: data.name as string,
      albumName: data.album_name as string | undefined,
      artistName: data.artist_name as string,
      providerItemUri: data.provider_item_uri as string,
      providerItemImage: data.provider_item_image as string,
      providerItemId: data.provider_item_id as string,
      providerTypeId: data.provider_type_id as string | undefined,
      upVote: data.up_vote as number | undefined,
      downVote: data.down_vote as number | undefined,
    }
  }

  async create({ request, response }: HttpContext) {
    const createTrack = await request.validateUsing(createOrUpdateTrackValidator)
    const serializedTrack = this.serializeTrackData(createTrack)
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

  // async findBySearch({ request, response }: HttpContext) {
  //   const findBySearchTrack = await request.validateUsing(findBySearchTrackValidator)
  //   const track = await this.trackService.findBySearch(findBySearchTrack)
  //   if (!track) {
  //     return ApiResponse.response({ response }, null, 'Track not found', 404)
  //   }
  //   return ApiResponse.response({ response }, track, 'Track found successfully', 200)
  // }

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

  async findOne({ params, response }: HttpContext) {
    const { id } = params
    if (!id) {
      throw new NotFoundException('Track id not found')
    }
    const track = await this.trackService.findOne(id)
    if (!track) {
      return ApiResponse.response({ response }, null, 'Track not found', 404)
    }
    return ApiResponse.response({ response }, track, 'Track found successfully', 200)
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    if (!id) {
      throw new NotFoundException('Track id not found')
    }

    const updateTrack = await request.validateUsing(createOrUpdateTrackValidator)
    const serializedTrack = this.serializeTrackData(updateTrack)
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
