/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('comments', {
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
    },
  });
  pgm.addColumn('replies', {
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('comments', 'is_delete');
  pgm.dropColumn('replies', 'is_delete');
};
