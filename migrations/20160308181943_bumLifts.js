export const up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username');
      table.string('password');
      table.string('name');
      table.string('email');
      table.string('profile_pic_url');
      table.timestamps();
    }),

    knex.schema.createTable('workouts', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.datetime('date');
      table.text('comments');
      table.integer('user_id')
        .references('id')
        .inTable('users');
      table.timestamps();
    }),

    knex.schema.createTable('lifts', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.integer('reps');
      table.integer('sets');
      table.decimal('weight');
      table.integer('workout_id')
        .references('id')
        .inTable('workouts');
    }),
  ]);

export const down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('lifts'),
    knex.schema.dropTable('workouts'),
    knex.schema.dropTable('users'),
  ]);

export default { up, down };
