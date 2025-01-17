describe('AddedLikeComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            commentId: 'comment-123',
        };

        // Action and Assert
        expect(() => new AddedLikeComment(payload)).toThrowError('ADDED_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            commentId: 'comment-123',
            userId: 'user-123',
        };

        // Action and Assert
        expect(() => new AddedLikeComment(payload)).toThrowError('ADDED_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedLikeComment object correctly', () => {
        // Arrange
        const payload = {
            id: 'like-123',
            commentId: 'comment-123',
            userId: 'user-123',
        };

        // Action
        const addedLikeComment = new AddedLikeComment(payload);

        // Assert
        expect(addedLikeComment.id).toEqual(payload.id);
        expect(addedLikeComment.commentId).toEqual(payload.commentId);
        expect(addedLikeComment.userId).toEqual(payload.userId);
    });
});