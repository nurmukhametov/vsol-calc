browser.runtime.onMessage.addListener(request => {
  try {
    debug_log_calc("Got message from the background script");
    debug_log_calc(request);

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
  } catch (e) {
    debug_log_calc(e);
    return debug_log_calc_v;
  }
});

