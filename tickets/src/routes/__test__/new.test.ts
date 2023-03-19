import request from "supertest"
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('has a route handler listenin to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('return a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({})

  expect(response.status).not.toEqual(401)

})

it.each`
  title         | label
  ${''}         | ${'empty'}
  ${null}       | ${'null'}
  ${undefined}  | ${'undefined'}
`('returns an error if an $label title value is provided', async (title) => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title,
      price: 10
    })
    .expect(400)

})

it.each`
  price         | label
  ${''}         | ${'empty'}
  ${null}       | ${'null'}
  ${undefined}  | ${'undefined'}
  ${-10}        | ${'less than 0'}
`('return an error if an $label price value is provided', async (price) => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'any_title',
      price
    })
    .expect(400)
})

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  const title = 'any_title'
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title,
      price: 20
    })
    .expect(201)

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].price).toEqual(20)
  expect(tickets[0].title).toEqual(title)

})
