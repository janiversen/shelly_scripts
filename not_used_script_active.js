// script_piso: Configure in each I4 -->
// 0 = Salon,   main door
// 1 = Salon,   bedroom door
// 2 = Bedroom, bedroom door
// 3 = Bedroom, bed belen
// 4 = Bedroom, bed jan
let location = 0;



function reserve() {
};



function lightBed() {
  execute(CONFIG.light_ip[1] + '/relay/0?turn=toggle');
}

function lightRoof() {
  execute(CONFIG.light_ip[0] + '/relay/0?turn=toggle');
}



function ledSalon() {
  execute(CONFIG.leds_ip[0] + '/white/0?turn=toggle');
  execute(CONFIG.leds_ip[0] + '/white/1?turn=toggle');
}

function ledBedroom() {
  execute(CONFIG.leds_ip[1] + '/white/0?turn=toggle');
  execute(CONFIG.leds_ip[1] + '/white/1?turn=toggle');
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


function led_steps(ud) {
  let level = CONFIG.led_cycles[ud[1]];
  let loc = CONFIG.leds_ip[ud[0]]
  execute(loc + '/white/0?turn=on&brightness=' + level[0]);
  execute(loc + '/white/1?turn=on&brightness=' + level[1]);
  ud[1]++;
  if (ud[1] >= CONFIG.led_cycles.length) {
    ud[1] = 0
  }
}

function led_intensity(loc) {
  let cur_cycle = 0;
  led_steps([loc, cur_cycle])
  pushTimer = Timer.set(
    CONFIG.timer_step,
    true,
    led_steps,
    [loc, cur_cycle]
  );
}

function ledPctSalon() {
  led_intensity(0);
}

function ledPctBedroom() {
  led_intensity(1);
}



function execute(command) {
  Shelly.call(
      "http.get", {url: CONFIG.base_ip + command},
      function (response, error_code, error_message, ud) {},
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


let pushTimer = null;
let CONFIG = {
  base_ip: "http://192.168.20.",
  blinds_ip: ["115", "113", "105"],
  leds_ip: ["117", "107"],
  light_ip: ["104", "108"],

  timer_step: 1000,

  // Keypad <-> Event id:
  // +---+---+
  // | 3 | 2 |
  // +---+---+
  // | 1 | 0 |
  // +---+---+

  action_push: [
    [reserve,    reserve,    blinds,     ledSalon],    // Standard
    [reserve,    reserve,    ledSalon,   blinds],      // Left -> Right
    [lightRoof,  lightBed,   blinds,     ledBedroom],  // Standard
    [blinds,     ledBedroom, lightRoof,  lightBed],   // Left -> Right, Up -> Down
    [lightBed,   lightRoof,  ledBedroom, blinds],      // Left -> Right
  ],
  action_long_push: [
    [reserve, reserve,       reserve,       ledPctSalon],    // Standard
    [reserve, reserve,       ledPctSalon,   reserve],        // Left -> Right
    [reserve, reserve,       reserve,       ledPctBedroom],  // Standard
    [reserve, ledPctBedroom, reserve,       reserve],        // Left -> Right, Up -> Down
    [reserve, reserve,       ledPctBedroom, reserve],        // Left -> Right
  ],

  blinds_stop: ["0", "55", "20"],
  led_cycles: [["40", "50"], ["100", "100"], ["1", "20"]],
};
