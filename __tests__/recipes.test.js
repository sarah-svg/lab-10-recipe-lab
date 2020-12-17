const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/logs');


describe('recipe-lab routes', () => {
  // beforeEach(() => {
  //   return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  // });
 
  let recipe;
  beforeEach(async() => {
  
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    recipe = await Recipe.insert({
       
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
  });

  afterAll(() => {
    return pool.end();

  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [
          {
            name: 'flour',
            measurement: 'cup',
            amount: 2
          }
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            {
              name: 'flour',
              measurement: 'cup',
              amount: 2
            }
          ]
        });
      });
  });

  // it('finds a recipes by id via GET', async() => {
  //   const recipe = await Recipe.insert({ name: 'cookies', directions: [] });

  //   const response = await request(app)
  //     .get(`/api/v1/recipes/${recipe.id}`);

  //   expect(response.body).toEqual(recipe);
  // });


  it('finds a recipes by id via GET', async() => {

    await Promise.all([
      {
        dateOfEvent: '2020-12-10',
        notes: 'hey',
        rating: '2',
        recipeId: recipe.id,
 
      },
      {
        dateOfEvent: '2020-12-10',
        notes: 'hey',
        rating: '2',
        recipeId: recipe.id,
 
      },
      {
        dateOfEvent: '2020-12-10',
        notes: 'hey',
        rating: '2',
        recipeId: recipe.id,
 
      },
    ].map(log => Log.insert(log))
    );
    const response = await request(app)
      .get(`/api/v1/recipes/${recipe.id}`);

    



    expect(response.body).toEqual({ ...recipe, logs: expect.arrayContaining([
      {
        id: '1',
        dateOfEvent: '2020-12-10',
        notes: 'hey',
        rating: 2,
        recipeId: recipe.id,
 
      },
      {
        id: '2',
        dateOfEvent: '2020-12-10',
        notes: 'hey',
        rating: 2,
        recipeId: recipe.id,
 
      },
      {
        id: '3',
        dateOfEvent: '2020-12-10',
        notes: 'hey',
        rating: 2,
        recipeId: recipe.id,
 
      }
    ])
    });
  });


  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies', 
      ingredients: [
        {
          name: 'flour',
          measurement: 'cup',
          amount: 2
        }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],     
   
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',   
        
        ingredients: [
          {
            name: 'flour',
            measurement: 'cup',
            amount: 3
          }
        ],
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
    
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',     
          ingredients: [
            {
              name: 'flour',
              measurement: 'cup',
              amount: 3
            }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]

        });
      });
  });

  it('DELETES recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'good cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          name: 'flour',
          measurement: 'cup',
          amount: 2
        }
      ]
    });
    
    const response = await request(app)
      
      .delete(`/api/v1/recipes/${recipe.id}`);

    expect(response.body).toEqual(recipe);
  });








});
