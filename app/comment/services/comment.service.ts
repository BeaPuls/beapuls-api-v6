import { inject } from '@adonisjs/fold'
import { TrackCommentService } from '#comment/track/services/track_comment.service'
import { ArtistCommentService } from '#comment/artist/services/artist_comment.service'
import { AlbumCommentService } from '#comment/album/services/album_comment.service'
import Album from '#album/models/album'
import Artist from '#artist/models/artist'
import Track from '#track/models/track'

@inject()
export class CommentService {
  constructor(
    private readonly trackCommentService: TrackCommentService,
    private readonly artistCommentService: ArtistCommentService,
    private readonly albumCommentService: AlbumCommentService
  ) {}

  async getCommentData(data: any) {
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
      comment: data.comment,
      upVote: data.upVote,
      downVote: data.downVote,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  async getLastUserComments(userId: string, limit: number = 50) {
    const [trackComments, artistComments, albumComments] = await Promise.all([
      this.trackCommentService.getLastUserComments(userId, limit),
      this.artistCommentService.getLastUserComments(userId, limit),
      this.albumCommentService.getLastUserComments(userId, limit),
    ])

    const formattedComments = await Promise.all([
      ...trackComments.map(async (comment) => ({
        type: 'track',
        // entity: await this.trackCommentService.getTrackData(comment.trackId),
        comment: await this.getCommentData(comment),
      })),
      ...artistComments.map(async (comment) => ({
        type: 'artist',
        // entity: await this.artistCommentService.getArtistData(comment.artistId),
        comment: await this.getCommentData(comment),
      })),
      ...albumComments.map(async (comment) => ({
        type: 'album',
        // entity: await this.albumCommentService.getAlbumData(comment.albumId),
        comment: await this.getCommentData(comment),
      })),
    ])

    return formattedComments
      .sort((a, b) => b.comment.createdAt - a.comment.createdAt)
      .slice(0, limit)
  }
}
