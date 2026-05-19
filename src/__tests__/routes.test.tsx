import { router } from '../router/routes';

describe('routes', () => {
  it('creates a valid router instance', () => {
    expect(router).toBeDefined();
    expect(typeof router.navigate).toBe('function');
  });
});
