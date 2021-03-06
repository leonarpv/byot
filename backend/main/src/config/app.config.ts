import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: process.env.APP_PORT,
  secret: process.env.APP_SECRET,
  superAdmin: {
    userName: process.env.APP_SUPER_ADMIN_USERNAME,
    email: process.env.APP_SUPER_ADMIN_EMAIL,
    password: process.env.APP_SUPER_ADMIN_PASSWORD,
  },
  demo: {
    email: process.env.APP_DEMO_USER_EMAIL,
    password: process.env.APP_DEMO_USER_PASSWORD,
  },
  test: {
    email: process.env.APP_TEST_USER_EMAIL,
    password: process.env.APP_TEST_USER_PASSWORD,
  },
}));
