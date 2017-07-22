'use strict';

class AppServiceBus {
	constructor(host) {
		const amqp = require('amqplib');

		this.type = 'topic';
		this.exchange = 'events';
		this.conn = amqp.connect(host || 'amqp://localhost').catch(console.error);
	}

	publish(key, message) {
		message = JSON.stringify(message || {});

		if (this.channel) {
			return this.channel.publish(this.exchange, key, new Buffer(message));
		}
		else {
			return this.conn.then(conn => {
				return conn.createChannel().then(channel => {
					this.channel = channel;
					channel.assertExchange(this.exchange, this.type, { durable: false });
					return channel.publish(this.exchange, key, new Buffer(message));
				});
			});
		}
	}

	subscribe(key, callback) {
		function onMessage(msg) {
			let content = JSON.parse(msg.content.toString());
			callback(msg.fields.routingKey, content);
		}

		return this.conn.then(conn => {
			return conn.createChannel().then(channel => {
				channel.assertExchange(this.exchange, this.type, { durable: false });
				return channel.assertQueue('', { exclusive: true })
					.then(qok => {
						return channel.bindQueue(qok.queue, this.exchange, key).then(() => {
							return qok.queue;
						});
					})
					.then(queue => {
						return channel.consume(queue, onMessage);
					});
			});
		});
	}
}

module.exports = (host) => {
    return new AppServiceBus(host);
};