import _ from 'lodash';
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs-extra';
import path from 'path';
import { mapSeries } from 'bluebird';
import npm from '../npm';

const log = console;

export default async function trace() {
  const moduleVersionNames = _.filter(
    _.uniq(
      _.map((await npm('ls')).split('\n'), line => {
        return line.replace(/^[^\w@]*/, '').split(' ')?.[0];
      })
    ),
    line => line.indexOf('@') >= 0
  );
  const moduleNames = _.sortBy(
    _.uniq(
      _.map(moduleVersionNames, moduleVersionName =>
        moduleVersionName.replace(/@[^@]*$/, '')
      )
    )
  );
  let modules = {};
  if (fs.existsSync(path.resolve(process.cwd(), 'tbccache.json'))) {
    modules = fs.readJsonSync(path.resolve(process.cwd(), 'tbccache.json'));
  }
  await mapSeries(moduleNames, async moduleName => {
    if (_.includes(_.keys(modules), moduleName)) {
      console.log(moduleName);
      return modules;
    }
    const res = await axios.get(`https://www.npmjs.com/package/${moduleName}`);
    const $ = cheerio.load(res.data);
    const lastPublish = $('time').html();
    log.info(`${moduleName}: ${lastPublish}`);
    modules[moduleName] = {
      lastPublish
    };
    fs.writeJsonSync(path.resolve(process.cwd(), 'tbccache.json'), modules);
    return modules;
  });
}
