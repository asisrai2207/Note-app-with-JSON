/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {username: 'asis', password: 'hello'},
    {username: 'alina', password: 'lesley'},
    {username: 'dennis', password: 'password'}
  ]);
};