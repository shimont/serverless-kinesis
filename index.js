'use strict';
/**
 * Example lambda function which uses the asyncronous deaggregation
 * interface to process Kinesis Records from the Event Source
 */

var deagg = require('aws-kinesis-agg/kpl-deagg');
var async = require('async');
require('constants');
var computeChecksums = true;

var ok = 'OK';
var error = 'ERROR';

/** function which closes the context correctly based on status and message */
var finish = function(event, context, status, message) {

  console.log("Processing Complete");

	// log the event if we've failed
	if (status !== ok) {
		if (message) {
			console.log("Error in finish function: " + message);
		}

		// ensure that Lambda doesn't checkpoint to kinesis
		context.done(status, JSON.stringify(message));
	} else {
		context.done(null, message);
	}
};

/** function which handles cases where the input message is malformed */
var handleNoProcess = function(event, context, callback) {
	var noProcessReason;

	if (!event.records || event.records.length === 0) {
    console.log('Event contains no Data')
	}

	if (noProcessReason) {
		finish(event, context, error, noProcessReason);
	} else {
		callback();
	}
};

exports.handler = function(event, context) {
  console.log("Processing Aggregated Messages using aws-kinesis-agg(async)");

	handleNoProcess(event, context, function() {
		// process all records in parallel
		var realRecords = [];

		console.log("Processing " + event.records.length + " Kinesis Input Records");

		async.map(event.records, function(record, asyncCallback) {
			// use the async deaggregate interface. the per-record callback
			// appends the records to an array, and the finally callback calls
			// the async callback to mark the kinesis record as completed within
			// async.js
			deagg.deaggregate(record, computeChecksums, function(err, userRecord) {
				if (err) {
					console.log("Error on Record: " + err);
					asyncCallback(err);
				} else {
					var recordData = new Buffer(userRecord.data, 'base64');

					console.log("Per Record Callback Invoked with Record: " + JSON.stringify(userRecord) + " " + recordData.toString('ascii'));
          console.log(recordData.toString('ascii'))
					realRecords.push(userRecord);
					
					// you can do something else useful with each kinesis user record here
				}
			}, function(err) {
				console.log('Error in deaggregate callback' + err);
				asyncCallback(err);
			});
		}, function(err, results) {
      console.log("Kinesis Record Processing Completed");
      console.log("Processed " + realRecords.length + " Kinesis User Records");

			if (err) {
				finish(event, context, error, err);
			} else {
				finish(event, context, ok, "Success");
			}
		});
	});
};