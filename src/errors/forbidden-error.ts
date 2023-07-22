import { ApplicationError } from '@/protocols';

export function forbiddenError(): ApplicationError {
  return {
    name: 'ForbidenError',
    message: 'Cannot complete operation!',
  };
}
