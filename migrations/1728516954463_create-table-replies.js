/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primarykey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('replies', 'fk_replies.thread_id_thread.id', {
    foreignKeys: {
      columns: 'thread_id',
      references: 'threads(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('replies', 'fk_comments.comment_id_comments.id', {
    foreignKeys: {
      columns: 'comment_id',
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('replies', 'fk_replies.owner_users.id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
