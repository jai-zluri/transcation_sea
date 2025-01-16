// jest.setup.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

const prismaMock = mockDeep<PrismaClient>();

jest.mock('./src/prisma/client', () => ({
  __esModule: true,
  default: prismaMock
}));

export interface Context {
  prisma: PrismaClient;
}

export interface MockContext {
  prisma: DeepMockProxy<PrismaClient>;
}

export const createMockContext = (): MockContext => {
  return {
    prisma: prismaMock
  };
};

export const mockCtx = createMockContext();