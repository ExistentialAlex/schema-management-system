import type { ServerEnv } from '@env';
import type { Context } from 'hono';
import type {
  CreateUser,
  PaginationResponse,
  UpdateUser,
  User,
} from 'schema-manager-schemas';
import { UserGetException, UserNotFoundException } from '@/exceptions';
import { convertExternalPaginationResponse, log, paginate } from '../utils';

let users: User[] = [
  {
    id: 1,
    name: 'Alex Ashwood',
    jobTitle: 'Developer',
  },
];

// Add more dummy users
// This is just for testing purposes, in a real application you would fetch this from a database
for (let i = 0; i < 50; i++) {
  users.push({
    id: i + 2,
    name: `User ${i + 1}`,
    jobTitle: 'Developer',
  });
}

export const useUserService = (c: Context<ServerEnv>) => {
  const reqID = c.get('requestId');

  const getUser = (id: number): User => {
    log(reqID, `Getting User with ID '${id}'`);

    if (id === 999) {
      throw new UserGetException(c, { id });
    }

    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new UserNotFoundException(c, { id });
    }

    log(reqID, `User Found`);

    return user;
  };

  const getUsers = (
    page?: number,
    pageSize?: number,
    search?: string,
    sort?: string[] | string,
  ): PaginationResponse<User> => {
    log(reqID, 'Getting paginated list of users');
    return convertExternalPaginationResponse(c, paginate(users, page, pageSize, search, sort));
  };

  const createUser = (user: CreateUser): User => {
    log(reqID, 'Creating new user');

    const newUser: User = {
      id: users.length + 1,
      ...user,
    };
    users.push(newUser);

    log(reqID, 'New user created');

    return newUser;
  };

  const updateUser = (id: number, user: UpdateUser): User => {
    log(reqID, `Updating user with ID '${id}'`);

    const existingUser = getUser(id);
    const updatedUser = { ...existingUser, ...user };
    users = users.map((u) => (u.id === id ? updatedUser : u));

    log(reqID, 'New user created');

    return updatedUser;
  };

  const deleteUser = (id: number) => {
    log(reqID, `Deleting user with ID '${id}'`);

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new UserNotFoundException(c, { id });
    }
    users.splice(userIndex, 1);

    log(reqID, 'User deleted');

    return { id };
  };

  return { getUser, getUsers, createUser, updateUser, deleteUser };
};
