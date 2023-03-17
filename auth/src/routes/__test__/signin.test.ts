import request from 'supertest'
import { app } from '../../app'

it('fails when a email tha does not existis in supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password : 'password'
    })
    .expect(400)
})

it('fails whe nan incorrect password is supplied', async() => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password : 'password'
  })
  expect(201)

  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test2@test.com',
    password : 'password'
  })
  .expect(400)
})

it('responds with a cookie when give valid credentials', async () =>{
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password : 'password'
  })
  expect(201)

 const response = await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password : 'password'
  })
  .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()

})