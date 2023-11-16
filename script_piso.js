// script_piso: Configure in each I4 -->
// 0 = Salon,   main door
// 1 = Salon,   bedroom door
// 2 = Bedroom, bedroom door
// 3 = Bedroom, bed belen
// 4 = Bedroom, bed jan
let location = 1;



function reserve() {
};


function executeLight(inx) {
  execute(light_ip[inx] + '/relay/0?turn=toggle');
}

function lightBed() {
  executeLight(1);
}

function lightRoof() {
  executeLight(0);
}



function executeLed(inx) {
  let base0 = CONFIG.leds_ip[inx] + '/white/';
  let cmd = "?turn=toggle";
  execute(base0 + "0" + cmd);
  execute(base0 + "1" + cmd);
}

function ledSalon() {
  executeLed(0);
}

function ledBedroom() {
  executeLed(1);
}



function blinds() {
  let base0 = '/roller/0';
  Shelly.call(
    "http.get", {
      url: CONFIG.base_ip + CONFIG.blinds_ip[0] + base0
    },
    function (response) {
      if (response.code === 200) {
        let st = JSON.parse(response.body);
        if (st.state === 'stop') {
          st.state = st.last_direction
        }
        if (st.state === 'close') {
          let cmd = base0 + '?go=open';
          execute(CONFIG.blinds_ip[0] + cmd);
          execute(CONFIG.blinds_ip[1] + cmd);
          execute(CONFIG.blinds_ip[2] + cmd);
        } else {
          let cmd = base0 + '?go=to_pos&roller_pos=';
          execute(CONFIG.blinds_ip[0] + cmd + CONFIG.blinds_stop[0]);
          execute(CONFIG.blinds_ip[1] + cmd + CONFIG.blinds_stop[1]);
          execute(CONFIG.blinds_ip[2] + cmd + CONFIG.blinds_stop[2]);
        }
      }
    }
  );
};


//  let base0 = CONFIG.leds_ip[loc] + '/white/';
//  let cmd = "?turn=on&brightness=";
//  execute(base0 + "0" + cmd + level[0]);
//  execute(base0 + "1" + cmd + level[1]);


function led_regulate_intensity(loc, direction, brightness) {
  print("JAN --> " + brightness[0] + " -- " + brightness[1]);
  if (direction > 0) {
    brightness[0] += 10
    if (brightness[0] > 100) {
      brightness[1] += 10
      brightness[0] = 0
      if (brightness[1] > 100) {
        direction = -1
        brightness[0] = 100
        brightness[1] = 90
      }
    }
  }
  else {
    brightness[0] -= 10
    if (brightness[0] < 0) {
      brightness[1] -= 10
      brightness[0] = 100
      if (brightness[1] < 0) {
        direction = 1
        brightness[0] = 0
        brightness[1] = 0
      }
    }
  }
  print("JAN set --> " + brightness[0] + " -- " + brightness[1]);
}

let pushTimer = null;
let led_direction = 1;
let led_brightness = [0, 0]

function led_intensity(loc, chan) {
  Shelly.call(
    "http.get", {
      url: CONFIG.base_ip + CONFIG.leds_ip[loc] + '/white/' + chan
    },
    function (response) {
      if (response.code === 200) {
        let st = JSON.parse(response.body);
        led_brightness[chan] = st.brightness
      }
      if (chan === 0) led_intensity(loc, 1)
      else {
        Timer.set(
          CONFIG.timer_step,
          true,
          function (loc) {
            print("JAN --> Timer ")
            print("JAN direction " + led_direction)
            print("JAN brightness 0 -> " + led_brightness[0] + "    1 -> " + led_brightness[0])
            led_direction += 1;
          }
        )
      }
    }
  );
};

function ledPctSalon() {
  led_intensity(0, 0);
}

function ledPctBedroom() {
  led_intensity(1, 0);
}



function execute(command) {
  Shelly.call(
      "http.get", {
          url: CONFIG.base_ip + command
      },
      function (response, error_code, error_message, ud) {

      },
      null
  );
};

Shelly.addEventHandler(
  function (event, user_data) {
    if (event.info.event === "single_push") CONFIG.action_push[location][event.id]();
    if (event.info.event === "long_push") CONFIG.action_long_push[location][event.id]();
    if (event.info.event === "btn_up") Timer.clear(pushTimer);
  },
);


let CONFIG = {
  base_ip: "http://192.168.20.",
  blinds_ip: ["115", "113", "105"],
  leds_ip: ["117", "107"],
  light_ip: ["104", "108"],

  timer_step: 500,

  // Keypad <-> Event id:
  // +---+---+
  // | 3 | 2 |
  // +---+---+
  // | 1 | 0 |
  // +---+---+

  action_push: [
    [reserve,    reserve,   blinds,     ledSalon],    // Standard
    [reserve,    reserve,   ledSalon,   blinds],      // Left -> Right
    [lightRoof,  lightBed,  blinds,     ledBedroom],  // Standard
    [ledBedroom, blinds,    lightBed,   lightRoof],   // Left -> Right, Up -> Down
    [lightBed,   lightRoof, ledBedroom, blinds],      // Left -> Right
  ],
  action_long_push: [
    [reserve,       reserve, reserve,       ledPctSalon],    // Standard
    [reserve,       reserve, ledPctSalon,   reserve],        // Left -> Right
    [reserve,       reserve, reserve,       ledPctBedroom],  // Standard
    [ledPctBedroom, reserve, reserve,       reserve],        // Left -> Right, Up -> Down
    [reserve,       reserve, ledPctBedroom, reserve],        // Left -> Right
  ],

  blinds_stop: ["0", "40", "20"],
};
