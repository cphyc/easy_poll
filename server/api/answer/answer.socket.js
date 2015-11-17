/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Answer = require('./answer.model');

exports.register = function(socket) {
  Answer.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Answer.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('answer:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('answer:remove', doc);
}