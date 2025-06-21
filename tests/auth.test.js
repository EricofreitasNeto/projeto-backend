const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const { User } = require('../src/models');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await User.destroy({ where: {} });
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      firstname: 'Test',
      surname: 'User'
    });
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
  });

  it('should generate a token for valid credentials', async () => {
    const res = await request(app)
      .post('/v1/user/token')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    expect(res.body.token.split('.').length).toBe(3);
  });
});