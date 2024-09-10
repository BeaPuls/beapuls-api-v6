import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { FavoriteTrackService } from '#favorite/track/services/favorite_track.service'
import { FavoriteArtistService } from '#favorite/artist/services/favorite_artist.service'
import { FavoriteAlbumService } from '#favorite/album/services/favorite_album.service'
import { ApiResponse } from '#classes/api_response'
import NotFoundException from '#exceptions/not_found.exception'
import Album from '#album/models/album'
import Artist from '#artist/models/artist'
import Track from '#track/models/track'

@inject()
export default class FavoriteController {
  constructor(
    private readonly favoriteTrackService: FavoriteTrackService,
    private readonly favoriteArtistService: FavoriteArtistService,
    private readonly favoriteAlbumService: FavoriteAlbumService
  ) {}

  private async getFavoriteData(data: any) {
    let entity: any
    if (data.trackId) {
      entity = await Track.query().where('id', data.trackId).first()
    }
    if (data.artistId) {
      entity = await Artist.query().where('id', data.artistId).first()
    }
    if (data.albumId) {
      entity = await Album.query().where('id', data.albumId).first()
    }
    return {
      id: data.id,
      entity: {
        id: data.trackId ? data.trackId : data.artistId ? data.artistId : data.albumId,
        image: entity.providerItemImage,
        name: entity.name,
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  async getUserFavorites({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    try {
      const [trackFavorites, artistFavorites, albumFavorites] = await Promise.all([
        this.favoriteTrackService.getUserTrackFavorites(user.id),
        this.favoriteArtistService.getUserArtistFavorites(user.id),
        this.favoriteAlbumService.getUserAlbumFavorites(user.id),
      ])

      const formattedFavorites = await Promise.all([
        ...trackFavorites.map(async (favorite) => ({
          type: 'track',
          favorite: await this.getFavoriteData(favorite),
        })),
        ...artistFavorites.map(async (favorite) => ({
          type: 'artist',
          favorite: await this.getFavoriteData(favorite),
        })),
        ...albumFavorites.map(async (favorite) => ({
          type: 'album',
          favorite: await this.getFavoriteData(favorite),
        })),
      ])

      const sortedFavorites = formattedFavorites
        .sort((a, b) => b.favorite.createdAt - a.favorite.createdAt)
        .slice(0, 10)

      if (sortedFavorites.length === 0) {
        throw new NotFoundException('Aucun favori trouvé pour cet utilisateur')
      }
      return ApiResponse.response(
        { response },
        sortedFavorites,
        "Favoris récents de l'utilisateur récupérés avec succès",
        200
      )
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiResponse.response({ response }, null, error.message, 404)
      }
      console.error("Erreur lors de la récupération des favoris récents de l'utilisateur:", error)
      return ApiResponse.response(
        { response },
        null,
        "Erreur lors de la récupération des favoris récents de l'utilisateur",
        500
      )
    }
  }

  // async toggleFavorite({ auth, params }: HttpContext) {
  //   const user = await auth.getUserOrFail()
  //   const { itemId, itemType } = params

  //   if (itemType === 'track') {
  //     await this.favoriteTrackService.toggleUserTrackFavorite(user.id, itemId)
  //   }
  //   if (itemType === 'artist') {
  //     await this.favoriteArtistService.toggleUserArtistFavorite(user.id, itemId)
  //   }
  //   if (itemType === 'album') {
  //     await this.favoriteAlbumService.toggleUserAlbumFavorite(user.id, itemId)
  //   }

  //   return ApiResponse.response({ response }, null, 'Favori ajouté avec succès', 200)
  // }
}
