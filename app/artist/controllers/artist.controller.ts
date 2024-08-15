import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { ArtistService } from '#artist/services/artist.service'
import { createOrUpdateArtistValidator } from '#artist/validators/create_or_update_artist.validator'
// import { findBySearchArtistValidator } from '#artist/validators/find_by_search_artist_validator'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import Artist from '#artist/models/artist'

@inject()
export default class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  private serializeArtistData(data: any) {
    return {
      name: data.name as string,
      popularity: data.popularity as number | undefined,
      followers: data.followers as number | undefined,
      providerItemUri: data.provider_item_uri as string,
      providerItemImage: data.provider_item_image as string,
      providerItemId: data.provider_item_id as string,
      providerTypeId: data.provider_type_id as string | undefined,
      upVote: data.up_vote as number,
      downVote: data.down_vote as number,
    }
  }

  async create({ request, response }: HttpContext) {
    const createArtist = await request.validateUsing(createOrUpdateArtistValidator)
    const artistData = this.serializeArtistData(createArtist)
    const created = await this.artistService.create(artistData as Artist)
    if (!created) {
      return ApiResponse.response({ response }, null, 'Artist creation failed', 400)
    }
    return ApiResponse.response({ response }, createArtist, 'Artist created successfully', 201)
  }

  async findAll({ response }: HttpContext) {
    const artists = await this.artistService.findAll()
    if (artists.length === 0) {
      return ApiResponse.response({ response }, [], 'Artists not found', 404)
    }
    return ApiResponse.response({ response }, artists, 'Artists found successfully', 200)
  }

  // async findBySearch({ request, response }: HttpContext) {
  //   const findBySearchArtist = await request.validateUsing(findBySearchArtistValidator)
  //   const artist = await this.artistService.findBySearch(findBySearchArtist)
  //   if (!artist) {
  //     return ApiResponse.response({ response }, null, 'Artist not found', 404)
  //   }
  //   return ApiResponse.response({ response }, artist, 'Artist found successfully', 200)
  // }

  async findOneByProviderId({ params, response }: HttpContext) {
    const { providerId } = params
    if (!providerId) {
      throw new NotFoundException('Artist provider id not found')
    }
    const artist = await this.artistService.findOneByProviderId(providerId)
    if (!artist) {
      return ApiResponse.response({ response }, null, 'Artist not found', 404)
    }
    return ApiResponse.response({ response }, artist, 'Artist found successfully', 200)
  }

  async findOne({ params, response }: HttpContext) {
    const { id } = params
    if (!id) {
      throw new NotFoundException('Artist id not found')
    }
    const artist = await this.artistService.findOne(id)
    if (!artist) {
      return ApiResponse.response({ response }, null, 'Artist not found', 404)
    }
    return ApiResponse.response({ response }, artist, 'Artist found successfully', 200)
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    if (!id) {
      throw new NotFoundException('Artist id not found')
    }
    const updateArtist = await request.validateUsing(createOrUpdateArtistValidator)
    const artistData = this.serializeArtistData(updateArtist)
    const updated = await this.artistService.update(id, artistData as Artist)
    if (!updated) {
      return ApiResponse.response({ response }, null, 'Artist update failed', 400)
    }
    return ApiResponse.response({ response }, updateArtist, 'Artist updated successfully', 200)
  }

  async remove({ params, response }: HttpContext) {
    const { id } = params
    if (!id) {
      throw new NotFoundException('Artist id not found')
    }
    const removed = await this.artistService.remove(id)
    if (!removed) {
      return ApiResponse.response({ response }, null, 'Artist deletion failed', 400)
    }
    return ApiResponse.response({ response }, removed, 'Artist deleted successfully', 200)
  }

  @inject()
  async toggleVote({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { id, voteType } = params

    if (!id) {
      throw new NotFoundException('Artist id missing')
    }

    const artist = await this.artistService.findOne(id)
    if (!artist) {
      throw new NotFoundException('Artist not found')
    }

    const hasVoted = await this.artistService.hasUserVoted(id, user.id)
    let updated

    if (hasVoted) {
      updated = await this.artistService.toggleUserVote(id, user.id, voteType)
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
      updated = await this.artistService.toggleUserVote(id, user.id, voteType)
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
