import TrackVote from '#comment/track/models/track_vote'
import NotFoundException from '#exceptions/not_found.exception'
import TrackData from '#track/models/track'
import Track from '#track/models/track'
// import FindBySearchTrackData from '#track/models/track'
import { inject } from '@adonisjs/core'

@inject()
export class TrackService {
  async create(createTrack: TrackData) {
    const newTrack = await Track.create(createTrack)
    return newTrack
  }

  findAll() {
    return Track.all()
  }

  // findBySearch(findBySearchTrack: FindBySearchTrackData) {
  //   return Track.query().where((query) => {
  //     Object.keys(findBySearchTrack).forEach((key) => {
  //       query.where(key, findBySearchTrack[key])
  //     })
  //   })
  // }

  async findOne(id: string) {
    const track = await Track.find(id)
    return track
  }

  async findOneByProviderId(providerId: string) {
    const track = await Track.findBy('provider_item_id', providerId)
    return track
  }

  async update(id: string, updateTrack: TrackData) {
    const track = await Track.find(id)
    await track?.merge(updateTrack).save()
    return track
  }

  async remove(id: string) {
    const track = await Track.findOrFail(id)
    try {
      await track.delete()
      return true
    } catch (error) {
      return false
    }
  }

  async hasUserVoted(trackId: string, userId: string): Promise<string | false> {
    const vote = await TrackVote.query()
      .where('trackId', trackId)
      .andWhere('userId', userId)
      .first()

    if (vote) {
      return vote.voteType
    }
    return false
  }

  async toggleUserVote(trackId: string, userId: string, voteType: 'up' | 'down') {
    let vote = await TrackVote.query().where('trackId', trackId).andWhere('userId', userId).first()

    if (!vote) {
      vote = new TrackVote()
    }

    let track = await Track.find(trackId)
    if (!track) {
      throw new NotFoundException('Track not found')
    }

    if (vote.voteType) {
      if (voteType === 'up' && vote.voteType === 'down') {
        track.upVote++
        track.downVote--
        await vote.merge({ voteType: 'up' }).save()
      } else if (voteType === 'down' && vote.voteType === 'up') {
        track.upVote--
        track.downVote++
        await vote.merge({ voteType: 'down' }).save()
      } else if (voteType === 'up' && vote.voteType === 'up') {
        await vote.delete()
        track.upVote--
      } else if (voteType === 'down' && vote.voteType === 'down') {
        await vote.delete()
        track.downVote--
      }
    } else {
      vote.trackId = trackId
      vote.userId = userId
      vote.voteType = voteType
      await vote.save()

      if (voteType === 'up') {
        track.upVote++
      } else {
        track.downVote++
      }
    }

    await track.save()

    return track
  }
}
