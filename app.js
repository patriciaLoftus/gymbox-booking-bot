const cron = require('node-cron');
const moment = require('moment');
const momentTz = require('moment-timezone');
var config = require('./config');
var Booker = require('./lib/booker');
var booker = new Booker(config.schedule);

const run = () => {
  console.log('\n');
  console.log('_____________________________________________');
  console.log(`Running booking at ${moment().format()}`);
  booker.bookClasses();
}

const getTimezonedhour = () => {
  const machineHour = momentTz.tz(momentTz.tz.guess()).hour();
  const BSTHour = momentTz.tz('Europe/London').hour();
  return 7 + (machineHour - BSTHour);
}

const cronScheduel = `0 ${getTimezonedhour()} * * *`;
console.log(`Cron scheduled for 0${getTimezonedhour()}:00:00`);
cron.schedule(cronScheduel, () => {
  run();
});