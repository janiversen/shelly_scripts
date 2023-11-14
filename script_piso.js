// script_piso: Configure in each I4 -->
// 0 = Salon,   main door
// 1 = Salon,   bedroom door
// 2 = Bedroom, bedroom door
// 3 = Bedroom, bed belen
// 4 = Bedroom, bed jan
let location = 1;








let cur_cycle = 0;
function led_intensity(loc) {
  let level = CONFIG.led_cycles[cur_cycle];
  cur_cycle++;
  if (cur_cycle >= CONFIG.led_cycles.length) {
    cur_cycle = 0
  }
  let base0 = CONFIG.leds_ip[loc] + '/white/';
  let cmd = "?turn=on&brightness=";

  execute(base0, "0" + cmd + level[0]);
  execute(base0, "1" + cmd + level[1]);
};
function ledPctSalon() {
  led_intensity(0);
}
function ledPctBedroom() {
  led_intensity(1);
}


function ledSalon() {
  let base0 = CONFIG.leds_ip[0] + '/white/';
  let cmd = "?turn=toggle";
  execute(base0, "0" + cmd);
  execute(base0, "1" + cmd);

}
function ledBedroom() {
  let base0 = CONFIG.leds_ip[1] + '/white/';
  let cmd = "?turn=toggle";
  execute(base0, "0" + cmd);
  execute(base0, "1" + cmd);
}



function lightBed() {
  let base0 = light_ip[1] + '/relay/0';
  execute(base0, "?turn=toggle");
}

function lightRoof() {
  let base0 = light_ip[0] + '/relay/0';
  execute(base0, "?turn=toggle");
}



function blinds() {
  let base0 = '/roller/0?go=';
  Shelly.call(
    "http.get", {
      url: CONFIG.base_ip + CONFIG.blinds_ip[0] + base0 + "stop"
    },
    function (res, error_code, error_message, base0) {
      if (res.code === 200) {
        let st = JSON.parse(res.body);
        if (st.current_pos > 60) {
          let cmd = base0 + "to_pos&roller_pos=" + CONFIG.blinds_partial;
          execute(CONFIG.blinds_ip[0], base0 + "close");
          execute(CONFIG.blinds_ip[1], cmd);
          execute(CONFIG.blinds_ip[2], cmd);
        } else {
          let cmd = base0 + "open";
          execute(CONFIG.blinds_ip[0], cmd);
          execute(CONFIG.blinds_ip[1], cmd);
          execute(CONFIG.blinds_ip[2], cmd);
        }
      }
    },
    base0
  );
};



function reserve() {
};


function long_push_cancel() {
  long_push_active = 0;
}

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
  led_cycles: [["40", "50"], ["100", "100"], ["1", "20"]],
};
