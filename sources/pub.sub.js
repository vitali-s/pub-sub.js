;(function ($) {

    // Events storage
    var observer = {};

    // Publish specific event: $.publish($.events.name, parameter1, parameter2, parameter3)
    $.publish = function (event) {
        if (arguments.length == 0) {
            throw new Error("Fail to publish event, event is not specified.");
        }

        var args = [];
        
        // remove first argument to pass arguments to subscribers
        for (var index = 1; index < arguments.length; index++) {
            args[index - 1] = arguments[index];
        }
        
        if (!observer[event]) {
            observer[event] = [];
        }

        var events = observer[event].slice(0); // copy
        $.each(events, function() {
            var context = this;
            
            if (this.context) {
                context = this.context;
            }
            
            this.apply(context, args);
        });
    };

    // Subscribe for event without context: $.subscribe($.events.name, function() {})
    // Subscribe for event with context: $.subscribe($.events.name, functionContext ,function() {})
    $.subscribe = function (event, context, callback) {
        if (arguments.length < 2) {
            throw new Error("Fail to subscribe for event, event or/and callback is not specified.");
        }
        
        if (!observer[event]) {
            observer[event] = [];
        }

        if (arguments.length == 2) {
            callback = arguments[1];
        }
        
        $.each(observer[event], function(index) {
            if (this == callback) {
                observer[event].splice(index, 1);
            }
        });
        
        if (arguments.length == 3) {
            callback.context = context;
        }

        observer[event].push(callback);
    };

    $.single = function (event, context, callback) {
        $.unsubscribe(event);
        $.subscribe.apply(this, arguments);
    };
    
    $.resubscribe = function (event, context, callback) {
        $.unsubscribe(event, callback);
        $.subscribe.apply(this, arguments);
    };

    // Unsubscribe for event: $.unsubscribe($.events.name, function() {})
    // Unsubscribe for event: $.unsubscribe(function() {})
    $.unsubscribe = function (event, callback) {
        if (arguments.length < 1) {
            throw new Error("Fail to unsubscribe for event, event or/and callback is not specified.");
        }

        var args = arguments;

        if (arguments.length == 1) {
            if (typeof args[0] === "string") {
                observer[args[0]] = [];
            }
            else {
                $.each(observer, function() {
                    var event = this;
                    $.each(event, function(index) {
                        if (this == args[0]) {
                            event.splice(index, 1);
                        }
                    });
                });
            }
        }
        else {
            var events = (observer[event] || []);
            
            $.each(events, function(index) {
                if (this == callback) {
                    events.splice(index, 1);
                }
            });
        }
    };

} (jQuery));