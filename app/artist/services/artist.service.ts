import ArtistData from '#artist/models/artist'
import Artist from '#artist/models/artist'
import ArtistVote from '#comment/artist/models/artist_vote'
import NotFoundException from '#exceptions/not_found.exception'
// import FindBySearchArtistData from '#artist/models/artist'
import { inject } from '@adonisjs/core'

@inject()
export class ArtistService {
  async create(createArtist: ArtistData) {
    const newArtist = await Artist.create(createArtist)
    return newArtist
  }

  findAll() {
    return Artist.all()
  }

  // findBySearch(findBySearchArtist: FindBySearchArtistData) {
  //   return Artist.query().where((query) => {
  //     Object.keys(findBySearchArtist).forEach((key) => {
  //       query.where(key, findBySearchArtist[key])
  //     })
  //   })
  // }

  async findOne(id: string) {
    const artist = await Artist.find(id)
    return artist
  }

  async findOneByProviderId(providerId: string) {
    const artist = await Artist.findBy('provider_item_id', providerId)
    return artist
  }

  async update(id: string, updateArtist: ArtistData) {
    const artist = await Artist.find(id)
    await artist?.merge(updateArtist).save()
    return artist
  }

  async remove(id: string) {
    const artist = await Artist.findOrFail(id)
    try {
      await artist.delete()
      return true
    } catch (error) {
      return false
    }
  }

  async hasUserVoted(artistId: string, userId: string): Promise<boolean> {
    const vote = await ArtistVote.query()
      .where('artistId', artistId)
      .andWhere('userId', userId)
      .first()

    return !!vote
  }

  async toggleUserVote(artistId: string, userId: string, voteType: 'up' | 'down') {
    let vote = await ArtistVote.query()
      .where('artistId', artistId)
      .andWhere('userId', userId)
      .first()

    if (!vote) {
      vote = new ArtistVote()
    }

    let artist = await Artist.find(artistId)
    if (!artist) {
      throw new NotFoundException('Artist not found')
    }

    if (vote.voteType) {
      if (voteType === 'up' && vote.voteType === 'down') {
        artist.upVote++
        artist.downVote--
        await vote.merge({ voteType: 'up' }).save()
      } else if (voteType === 'down' && vote.voteType === 'up') {
        artist.upVote--
        artist.downVote++
        await vote.merge({ voteType: 'down' }).save()
      } else if (voteType === 'up' && vote.voteType === 'up') {
        await vote.delete()
        artist.upVote--
      } else if (voteType === 'down' && vote.voteType === 'down') {
        await vote.delete()
        artist.downVote--
      }
    } else {
      vote.artistId = artistId
      vote.userId = userId
      vote.voteType = voteType
      await vote.save()

      if (voteType === 'up') {
        artist.upVote++
      } else {
        artist.downVote++
      }
    }

    await artist.save()

    return artist
  }
}
