import { Given } from './fixtures';

Given(
  'I am logged in to schema-manager as {string} with {string}',
  async ({ loginPage }, organisation: string, email = 'test@test.com') => {
    await loginPage.login(email, organisation);
  },
);
