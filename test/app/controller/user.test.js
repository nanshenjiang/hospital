'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/user.test.js', () => {
  it('should assert', function* () {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));
  });

  it('should POST /user/register', () => {
    app.mockCsrf();
    return app.httpRequest()
      .post('/user/register')
      .send({
        phone: '13800138000',
        email: 'admin@sample.com',
        password: '123456',
        name: 'Admin',
      })
      .expect(200);
  });
});
