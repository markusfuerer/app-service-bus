#Application Service Bus

```
    npm i app-service-bus
```


```
    const AppServiceBus = require('app-service-bus');
    const bus = new AppServiceBus();
    
    bus.subscribe('event.*', (key, content) => {
      console.log(key, content);
    });
    
    setInterval(function () {
      bus.publish('event.user-added', { uid: 'foo' });
    }, 5000);
```
