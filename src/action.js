import Err from 'err';
import handleError from './handleError';
import { trace } from './actions';

export default async function action(config) {
  const { action } = config;
  switch (action) {
    case 'trace':
      return trace(config);
  }
  return handleError(new Err(`action '${action}' not found`));
}
