import Err from 'err';
import commander from 'commander';
import action from './action';
import handleError from './handleError';

let isAction = false;

commander.command('trace');
commander.option('-d --debug', 'debug logging');
commander.option('-v --verbose', 'verbose logging');
commander.action((cmd, options) => {
  try {
    isAction = true;
    return action({ action: cmd, options }).catch(err =>
      handleError(err, { kill: true })
    );
  } catch (err) {
    return handleError(err, { kill: true });
  }
});
commander.parse(process.argv);

if (!isAction) {
  handleError(new Err('action not specified', 400), { kill: true });
}
