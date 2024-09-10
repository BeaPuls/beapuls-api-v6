import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { AlbumService } from '#album/services/album.service'
import { createOrUpdateAlbumValidator } from '#album/validators/create_or_update_album.validator'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import Album from '#album/models/album'
import { FavoriteAlbumService } from '#favorite/album/services/favorite_album.service'

@inject()
export default class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly favoriteAlbumService: FavoriteAlbumService
  ) {}

  private serializePostAlbumData(data: any) {
    return {
      id: data.id as string,
      name: data.name as string,
      artistName: data.artist_name ?? (data.artistName as string),
      providerItemUri: data.provider_item_uri ?? (data.providerItemUri as string),
      providerItemImage: data.provider_item_image ?? (data.providerItemImage as string),
      providerItemId: data.provider_item_id ?? (data.providerItemId as string),
      providerTypeId: data.provider_type_id ?? (data.providerTypeId as string | undefined),
      upVote: data.up_vote ?? (data.upVote as number),
      downVote: data.down_vote ?? (data.downVote as number),
    }
  }

  private serializeGetAlbumData(data: any) {
    return {
      id: data.id as string,
      name: data.name as string,
      artistName: data.artist_name ?? (data.artistName as string),
      providerItemUri: data.provider_item_uri ?? (data.providerItemUri as string),
      providerItemImage: data.provider_item_image ?? (data.providerItemImage as string),
      providerItemId: data.provider_item_id ?? (data.providerItemId as string),
      providerTypeId: data.provider_type_id ?? (data.providerTypeId as string | undefined),
      upVote: data.up_vote ?? (data.upVote as number),
      downVote: data.down_vote ?? (data.downVote as number),
      hasVoted: data.has_voted ?? (data.hasVoted as string | false),
      isFavorite: data.is_favorite ?? (data.isFavorite as boolean),
    }
  }

  async create({ request, response }: HttpContext) {
    const createAlbum = await request.validateUsing(createOrUpdateAlbumValidator)
    const albumData = this.serializePostAlbumData(createAlbum)
    const created = await this.albumService.create(albumData as unknown as Album)
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

  async findOneByProviderId({ params, response }: HttpContext) {
    const { providerId, providerTypeId } = params
    if (!providerId) {
      throw new NotFoundException('Provider id not found')
    }
    if (!providerTypeId) {
      throw new NotFoundException('Provider type id not found')
    }

    const album = await this.albumService.findOneByProviderId(providerId)
    if (!album) {
      return ApiResponse.response({ response }, null, 'Album not found', 404)
    }
    return ApiResponse.response({ response }, album, 'Album found successfully', 200)
  }

  async findOneOrCreate({ auth, request, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { providerItemId } = params

    let album = await this.albumService.findOneByProviderId(providerItemId)

    if (!album) {
      const searchAlbumData = await request.validateUsing(createOrUpdateAlbumValidator)
      album = await this.albumService.create(searchAlbumData as unknown as Album)
      if (!album) {
        return ApiResponse.response({ response }, null, 'Album creation failed', 400)
      }
    }
    const hasVoted = await this.albumService.hasUserVoted(album.id, user.id)
    const albumData = this.serializeGetAlbumData(album)
    albumData.hasVoted = hasVoted

    const isFavorite = await this.favoriteAlbumService.isUserFavorite(album.id, user.id)
    albumData.isFavorite = isFavorite
    return ApiResponse.response({ response }, albumData, 'Album found successfully', 200)
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params

    if (!id) {
      throw new NotFoundException('Album id not found')
    }

    const updateAlbum = await request.validateUsing(createOrUpdateAlbumValidator)
    const albumData = this.serializePostAlbumData(updateAlbum)
    const updated = await this.albumService.update(id, albumData as unknown as Album)
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
