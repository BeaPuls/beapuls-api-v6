import ArtistCommentData from '#comment/artist/models/artist_comment'
import ArtistComment from '#comment/artist/models/artist_comment'
import NotFoundException from '#exceptions/not_found.exception'
import { inject } from '@adonisjs/core'
import ArtistCommentVote from '../models/artist_comment_vote.js'

@inject()
export class ArtistCommentService {
  async create(createArtistComment: ArtistCommentData) {
    const newArtistComment = await ArtistComment.create(createArtistComment)
    return newArtistComment
  }

  findAll() {
    return ArtistComment.all()
  }

  async findOne(id: string) {
    const artistComment = await ArtistComment.find(id)
    return artistComment
  }

  async update(id: string, updateArtistComment: ArtistCommentData) {
    const artistComment = await ArtistComment.find(id)
    await artistComment?.merge(updateArtistComment).save()
    return artistComment
  }

  async remove(id: string) {
    const artistComment = await ArtistComment.findOrFail(id)
    try {
      await artistComment.delete()
      return true
    } catch (error) {
      return false
    }
  }

  async hasUserVoted(commentId: string, userId: string): Promise<boolean> {
    const vote = await ArtistCommentVote.query()
      .where('commentId', commentId)
      .andWhere('userId', userId)
      .first()

    return !!vote
  }

  async toggleUserVote(commentId: string, userId: string, voteType: 'up' | 'down') {
    let vote = await ArtistCommentVote.query()
      .where('commentId', commentId)
      .andWhere('userId', userId)
      .first()

    if (!vote) {
      vote = new ArtistCommentVote()
      // throw new NotFoundException('Vote not found')
    }

    let comment = await ArtistComment.find(commentId)
    if (!comment) {
      throw new NotFoundException('Artist Comment not found')
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
