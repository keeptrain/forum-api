const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    thread_id = 'thread-123',
    comment_id = 'comment-123',
    content = 'this is content',
    owner = 'user-123',
    date = new Date('2024-11-30T00:00:00.000Z').toISOString(),
    is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO replies (id, thread_id, comment_id, content, date, owner, is_delete) VALUES($1, $2, $3, $4, $5, $6, $7) ',
      values: [id, thread_id, comment_id, content, date, owner, is_delete],
    };
    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
