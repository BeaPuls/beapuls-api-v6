import TrackCommentData from '#comment/track/models/track_comment'
import TrackComment from '#comment/track/models/track_comment'
import NotFoundException from '#exceptions/not_found.exception'
import { inject } from '@adonisjs/core'
import TrackCommentVote from '../models/track_comment_vote.js'

@inject()
export class TrackCommentService {
  async create(createTrackComment: TrackCommentData) {
    const newTrackComment = await TrackComment.create(createTrackComment)
    return newTrackComment
  }

  findAll() {
    return TrackComment.all()
  }

  async findOne(id: string) {
    const trackComment = await TrackComment.find(id)
    return trackComment
  }

  async update(id: string, updateTrackComment: TrackCommentData) {
    const trackComment = await TrackComment.find(id)
    await trackComment?.merge(updateTrackComment).save()
    return trackComment
  }

  async remove(id: string) {
    const trackComment = await TrackComment.findOrFail(id)
    try {
      await trackComment.delete()
      return true
    } catch (error) {
      return false
    }
  }

  async hasUserVoted(commentId: string, userId: string): Promise<boolean> {
    const vote = await TrackCommentVote.query()
      .where('commentId', commentId)
      .andWhere('userId', userId)
      .first()

    return !!vote
  }

  async toggleUserVote(commentId: string, userId: string, voteType: 'up' | 'down') {
    let vote = await TrackCommentVote.query()
      .where('commentId', commentId)
      .andWhere('userId', userId)
      .first()

    if (!vote) {
      vote = new TrackCommentVote()
      // throw new NotFoundException('Vote not found')
    }

    let comment = await TrackComment.find(commentId)
    if (!comment) {
      throw new NotFoundException('Track Comment not found')
    }

    if (vote.voteType) {
      if (voteType === 'up' && vote.voteType === 'down') {
        comment.upVote++
        comment.downVote--
        await vote.merge({ voteType: 'up' }).save()
      } else if (voteType === 'down' && vote.voteType === 'up') {
        comment.upVote--
        comment.downVote++
        await vote.merge({ voteType: 'down' }).save()
      } else if (voteType === 'up' && vote.voteType === 'up') {
        await vote.delete()
        comment.upVote--
      } else if (voteType === 'down' && vote.voteType === 'down') {
        await vote.delete()
        comment.downVote--
      }
    } else {
      vote.commentId = commentId
      vote.userId = userId
      vote.voteType = voteType
      await vote.save()

      if (voteType === 'up') {
        comment.upVote++
      } else {
        comment.downVote++
      }
    }

    await comment.save()

    return comment
  }
}
