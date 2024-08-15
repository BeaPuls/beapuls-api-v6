import AlbumCommentData from '#comment/album/models/album_comment'
import AlbumComment from '#comment/album/models/album_comment'
import NotFoundException from '#exceptions/not_found.exception'
import { inject } from '@adonisjs/core'
import AlbumCommentVote from '../models/album_comment_vote.js'

@inject()
export class AlbumCommentService {
  async create(createAlbumComment: AlbumCommentData) {
    const newAlbumComment = await AlbumComment.create(createAlbumComment)
    return newAlbumComment
  }

  findAll() {
    return AlbumComment.all()
  }

  async findOne(id: string) {
    const albumComment = await AlbumComment.find(id)
    return albumComment
  }

  async update(id: string, updateAlbumComment: AlbumCommentData) {
    const albumComment = await AlbumComment.find(id)
    await albumComment?.merge(updateAlbumComment).save()
    return albumComment
  }

  async remove(id: string) {
    const albumComment = await AlbumComment.findOrFail(id)
    try {
      await albumComment.delete()
      return true
    } catch (error) {
      return false
    }
  }

  async hasUserVoted(commentId: string, userId: string): Promise<boolean> {
    const vote = await AlbumCommentVote.query()
      .where('commentId', commentId)
      .andWhere('userId', userId)
      .first()

    return !!vote
  }

  async toggleUserVote(commentId: string, userId: string, voteType: 'up' | 'down') {
    let vote = await AlbumCommentVote.query()
      .where('commentId', commentId)
      .andWhere('userId', userId)
      .first()

    if (!vote) {
      vote = new AlbumCommentVote()
      // throw new NotFoundException('Vote not found')
    }

    let comment = await AlbumComment.find(commentId)
    if (!comment) {
      throw new NotFoundException('Album Comment not found')
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
