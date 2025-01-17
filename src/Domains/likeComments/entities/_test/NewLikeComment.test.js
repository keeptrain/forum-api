const NewLikeComment = require('../NewLikeComment');

describe('NewLikeComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            userId: 'user-123',
        };

        // Action and Assert
        expect(() => new NewLikeComment(payload)).toThrowError('NEW_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            commentId: 123,
            userId: 'user-123',
        };

        // Action and Assert
        expect(() => new NewLikeComment(payload)).toThrowError('NEW_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create NewLikeComment object correctly', () => {
        // Arrange
        const payload = {
            commentId: 'comment-123',
            userId: 'user-123',
        };

        // Action
        const newLikeComment = new NewLikeComment(payload);

        // Assert
        expect(newLikeComment.commentId).toEqual(payload.commentId);
        expect(newLikeComment.userId).toEqual(payload.userId);
    });
});