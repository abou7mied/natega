#!/usr/bin/env node

const request = require("request");
const async = require("async");
const fs = require("fs");
const program = require('commander');

program
  .version('0.1.0')
  .option('-s, --seatNumber <number>', 'Seat Number', parseInt)
  .option('-c, --count <count>', 'Count', parseInt)
  .parse(process.argv);


let fetched = [];
const MAX_ATTEMPTS = 5;

function fetchStudent(SeatNumber, next, attemptNo) {
  request.post('http://natega.youm7.com/Home/GetResultStage1/', {
    form: {
      SeatNumber: SeatNumber
    },
    timeout: 15000,
  }, function (err, response, body) {

    attemptNo = typeof attemptNo === "undefined" ? 0 : attemptNo;

    if (err) {
      let nextAttempt = attemptNo + 1;
      if (nextAttempt > MAX_ATTEMPTS) {
        console.log("Error after %d attempts", attemptNo);
        next();
      } else {
        console.log("Error while fetching: %d, attempt NO: %d", SeatNumber, attemptNo);
        fetchStudent(SeatNumber, next, !attemptNo ? 1 : nextAttempt);
      }
      return;
    }

    let student = {};
    try {
      student = JSON.parse(body)[0];
    } catch (e) {
      console.log("error while parsing");
    }

    if (student)
      fetched.push(student);

    if (student)
      console.log("Fetched: %d, SeatNumber: %d, Name: %s", fetched.length, SeatNumber, student.Name);
    else {
      console.log("No Results for %d", SeatNumber);
    }

    writeFetched(fetched, next);

  });
}

function fetch(from, count) {

  console.log("Total Count: %d", count);

  async.timesLimit(count, 30, function (n, next) {
    let SeatNumber = from + n;
    fetchStudent(SeatNumber, next);
  }, () => {
    writeFetched(fetched);
    console.log("Done!");
  });

}

function writeFetched(json, cb) {
  let data = JSON.stringify(json);
  fs.writeFile("dist/results.js", "var results = " + data, 'utf8', function () {
    if (cb)
      cb();
  });
}

if (program.seatNumber && program.count) {
  fetch(program.seatNumber, program.count);
} else {
  console.log("Please pass seatNumber and count arguments");
}


