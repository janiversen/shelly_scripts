
function set_blindsBajo() {
  set_blinds(CONFIG.bajo, CONFIG.bajo.state)
  CONFIG.bajo.state = !CONFIG.bajo.state;
  return true
};

function set_blindsEncima() {
  set_blinds(CONFIG.encima, CONFIG.encima.state)
  CONFIG.encima.state = !CONFIG.encima.state;
  return true
}

function fix_blinds(do_salon, do_down) {
  if (do_salon) updown = CONFIG.encima
  else updown = CONFIG.bajo
  updown.state = do_down
  set_blinds(updown, do_down)
}

function set_blinds(updown, do_down) {
  if (do_down) blinds = updown.down;
  else blinds = updown.up;
  updown.state = do_down
  for (var i = 0; i < 3; i++) {
    Shelly.call(
        "http.get", {url: blinds[i]}, null, null);
  };
}



let CONFIG = {
  bajo: {
    state: false,
    up: [
      "http://192.168.20.105/roller/0?go=open",
      "http://192.168.20.113/roller/0?go=open",
      "http://192.168.20.115/roller/0?go=open"
    ],
    down: [
      "http://192.168.20.105/roller/0?go=close",
      "http://192.168.20.113/roller/0?go=close",
      // "http://192.168.20.113/roller/0?go=to_pos&roller_pos=58",
      "http://192.168.20.115/roller/0?go=close"
    ]
  },
  encima: {
    state: false,
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