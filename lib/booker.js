var moment = require('moment');
var Q = require('q');
var _ = require('lodash');
var async = require('async');
var request = require('request');
var Horseman = require('node-horseman');
var phantomjs = require('phantomjs');
var config = require('../config');
var horseman;
var SCHEDULE = {};

function Booker(schedule) {
  SCHEDULE = schedule;
}

Booker.prototype.bookClasses = function() {
  horseman = new Horseman({phantomPath: phantomjs.path}); 
  horseman
    .log('Booking classes...')
    .then(login)
    .then(addClasses)
    .finally(function(){
      horseman.close();
    });
};

function login() {
  return horseman
    .log(`Logging in...`)
    .open('https://gymbox.legendonlineservices.co.uk/enterprise/account/Login')
    .type('#login_Email', config.email)
    .type('#login_Password', config.password)
    .click('#login')
    .waitForNextPage();
}

function addClasses() {
  var tomorrow = moment().add(1, 'days').format('dddd');
  var deferred = Q.defer();
  if (tomorrow in SCHEDULE) {
    const gymSchedules = SCHEDULE[tomorrow];
    const gymNames = Object.keys(gymSchedules);
    _.each(gymNames, (gymName) => {
      const gymId = config.gyms[gymName];
      const scheduledClasses = gymSchedules[gymName];
      return horseman
        .open(`https://gymbox.legendonlineservices.co.uk/enterprise/mobile/getdaytimetable?facilityId=${gymId}&daysAhead=1`)
        .html('pre')
        .then(function(response) {
          var classes = [];
          var result = JSON.parse(response);
          _.each(scheduledClasses, function(value) {
            var find = _.find(result, value);
            if (find) {
              classes.push(find);
            }
          });
 
          async.each(classes, bookClass, function(err){
            horseman
               .log('Bookings completed  ' + classes.length)
               .then(checkout)
               .then(deferred.resolve);
          });
        });
    });
  }
  return deferred.promise;
}


function bookClass(classItem, callback) {
  horseman
    .log('Booking ' + classItem.Name + ' @ ' + classItem.StartTime + ' in ' + classItem.Facility)
    .log('Currently available slots: ' + classItem.RemainingSlots)
    .open('https://gymbox.legendonlineservices.co.uk/enterprise/bookingscentre/addbooking?booking=' + classItem.Id)
    .html('pre')
    .then(callback);
}

function checkout() {
  return horseman
    .log(`Checking out...`)
    .open('https://gymbox.legendonlineservices.co.uk/enterprise/Basket/')
    .click('#btnPayNow')
    .waitForNextPage()
    .html()
}

module.exports = Booker;
