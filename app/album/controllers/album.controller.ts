import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { AlbumService } from '#album/services/album.service'
import { createOrUpdateAlbumValidator } from '#album/validators/create_or_update_album.validator'
// import { findBySearchAlbumValidator } from '#album/validators/find_by_search_album.validator'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import Album from '#album/models/album'

@inject()
export default class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  private serializeAlbumData(data: any) {
    return {
      name: data.name as string,
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
    const createAlbum = await request.validateUsing(createOrUpdateAlbumValidator)
    const albumData = this.serializeAlbumData(createAlbum)
    const created = await this.albumService.create(albumData as Album)
    if (!created) {
      return ApiResponse.response({ response }, null, 'Album creation failed', 400)
    }
    return ApiResponse.response({ response }, createAlbum, 'Album created successfully', 201)
  }

  async findAll({ response }: HttpContext) {
    const albums = await this.albumService.findAll()
    if (!albums) {
      return ApiResponse.response({ response }, null, 'Albums not found', 404)
    }
    return ApiResponse.response({ response }, albums, 'Albums found successfully', 200)
  }

  // async findBySearch({ request, response }: HttpContext) {
  //   const findBySearchAlbum = await request.validateUsing(findBySearchAlbumValidator)
  //   const album = await this.albumService.findBySearch(findBySearchAlbum)
  //   if (album.length === 0) {
  //     return ApiResponse.response({ response }, [], 'Albums not found', 404)
  //   }
  //   return ApiResponse.response({ response }, album, 'Albums found successfully', 200)
  // }

  async findOneByProviderId({ params, response }: HttpContext) {
    const { providerId } = params
    if (!providerId) {
      throw new NotFoundException('Provider id not found')
    }

    const album = await this.albumService.findOneByProviderId(providerId)
    if (!album) {
      return ApiResponse.response({ response }, null, 'Album not found', 404)
    }
    return ApiResponse.response({ response }, album, 'Album found successfully', 200)
  }

  async findOne({ params, response }: HttpContext) {
    const { id } = params
    if (!id) {
      throw new NotFoundException('Album id not found')
    }

    const album = await this.albumService.findOne(id)
    if (!album) {
      return ApiResponse.response({ response }, null, 'Album not found', 404)
    }
    return ApiResponse.response({ response }, album, 'Album found successfully', 200)
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params

    if (!id) {
      throw new NotFoundException('Album id not found')
    }

    const updateAlbum = await request.validateUsing(createOrUpdateAlbumValidator)
    const albumData = this.serializeAlbumData(updateAlbum)
    const updated = await this.albumService.update(id, albumData as Album)
    if (!updated) {
      return ApiResponse.response({ response }, null, 'Album update failed', 400)
    }
    return ApiResponse.response({ response }, updateAlbum, 'Album updated successfully', 200)
  }

  async remove({ params, response }: HttpContext) {
    const { id } = params
    if (!id) {
      throw new NotFoundException('Album id not found')
    }

    const removed = await this.albumService.remove(id)
    if (!removed) {
      return ApiResponse.response({ response }, null, 'Album deletion failed', 400)
    }
    return ApiResponse.response({ response }, removed, 'Album deleted successfully', 200)
  }

  @inject()
  async toggleVote({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { id, voteType } = params

    if (!id) {
      throw new NotFoundException('Album id missing')
    }

    const album = await this.albumService.findOne(id)
    if (!album) {
      throw new NotFoundException('Album not found')
    }

    const hasVoted = await this.albumService.hasUserVoted(id, user.id)
    let updated

    if (hasVoted) {
      updated = await this.albumService.toggleUserVote(id, user.id, voteType)
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
      updated = await this.albumService.toggleUserVote(id, user.id, voteType)
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
