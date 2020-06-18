browser.runtime.onMessage.addListener(request => {
  console.log("Message from the background script:");
  console.log(request.greeting);

  forecast = request.forecast;
  temperature = request.temperature;
  collision = request.collision ? COLLISION_WIN : COLLISION_LOSE;
  default_school = "sunny"; // or sunny
  spectators_percent = request.spectators; // -1 is away
  defense_type_result = request.defense ? DEFENSE_WIN : DEFENSE_LOOSE;
  csv_save = request.gencsv;

  window.calc_args = {
    forecast: forecast,
    temperature: temperature,
    collision: collision,
    default_school: default_school,
    spectators_percent: spectators_percent,
    defense_type_result: defense_type_result,
    csv_save: csv_save,
  };

  return calc_strength();
});

