
cancel_timer = null

function toggle_led() {
    if (cancel_timer) Timer.clear(cancel_timer)
    const status = Shelly.getComponentStatus("Light:1");
    if (status.output) led_off()
    else led_on()
    return "Ok"
}

function led_on() {
    Shelly.call("Light.set", { id: 0, on: true });
    Shelly.call("Light.set", { id: 1, on: true });
    Shelly.call("Light.set", { id: 2, on: true });
    Shelly.call("Light.set", { id: 3, on: true });
}

function led_off() {
    Shelly.call("Light.set", { id: 1, on: false });
    cancel_timer = Timer.set(
        2 * 60 * 1000,
        false,
        led_off2       
    )
}

function led_off2() {
    Shelly.call("Light.set", { id: 3, on: false });
    cancel_timer = Timer.set(
        50 * 60 * 1000,
        false,
        led_off_night        
    )
}

function led_off_night() {
    Shelly.call("Light.set", { id: 0, on: false });
    Shelly.call("Light.set", { id: 2, on: false });
}