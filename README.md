#Application Service Bus

```
    npm i app-service-bus
```


```
    const bus = require('app-service-bus')();
    
    bus.subscribe('event.*', (key, content) => {
      console.log(key, content);
    });
    
    setInterval(() => {
      bus.publish('event.user-added', { uid: 'foo' });
    }, 5000);
```

## Options

**const session = require('app-service-bus')([uri]);**

| Property | Description                                                               | Default            |
|----------|---------------------------------------------------------------------------|--------------------|
| uri      | Define uri where RabbitMQ server is running.                              | "amqp://localhost" |   
|          | Example: amqp://username:password@rabbitmq.service.consul:5672            |                    |   

## Tests
To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm i
$ npm test
```