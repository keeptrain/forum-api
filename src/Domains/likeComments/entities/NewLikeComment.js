class NewLikeComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId, userId } = payload;

    this.commentId = commentId;
    this.userId = userId;
  }

  _verifyPayload({ commentId, userId }) {
    if (!commentId || !userId) {
      throw new Error('NEW_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('NEW_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewLikeComment;
