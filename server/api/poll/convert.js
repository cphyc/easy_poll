var stringify = require('csv-stringify');
var unoconv = require('unoconv2');
var Q = require('q');
var uid = require('uid');
var path = require('path');
var config = require('../../config/environment');
var fs = require('fs');

var saveCsv = function(data) {
  var deferred = Q.defer();
  stringify(data, function(err, output) {
    var fileName = path.resolve(config.root, '.tmp', uid() + '.csv');
    fs.writeFile(fileName, output, function(err) {
      if (err) {
        console.log(err);
        deferred.reject(err);
      }

      deferred.resolve(fileName);
    });
  });

  return deferred.promise;
};

var convertToXls = function(csvPath) {
  var deferred = Q.defer();

  var fileName = path.resolve(config.root, '.tmp', uid() + '.xls');

  unoconv.convert(csvPath, 'xls', function(err, xlsFile) {
    if (err) {
      console.log(err);
      deferred.reject(err);
    }

    fs.writeFile(fileName, xlsFile, function(err) {
      if (err) {
        console.log(err);
        deferred.reject(err);
      }
      deferred.resolve(fileName);
    });
  });

  return deferred.promise;
}

module.exports.asXls = function(data) {
  var deferred = Q.defer();
  saveCsv(data).then(function(filename) {

    return convertToXls(filename).then(function(res) {
      deferred.resolve(res);
    }, function(err) {
      deferred.reject(err);
    });
  });

  return deferred.promise;
};

module.exports.asCsv = function(data) {
  var deferred = Q.defer();
  saveCsv(data).then(function(filename) {

    deferred.resolve(filename);
  }, function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
};
