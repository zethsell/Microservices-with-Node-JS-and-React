import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

const createTicket = (cookie: string[] = []) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookie.length > 0 ? cookie : global.signin())
    .send({
      title: '1',
      price: 20
    })
}

it('return 404 if the provided id does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: '131312',
      price: 20
    })
    .expect(404)
})

it('return a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: '131312',
      price: 20
    })
    .expect(401)
})

it('return 401 if the user dows not own the ticket', async () => {
  const response = await createTicket()

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: '13131fdsfdsf2',
      price: 2000
    })
    .expect(401)
})

it('return a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin()
  const response = await createTicket(cookie)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 2000
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'any_title',
      price: -2000
    })
    .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin()
  const response = await createTicket(cookie)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new_title',
      price: 2000
    })
    .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketResponse.body).toMatchObject({
    title: 'new_title',
    price: 2000
  })
})
