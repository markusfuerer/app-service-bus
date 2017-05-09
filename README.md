#Application Service Bus




    var bus = require('app-service-bus');  
    
    bus.subscribe('event.*', (key, content) => {
      console.log(key, content);
    });
    
    setInterval(function () {
      bus.publish('event.user-added', { uid: 'foo' });
    }, 5000);
