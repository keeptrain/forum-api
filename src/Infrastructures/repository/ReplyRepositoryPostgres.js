const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const {
      threadId, commentId, content, owner,
    } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, threadId, commentId, content, date, owner, isDelete],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getRepliesOnCommentById(commentId) {
    const query = {
      text: `SELECT replies.id, replies.content, replies.date, users.username, replies.is_delete, replies.comment_id 
      FROM replies
      JOIN users ON replies.owner = users.id 
      WHERE replies.comment_id = ANY($1::text[])
      ORDER BY replies.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyReplyAvailability(id) {
    const query = {
      text: 'SELECT id, owner FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan di database');
    }
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('user ini tidak di izinkan untuk menghapus balasan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
