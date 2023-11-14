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
        if (st.state == 'stop') {
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



let cur_cycle = 0;
let led_cycles = [["40", "50"], ["100", "100"], ["1", "20"]];

function led_intensity(loc) {
  let level = led_cycles[cur_cycle];
  cur_cycle++;
  if (cur_cycle >= led_cycles.length) {
    cur_cycle = 0
  }
  let base0 = CONFIG.leds_ip[loc] + '/white/';
  let cmd = "?turn=on&brightness=";

  execute(base0 + "0" + cmd + level[0]);
  execute(base0 + "1" + cmd + level[1]);
};

function ledPctSalon() {
  led_intensity(0);
}

function ledPctBedroom() {
  led_intensity(1);
}










function long_push_cancel() {
  long_push_active = 0;
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

let long_push_active = 0;

Shelly.addEventHandler(
  function (event, user_data) {
    if (event.info.event === "single_push") CONFIG.action_push[location][event.id]();
    if (event.info.event === "long_push") CONFIG.action_long_push[location][event.id]();
    if (event.info.event === "btn_up" && long_push_active !== 0) long_push_cancel();
  },
);


let CONFIG = {
  base_ip: "http://192.168.20.",
  blinds_ip: ["115", "113", "105"],
  leds_ip: ["117", "107"],
  light_ip: ["104", "108"],

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

  blinds_stop: ["0", "40", "0"],
};
