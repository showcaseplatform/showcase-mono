import { User } from '.prisma/client';
import { Request } from 'express';

export type ApiRequest = Request & { user?: User }