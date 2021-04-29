import { Request } from 'express';
import { User } from './user';

export type ApiRequest = Request & { user?: User }