
function toggle_led() {
    console.log("Handling toggle")
    Shelly.call("light.GetStatus", { id: 0 }, function (res, err, msg) {
        console.log("got status")
        if (res.output === true) {
            led_off()
        } else {
            led_on()
        }
    });    
    return "Ok"
}

function led_on() {
    console.log("Light is OFF, start.");
    Shelly.call("Light.set", { id: 0, on: true });
    Shelly.call("Light.set", { id: 1, on: true });
    Shelly.call("Light.set", { id: 2, on: true });
    Shelly.call("Light.set", { id: 3, on: true });
    console.log("Light is OFF, turning it on.");
}

function led_off() {
    console.log("Light is ON, start.");
    Shelly.call("Light.set", { id: 0, on: false });
    Shelly.call("Light.set", { id: 1, on: false });
    Shelly.call("Light.set", { id: 2, on: false });
    Shelly.call("Light.set", { id: 3, on: false });
    console.log("Light is ON, turning it off.");
}