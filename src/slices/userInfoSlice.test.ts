import reducer, { addUserInfo } from './userInfoSlice';
import type { UserInfo } from './userInfoSlice';

const validEntry: UserInfo = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  gender: 'female',
  age: 25,
  image: 'data:image/png;base64,abc',
  password: 'Pass123!',
  confirmPassword: 'Pass123!',
  country: 'Armenia',
  termsAccepted: true,
};

describe('userInfoSlice', () => {
  it('returns empty array as initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual([]);
  });

  it('addUserInfo appends an entry to the list', () => {
    const state = reducer(undefined, addUserInfo(validEntry));
    expect(state).toHaveLength(1);
    expect(state[0].name).toBe('Jane Doe');
  });

  it('addUserInfo preserves existing entries', () => {
    let state = reducer(undefined, addUserInfo(validEntry));
    const second: UserInfo = {
      ...validEntry,
      name: 'John Doe',
      email: 'john@example.com',
    };
    state = reducer(state, addUserInfo(second));
    expect(state).toHaveLength(2);
    expect(state[0].name).toBe('Jane Doe');
    expect(state[1].name).toBe('John Doe');
  });

  it('stores all fields of the submitted entry', () => {
    const state = reducer(undefined, addUserInfo(validEntry));
    expect(state[0]).toMatchObject({
      email: 'jane@example.com',
      gender: 'female',
      age: 25,
      country: 'Armenia',
      termsAccepted: true,
    });
  });

  it('action type has correct format', () => {
    expect(addUserInfo(validEntry).type).toBe('userInfo/addUserInfo');
  });
});
