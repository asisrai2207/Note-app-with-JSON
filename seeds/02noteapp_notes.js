/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('notes').del()
  await knex('notes').insert([
    {content: 'one', user_id: 4},
    {content: 'two', user_id: 5},
    {content: 'three', user_id: 6}
  ]);
};