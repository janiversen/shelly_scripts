// Scripts for piso.

let CONFIG = {
  location: 0,  // 0 = salon, 1 = salon dormitorio, 2 = dormitorio
  base_ip: "http://192.168.20.",
  blinds: ["132", "135", "129"],
  blinds_partial: "30",
  leds: ["125", "125", "126"],
  led_cycles: [["40", "50"], ["100", "100"], ["1", "20"]],
};
let cur_cycle = 0;

function execute(ip, command) {
    Shelly.call(
        "http.get", {
            url: CONFIG.base_ip + ip + command
        },
        function (response, error_code, error_message, ud) {

        },
        null
    );
};

function blinds_up_down() {
  let base0 = '/roller/0?go=';
  Shelly.call(
    "http.get", {
      url: CONFIG.base_ip + CONFIG.blinds[0] + base0 + "stop"
    },
    function (res, error_code, error_message, base0) {
      if (res.code === 200) {
        let st = JSON.parse(res.body);
        if (st.current_pos > 80) {
          let cmd = base0 + "to_pos&roller_pos=" + CONFIG.blinds_partial;
          execute(CONFIG.blinds[0], base0 + "close");
          execute(CONFIG.blinds[1], cmd);
          execute(CONFIG.blinds[2], cmd);
        } else {
          let cmd = base0 + "open";
          execute(CONFIG.blinds[0], cmd);
          execute(CONFIG.blinds[1], cmd);
          execute(CONFIG.blinds[2], cmd);
        }
      }
    },
    base0
  );
};

function led_intensity() {
  let level = CONFIG.led_cycles[cur_cycle];
  cur_cycle++;
  if (cur_cycle >= CONFIG.led_cycles.length) {
    cur_cycle = 0
  }
  let base0 = CONFIG.leds[CONFIG.location] + '/white/';
  let cmd = "?turn=on&brightness=";

  execute(base0, "0" + cmd + level[0]);
  execute(base0, "1" + cmd + level[1]);
};

function led_onoff() {
  let base0 = CONFIG.leds[CONFIG.location] + '/white/';
  let cmd = "?turn=toggle";
  execute(base0, "0" + cmd);
  execute(base0, "1" + cmd);
};

Shelly.addEventHandler(
  function (event, user_data) {
    if (event.name === "input") {
      if (event.info.event === "single_push") {
        if (event.id === 0) { // our 3
          print("Reserve single 3");
        } else if (event.id === 1) { // our 4
          print("Reserve single 4");
        } if (event.id === 2) { // our 2
          blinds_up_down();
        } if (event.id === 3) { // our 1
          led_onoff();
        }
      }
      else if (event.info.event === "long_push") {
        if (event.id === 0) { // our 3
          print("Reserve long 3");
        } else if (event.id === 1) { // our 4
          print("Reserve long 4");
        } if (event.id === 2) { // our 2
          print("Reserve long 2");
        } if (event.id === 3) { // our 1
          led_intensity();
        }
      }
    }
  },
);
