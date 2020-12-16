const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/logs');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  
  afterAll(() => {
    return pool.end;
  });
  
  it('creates a log', async() => {
    const recipe = await Recipe.insert(
      {
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      }
    );
    return await request(app)
      .post('/api/v1/logs')
      .send({
        dateOfEvent: '2020-12-10',
        notes: 'Sunny day.',
        rating: 6,
        recipeId: recipe.id
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          dateOfEvent: '2020-12-10',
          notes: 'Sunny day.',
          rating: '6',
          recipeId: recipe.id
        });
      });
  });
  
  
  it('gets all logs', async() => {
    const recipe = await Recipe.insert(
      {
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      }
    );
  
    const logs = await Promise.all([
      {     dateOfEvent: '2020-12-10', notes: 'Sunny day.', rating: 6, recipeId: recipe.id },
      {     dateOfEvent: '2020-12-10', notes: 'Wind and rain.', rating: 7, recipeId: recipe.id },
      {     dateOfEvent: '2020-12-10', notes: 'Lovely snow.', rating: 2, recipeId: recipe.id }
    ].map(log => Log.insert(log)));
  
    return await request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });
  
  it('GET one log by id', async() => {
    const recipe = await Recipe.insert(
      {
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      }
    );
  
    const log = await Log.insert(
      {     dateOfEvent: '2020-12-10', notes: 'Wind and rain.', rating: 7, recipeId: recipe.id }
    );
  
    const response = await request(app)
      .get(`/api/v1/logs/${log.id}`);
  
    expect(response.body).toEqual(log);
  });
  
  it('updates a log by id', async() => {
    const recipe = await Recipe.insert(
      {
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      }
    );
  
    const log = await Log.insert(
      {     dateOfEvent: '2020-12-10', notes: 'Lovely snow.', rating: 2, recipeId: recipe.id }
    );
      
    return await request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({     dateOfEvent: '2020-12-10', notes: 'Lovely snow.', rating: 2, recipeId: recipe.id })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          dateOfEvent: '2020-12-10', notes: 'Lovely snow.', rating: '2', recipeId: recipe.id
        });
      });
  });
  
  it('delete a log via DELETE', async() => {
    const recipe = await Recipe.insert(
      {
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      }
    );
    
    const log = await Log.insert(
      {     dateOfEvent: '2020-12-10', notes: 'Lovely snow.', rating: 2, recipeId: recipe.id }
    );
  
    const response = await request(app)
      .delete(`/api/v1/logs/${log.id}`);
  
    expect(response.body).toEqual({
      ...log,
      dateOfEvent: '2020-12-10',
      notes: 'Lovely snow.',
      rating: '2',
      recipeId: recipe.id
    });
  
  
  
  });
  
});

