// Scripts for piso.

Shelly.addEventHandler(function (event) {
  if (event.name === "input"  && event.id === 0) {
    // Persianas
    print("hmmmm ", event.id);
  }
  if (event.name === "input"  && event.id === 1) {
    // Persianas
    print("PERSIANAS ", event.id);
  }
  if (event.name === "input"  && event.id === 2) {
    // Luz tipo
    print("Luz tipo ", event.id);
  }
  if (event.name === "input"  && event.id === 3) {
    // Salir piso
    print("Salir piso ", event.id);
  }
});
