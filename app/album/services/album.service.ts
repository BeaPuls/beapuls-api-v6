import AlbumData from '#album/models/album'
import Album from '#album/models/album'
import AlbumVote from '#comment/album/models/album_vote'
import NotFoundException from '#exceptions/not_found.exception'
// import FindBySearchAlbumData from '#album/models/album'
import { inject } from '@adonisjs/core'

@inject()
export class AlbumService {
  async create(createAlbum: AlbumData) {
    const newAlbum = await Album.create(createAlbum)
    return newAlbum
  }

  findAll() {
    return Album.all()
  }

  // findBySearch(findBySearchAlbum: FindBySearchAlbumData) {
  //   return Album.query().where((query) => {
  //     Object.keys(findBySearchAlbum).forEach((key) => {
  //       query.where(key, findBySearchAlbum[key])
  //     })
  //   })
  // }

  async findOne(id: string) {
    const album = await Album.find(id)
    return album
  }

  async findOneByProviderId(providerId: string) {
    const album = await Album.findBy('provider_item_id', providerId)
    return album
  }

  async update(id: string, updateAlbum: AlbumData) {
    const album = await Album.find(id)
    await album?.merge(updateAlbum).save()
    return album
  }

  async remove(id: string) {
    const album = await Album.findOrFail(id)
    try {
      await album.delete()
      return true
    } catch (error) {
      return false
    }
  }

  async hasUserVoted(albumId: string, userId: string): Promise<boolean> {
    const vote = await AlbumVote.query()
      .where('albumId', albumId)
      .andWhere('userId', userId)
      .first()

    return !!vote
  }

  async toggleUserVote(albumId: string, userId: string, voteType: 'up' | 'down') {
    let vote = await AlbumVote.query().where('albumId', albumId).andWhere('userId', userId).first()

    if (!vote) {
      vote = new AlbumVote()
    }

    let album = await Album.find(albumId)
    if (!album) {
      throw new NotFoundException('Album not found')
    }

    if (vote.voteType) {
      if (voteType === 'up' && vote.voteType === 'down') {
        album.upVote++
        album.downVote--
        await vote.merge({ voteType: 'up' }).save()
      } else if (voteType === 'down' && vote.voteType === 'up') {
        album.upVote--
        album.downVote++
        await vote.merge({ voteType: 'down' }).save()
      } else if (voteType === 'up' && vote.voteType === 'up') {
        await vote.delete()
        album.upVote--
      } else if (voteType === 'down' && vote.voteType === 'down') {
        await vote.delete()
        album.downVote--
      }
    } else {
      vote.albumId = albumId
      vote.userId = userId
      vote.voteType = voteType
      await vote.save()

      if (voteType === 'up') {
        album.upVote++
      } else {
        album.downVote++
      }
    }

    await album.save()

    return album
  }
}
