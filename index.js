'use strict';

class AppServiceBus {
	constructor(host) {
		const amqp = require('amqplib');

		this.type = 'topic';
		this.exchange = 'events';
		this.conn = amqp.connect('amqp://' + (host || 'localhost')).catch(console.error);
	}

	publish(key, message) {
		let self = this;
		message = JSON.stringify(message || {});

		if (this.channel) {
			this.channel.publish(this.exchange, key, new Buffer(message));
		}
		else {
			this.conn.then(function (conn) {
				conn.createChannel().then(function (ch) {
					ch.assertExchange(self.exchange, self.type, { durable: false });
					ch.publish(self.exchange, key, new Buffer(message));
					self.channel = ch;
				});
			});
		}
	}

	subscribe(key, callback) {
		let self = this;

		function onMessage(msg) {
			let content = JSON.parse(msg.content.toString());
			callback(msg.fields.routingKey, content);
		}

		this.conn.then(function (conn) {
			conn.createChannel().then(function (ch) {
				ch.assertExchange(self.exchange, self.type, { durable: false });
				ch.assertQueue('', { exclusive: true })
					.then(function (qok) {
						return ch.bindQueue(qok.queue, self.exchange, key).then(function () {
							return qok.queue;
						});
					})
					.then(function (queue) {
						return ch.consume(queue, onMessage);
					});
			});
		});
	}
}

module.exports = AppServiceBus;