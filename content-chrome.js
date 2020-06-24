browser.runtime.onMessage.addListener(request => {
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

  window.postMessage({ type: "FROM_SCRIPT" }, "*");
});

function _FindPlayers(player_id) {
  var left_id = window.wrappedJSObject.find_player_data[player_id];
  return left_id;
};

window.addEventListener("message", function(event) { 
  //We only accept messages from ourselves
  if (event.source != window) 
    return;
  if (event.data.type && (event.data.type == "FROM_PAGE")) { 
    window.wrappedJSObject = event.data;
    window.wrappedJSObject.FindPlayers = _FindPlayers;

    calc_strength().then(response => {
      browser.runtime.sendMessage(response);
    });
  } 
}, false);

;(function() {
  function script() {
    // Code injected to web page context which sends to content script data
    window.addEventListener("message", function(event) {
      // We only accept messages from ourselves
      if (event.source != window)
        return;
    
      if (event.data.type && (event.data.type == "FROM_SCRIPT")) {
        var _obj_pos = Array.apply(null, Array(obj_pos.length));
        for (var i = 0; i < obj_pos.length; i++) {
          if (obj_pos[i]) {
            _obj_pos[i] = { 
              "options": Array.apply(null, Array(obj_pos[i].options.length))
            };
            for (var j = 0; j < obj_pos[i].options.length; j++) {
              _obj_pos[i].options[j] = {
                "value": obj_pos[i].options[j].value,
                "className": obj_pos[i].options[j].className,
              };
            }
          }
        }
        var _find_player_data = {};
        for (var i = 0; i < plr_id.length; i++) {
          _find_player_data[plr_id[i]] = FindPlayers(plr_id[i]);
        }
        var msg = {
          "type": "FROM_PAGE",
          "combo_plr": combo_plr,
          "plr_cm": plr_cm,
          "plr_cd": plr_cd,
          "plr_cf": plr_cf,
          "plr_st": plr_st,
          "plr_fr": plr_fr,
          "plr_ld": plr_ld,
          "plr_lb": plr_lb,
          "plr_rd": plr_rd,
          "plr_rb": plr_rb,
          "plr_lm": plr_lm,
          "plr_rm": plr_rm,
          "plr_dm": plr_dm,
          "plr_am": plr_am,
          "plr_lw": plr_lw,
          "plr_rw": plr_rw,
          "plr_lf": plr_lf,
          "plr_rf": plr_rf,
          "plr_sw": plr_sw,
          "plr_sf": plr_sf,
          "order_pos": order_pos,
          "plr_sp1_core": plr_sp1_core,
          "plr_sp2_core": plr_sp2_core,
          "plr_sp3_core": plr_sp3_core,
          "plr_sp4_core": plr_sp4_core,
          "plr_sp1_level": plr_sp1_level,
          "plr_sp2_level": plr_sp2_level,
          "plr_sp3_level": plr_sp3_level,
          "plr_sp4_level": plr_sp4_level,
          "style_index": style_index,
          "pos_bonuses": pos_bonuses,
          "super_bonus": super_bonus,
          "rest_bonus": rest_bonus,
          "plr_id": plr_id,
          "plr_styles": plr_styles,
          "plr_nat": plr_nat,
          "plr_str": plr_str,
          "plr_styles": plr_styles,
          "plr_names": plr_names,
          "plrdat": plrdat,
          "curr": curr,
          // cache of function request
          "find_player_data": _find_player_data,
          // array of selects
          "obj_pos": _obj_pos,
          // value
          "obj_captain": { "value": obj_captain.value },
          "obj_morale": { "value": obj_morale.value },
          "obj_gamestyle": { "value": obj_gamestyle.value },
          // innerText
          "obj_syb": { "innerText": obj_syb.innerText },
          "obj_kibonus": { "innerText": obj_kibonus.innerText },
          "obj_DLB": { "innerText": obj_DLB.innerText },
          "obj_MLB": { "innerText": obj_MLB.innerText },
          "obj_FLB": { "innerText": obj_FLB.innerText },
        };
        window.postMessage(msg, "*");
      }
    }, false);
  }

  function inject(fn) {
    const script = document.createElement('script')
    script.text = `(${fn.toString()})();`
    document.documentElement.appendChild(script)
  }

  inject(script)
})()
