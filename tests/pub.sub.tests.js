///<reference path="~/Scripts/jquery-1.7.2.js"/>
///<reference path="~/Scripts/Modules/module.communication.js"/>

module("module.communication");

test("GIVEN an event WHEN an event is published without name THEN exception is thrown", function () {

    raises(function () {
        $.publish();
    }, "Exception is thrown");
});

test("GIVEN an event WHEN subscribe for event without event name THEN exception is thrown", function () {

    raises(function () {
        $.subscribe();
    }, "Exception is thrown");
});

test("GIVEN an event WHEN subscribe for event without callback THEN exception is thrown", function () {

    raises(function () {
        $.subscribe("event");
    }, "Exception is thrown");
});

test("GIVEN an event WHEN unsubscribe for event without event name THEN exception is thrown", function () {

    raises(function () {
        $.ubsubscribe();
    }, "Exception is thrown");
});

test("GIVEN function is subscribed for event WHEN an event is published THEN function is called", function () {

    var state;

    $.subscribe("event", function () { state = "changed"; });

    $.publish("event");

    ok(state == "changed", "Function is called");

});

test("GIVEN two functions are subscribed for event WHEN an event is published THEN functions are called", function () {

    var state, state1;

    $.subscribe("event", function () { state = "changed"; });
    $.subscribe("event", function () { state1 = "changed"; });

    $.publish("event");

    ok(state == "changed", "Function is called");
    ok(state1 == "changed", "Function is called");

});

test("GIVEN function with one is subscribed for event WHEN an event is published THEN parameter is applied", function () {

    var state;

    $.subscribe("event", function (parameter) { state = parameter; });

    $.publish("event", "parameter");

    ok(state == "parameter", "Parameter is applied");
});

test("GIVEN function with multiple parameters is subscribed for event WHEN an event is published THEN parameters are applied", function () {

    var state1, state2, state3, state4;

    $.subscribe("event", function (parameter1, parameter2, parameter3, parameter4) {
        state1 = parameter1;
        state2 = parameter2;
        state3 = parameter3;
        state4 = parameter4;
    });

    $.publish("event", "parameter", 11, new Date(1).toString(), null);

    ok(state1 == "parameter", "First parameter is applied");
    ok(state2 == 11, "Second parameter is applied");
    ok(state3 == new Date(1).toString(), "Third parameter is applied");
    ok(state4 == null, "Fourth parameter is applied");
});

test("GIVEN function is subscribed for event WHEN an event is published two times THEN function is applied two times", function () {

    var state = 0;

    $.subscribe("event", function () { state++; });

    $.publish("event");
    $.publish("event");

    ok(state == 2, "Function is called");
});

test("GIVEN function is ubsubscribed for event WHEN an event is published THEN function is not called", function () {

    var state = 0;

    var func = function() { state++; };

    $.subscribe("event", func);
    $.unsubscribe("event", func);

    $.publish("event");

    ok(state == 0, "Function is not called");
});

test("GIVEN function is ubsubscribed for event WHEN an event is published THEN function is not called", function () {

    var state = 0;

    var func = function () { state++; };

    $.subscribe("event", func);
    $.unsubscribe("event", func);

    $.publish("event");
});

test("GIVEN function is ubsubscribed for event WHEN an event is published THEN function is not called 1", function () {

    var state = 0;

    var func = function () {
        state = 1;
    };

    $.subscribe("event1", func);
    $.subscribe("event2", func);
    $.subscribe("event3", func);

    $.unsubscribe(func);

    $.publish("event1");
    $.publish("event2");
    $.publish("event3");

    ok(state == 0, "Function is not called");
});

test("GIVEN function is subscribed for event by name WHEN an event is published THEN function is called", function () {

    var state;

    var subscriber = {
        subscribe: function () {
            $.subscribe("event", this.result);
        },
        result: function () {
            state = 1;
        }
    };

    subscriber.subscribe();

    $.publish("event");

    ok(state == 1, "Function is called");
});

test("GIVEN function is subscribed for event by name with parameters WHEN an event is published THEN function is called", function () {

    var state1, state2;

    var subscriber = {
        subscribe: function () {
            $.subscribe("event", this.result);
        },
        result: function (parameter1, parameter2) {
            state1 = parameter1;
            state2 = parameter2;
        }
    };

    subscriber.subscribe();

    $.publish("event", "qwe", "asd");

    ok(state1 == "qwe", "Parameter is applied");
    ok(state2 == "asd", "Parameter is applied");
});

test("GIVEN function is subscribed for event with parameters WHEN an event is published THEN function is called with correct context", function () {

    var subscriber = {
        subscribe: function () {
            $.subscribe("event", this, this.result);
        },
        result: function (parameter) {
            this.state = parameter;
        }
    };

    subscriber.subscribe();

    $.publish("event", "qwe");

    ok(subscriber.state == "qwe", "Context is correct");
});

test("GIVEN event without subscriber WHEN function is unsubscribed THEN no error occurs", function () {

    $.unsubscribe(function () { });

    ok(true);
});

test("GIVEN event without subscriber WHEN function is unsubscribed THEN no error occurs", function () {

    $.unsubscribe("randomEvent", function () { });

    ok(true);
});

test("GIVEN function subscribed for event twice WHEN an event published THEN function calls ones", function () {

    var state = 0;

    var handler = function () {
        state++;
    };

    $.subscribe("event", handler);
    $.subscribe("event", handler);

    $.publish("event");

    ok(state == 1, "Function should calls ones");
});

test("unsubscribe, subscribe and publish", function () {

    var raised;
    var func = function () { raised = true; };

    $.subscribe("event", func);
    $.unsubscribe("irrelevantEvent");

    $.publish("event");

    ok(raised === true, "Fail");
});

test("unsubscribe inside of the publish callback", function () {
    var func = function () {
        $.unsubscribe("event", func);
    };

    var func2 = function() {
        $.unsubscribe("event", func2);
    };

    $.subscribe("event", func);
    $.subscribe("event", func2);

    $.publish("event");
});