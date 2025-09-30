
let blindsBajoDown = false
let blindsEncimaDown = false

function set_blindsBajo() {
  set_blinds(CONFIG.bajo, blindsBajoDown)
  blindsBajoDown = !blindsBajoDown;
  return true
};

function set_blindsEncima() {
  set_blinds(CONFIG.encima, blindsEncimaDown)
  blindsEncimaDown = !blindsEncimaDown;
  return true
}

function set_blinds(updown, do_down) {
  if (do_down) blinds = updown.down;
  else blinds = updown.up;
  for (var i = 0; i < 3; i++) {
    Shelly.call(
        "http.get", {url: blinds[i]}, null, null);
  };
}


Shelly.addEventHandler(
  function (event, user_data) {
    if (event["info"]["component"] !== "input:0") return; 
    if (event["info"]["event"] === "single_push") {
      set_blindsBajo();
    }; 
    if (event["info"]["event"] === "long_push") {
      set_blindsEncima();
    }; 
  },
);

let CONFIG = {
  bajo: {
    up: [
      "http://192.168.20.105/roller/0?go=open",
      "http://192.168.20.113/roller/0?go=open",
      "http://192.168.20.115/roller/0?go=open"
    ],
    down: [
      "http://192.168.20.105/roller/0?go=close",
      "http://192.168.20.113/roller/0?go=to_pos&roller_pos=58",
      "http://192.168.20.115/roller/0?go=close"
    ]
  },
  encima: {
    up: [
      "http://192.168.20.133/roller/0?go=open",
      "http://192.168.20.139/roller/0?go=open",
      "http://192.168.20.141/roller/0?go=open"
    ],
    down: [
      "http://192.168.20.133/roller/0?go=close",
      "http://192.168.20.139/roller/0?go=close",
      "http://192.168.20.141/roller/0?go=close"
    ],
  }
};