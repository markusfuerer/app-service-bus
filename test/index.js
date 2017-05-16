'use strict';

const assert = require('assert');
const bus = require('..')();

describe('bus', () => {

    it('subscriber 1', done => {
        bus.subscribe('event.*', (key, content) => {
            assert.equal(key, 'event.user-added');
            assert.equal(content.id, '123');
        }).then((data) => {
            done();
            console.log(data.consumerTag);
        });
    });

    it('send and receive the correct message', done => {

        bus.subscribe('event.*', (key, content) => {
            assert.equal(key, 'event.user-added');
            assert.equal(content.id, '123');

        }).then((data) => {
            done();
            bus.publish('event.user-added', { id: '123' });
            console.log(data.consumerTag);
        });

    });

    it('send message only', done => {

        bus.subscribe('event.*').then(() => {
            bus.publish('login.user-logout', { id: '123' });
        });

        setTimeout(() => {
            done();
        }, 1900);

    });


});
