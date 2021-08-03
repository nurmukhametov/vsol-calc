// log string saved here
var debug_log_calc_v = "";
function debug_log_calc(a) {
  if (a instanceof Error) {
    debug_log_calc_v += a.toString() + "\n";
  } else {
    debug_log_calc_v += JSON.stringify(a) + "\n";
  }
}

function FindPlayers(b) {
  for(var a = 0; a < window.wrappedJSObject.numOfRows; a++)
    if (window.wrappedJSObject.plrdat[a].plr_id == b)
      return a;
  return-1
}

function RS(pos, pid) {
  switch (pos) {
    case "CM": return window.wrappedJSObject.plr_cm[pid]; break;
    case "CD": return window.wrappedJSObject.plr_cd[pid]; break;
    case "CF": return window.wrappedJSObject.plr_cf[pid]; break;
    case "ST": return window.wrappedJSObject.plr_st[pid]; break;
    case "FR": return window.wrappedJSObject.plr_fr[pid]; break;
    case "LD": return window.wrappedJSObject.plr_ld[pid]; break;
    case "LB": return window.wrappedJSObject.plr_lb[pid]; break;
    case "RD": return window.wrappedJSObject.plr_rd[pid]; break;
    case "RB": return window.wrappedJSObject.plr_rb[pid]; break;
    case "LM": return window.wrappedJSObject.plr_lm[pid]; break;
    case "RM": return window.wrappedJSObject.plr_rm[pid]; break;
    case "DM": return window.wrappedJSObject.plr_dm[pid]; break;
    case "AM": return window.wrappedJSObject.plr_am[pid]; break;
    case "LW": return window.wrappedJSObject.plr_lw[pid]; break;
    case "RW": return window.wrappedJSObject.plr_rw[pid]; break;
    case "LF": return window.wrappedJSObject.plr_lf[pid]; break;
    case "RF": return window.wrappedJSObject.plr_rf[pid]; break;
    case "SW": return window.wrappedJSObject.plr_sw[pid]; break;
    default:   return window.wrappedJSObject.plr_sf[pid]; break;
  }
}

function WRS(ns, rs, style_id, forecast, temperature) {
  var t;
  switch (style_id) {
    case 1:
    case 3:
    case 4:
      t = sunny_wf; break;
    case 2:
    case 5:
    case 6:
      t = rainy_wf; break;
    case 0:
      t = default_school == "sunny" ? sunny_wf : rainy_wf; 
      break;
    default:
      console.log("Incorrect style identificator");
      debug_log_calc("Incorrect style identificator");
      break;
  }
  var ws = t[ns][forecast][temperature]
  var weather_factor = ws / ns;
  return rs * weather_factor;
}

// 0 - нормальный, 1 - спартаковский, 2 - бей-беги, 3 - бразильская,
// 4 - тики-така, 5 - катеначчо, 6 - британская
var style_spec_bonuses = {
  'Км': {0: 5, 1: 4,  2: 2,  3: 6,  4: 10, 5: 2,  6: 2},
  'Пк': {0: 5, 1: 10, 2: 2,  3: 4,  4: 6,  5: 2,  6: 2},
  'Д':  {0: 5, 1: 6,  2: 2,  3: 10, 4: 4,  5: 2,  6: 2},
  'Ск': {0: 5, 1: 2,  2: 10, 3: 2,  4: 2,  5: 4,  6: 6},
  'Пд': {0: 5, 1: 2,  2: 6,  3: 2,  4: 2,  5: 10, 6: 4},
  'Г':  {0: 5, 1: 2,  2: 4,  3: 2,  4: 2,  5: 6,  6: 10},
};

function count_gk_specs(s, l) {
  var sw = false;
  for (var i = 0; i < window.wrappedJSObject.order_pos.length; i++) {
    if (window.wrappedJSObject.order_pos[i] == 'SW') {
      sw = true;
      break;
    }
  }
  switch (s) {
    case 'Р':
      return (sw ? 8 : 3) * l;
      break;
    case 'В':
      return (sw ? 3 : 8) * l;
      break;
    default:
      console.log("Incorrect gk spec");
      debug_log_calc("Incorrect style identificator");
      break;
  }
}

function plrBonus(style_id, pid) {
  var b = 0;
  var specs  = [ 
    window.wrappedJSObject.plr_sp1_core[pid], 
    window.wrappedJSObject.plr_sp2_core[pid], 
    window.wrappedJSObject.plr_sp3_core[pid], 
    window.wrappedJSObject.plr_sp4_core[pid] ];
  var levels = [ 
    window.wrappedJSObject.plr_sp1_level[pid], 
    window.wrappedJSObject.plr_sp2_level[pid],
    window.wrappedJSObject.plr_sp3_level[pid], 
    window.wrappedJSObject.plr_sp4_level[pid] ];
  for (var i = 0; i < 4; i++) {
    var sp = specs[i];
    var l  = levels[i];
    switch (sp) {
      case 'Км':
      case 'Пк':
      case 'Д':
      case 'Ск':
      case 'Пд':
      case 'Г':
        b += style_spec_bonuses[sp][style_id] * l;
        break;
      case 'Р':
      case 'В':
        b += count_gk_specs(sp, l);
        break;
      default:
        break;
    }
  }
  return b;
}

function positionBonus(p, id) {
  if (id == 0 || p == '') {
    return 0;
  }
  var options = window.wrappedJSObject.obj_pos[id].options;
  var style_id = window.wrappedJSObject.style_index;
  var pos_b = window.wrappedJSObject.pos_bonuses;
  var b = 0;
  for (var i = 0; i < options.length; i++) {
    if (p == options[i].value) {
      switch (options[i].className) {
        case 'grC':
          return pos_b[style_id][0];
        case 'grB':
          return pos_b[style_id][1];
        case 'gr1':
          return pos_b[style_id][2];
        case 'grE':
          return pos_b[style_id][3];
        case 'gr2':
          return 0;
        default:
          console.log("Incorrect position bonus");
          debug_log_calc("Incorrect style identificator");
          break;
      }
    }
  }
  return b
}

var COLLISION_WIN  = 1;
var COLLISION_LOSE = 2;
var COLLISION_NONE = 0;
var collision_bonuses = {
  // 0 - нормальный
  0: {1: 0, 2: 0, 0: 0},
  // 1 - спартаковский
  1: {1: 38, 2: 0, 0: 0},
  // 2 - бей-беги
  2: {1: 42, 2: 0, 0: 0},
  // 3 - бразильская,
  3: {1: 34, 2: 0, 0: 0},
  // 4 - тики-така
  4: {1: 36, 2: 0, 0: 0},
  // 5 - катеначчо
  5: {1: 44, 2: 0, 0: 0},
  // 6 - британская
  6: {1: 40, 2: 0, 0: 0},
};

function get_home_bonus (percent) {
  if (percent == 100) {
    return 15;
  } else if (percent >= 90 && percent <= 99) {
    return 10;
  } else if (percent >= 80 && percent <= 89) {
    return 5;
  } else if (percent >= 0 && percent <= 80) {
    return 2.5;
  } else if (percent == -1) {
    return 0;
  } else {
    console.log("Incorrect percentage of spectators");
    debug_log_calc("Incorrect percentage of spectators");
    return 0;
  }
}

function get_morale_bonus () {
  switch (window.wrappedJSObject.obj_morale.value) {
    case "0":
      return 0;
    case "1":
      return window.wrappedJSObject.super_bonus;
    case "2":
      return window.wrappedJSObject.rest_bonus;
    default:
      console.log ("Incorrect morale bonus");
      debug_log_calc("Incorrect morale bonus");
      break;
  }
}

var DEFENSE_WIN = 100;
var DEFENSE_LOOSE = -100;

function get_defense_bonus (t, p) {
  if (t == DEFENSE_WIN) {
    switch (p) {
      case "LD":
      case "LB":
      case "RD":
      case "RB":
      case "CD":
      case "SW":
        return 5;
      default:
        return 0;
    }
  }
  return 0;
}

function get_leader_ds (p) {
  var bns;
  switch (p) {
    case "GK":
    case "LD":
    case "LB":
    case "SW":
    case "CD":
    case "RD":
    case "RB":
      bns = window.wrappedJSObject.obj_DLB.innerText; break;
    case "LM":
    case "DM":
    case "CM":
    case "FR":
    case "RM":
      bns = window.wrappedJSObject.obj_MLB.innerText; break;
    case "LW":
    case "LF":
    case "AM":
    case "CF":
    case "ST":
    case "RF":
    case "RW":
      bns = window.wrappedJSObject.obj_FLB.innerText; break;
    default:
      console.log("Incorrect position");
      debug_log_calc("Incorrect position");
      bns = '-'; break;
  }
  if (bns == '-') {
    return 0;
  } else {
    return parseFloat(bns);
  }
}

function get_captain_bonus (age, sp_ka_level) {
  if (sp_ka_level == 4) {
    return 12;
  } else if (sp_ka_level == 3) {
    return 9;
  } else if (sp_ka_level == 2) {
    if (age <= 32) {
      return 6;
    } else if (age >= 33 && age <=34) {
      return {33: 7, 34: 8}[age];
    } else {
      console.log("Incorrect age of sp_ka_level == 2");
      debug_log_calc("Incorrect age of sp_ka_level == 2");
      return 0;
    }
  } else if (sp_ka_level == 1) {
    if (age <= 28) {
      return 2;
    } else if (age >= 29 && age <= 34) {
      return {29: 3, 30: 4, 31: 5, 32: 6, 33: 7, 34: 8}[age];
    } else {
      console.log("Incorrect age of sp_ka_level == 1");
      debug_log_calc("Incorrect age of sp_ka_level == 1");
      return 0;
    }
  } else if (sp_ka_level == 0) {
    return {
      16: -8, 17: -7, 18: -6, 19: -5, 20: -4, 21: -3, 22: -2, 23: -1,
      24: 0, 25: 0, 26: 1, 27: 1,
      28: 2, 29: 3, 30: 4, 31: 5, 32: 6, 33: 7, 34: 8,
    }[age];
  } else {
    console.log ("Incorrect sp_ka_level");
    debug_log_calc ("Incorrect sp_ka_level");
    return 0;
  }
}

function get_captain_ds () {
  var cap_id = parseInt(window.wrappedJSObject.obj_captain.value);
  for (var i = 0; i < window.wrappedJSObject.combo_plr.length; i++) {
    var id = window.wrappedJSObject.combo_plr[i];
    if (id == -1) {
      // TODO! can dummy player be captain?
      continue;
    }
    var pid = window.wrappedJSObject.plr_id[id];
    if (pid == cap_id) {
      var rs = RS(window.wrappedJSObject.order_pos[i], id);
      var level = 0;
      if (window.wrappedJSObject.plr_sp1_core[id] == 'Ка') {
        level = window.wrappedJSObject.plr_sp1_level;
      } else if (window.wrappedJSObject.plr_sp2_core[id] == 'Ка') {
        level = window.wrappedJSObject.plr_sp2_level;
      } else if (window.wrappedJSObject.plr_sp3_core[id] == 'Ка') {
        level = window.wrappedJSObject.plr_sp3_level;
      } else if (window.wrappedJSObject.plr_sp4_core[id] == 'Ка') {
        level = window.wrappedJSObject.plr_sp4_level;
      }
      var plr = FindPlayers(pid);
      var cap_bs = get_captain_bonus(window.wrappedJSObject.plrdat[plr].age, level);
      return rs * cap_bs / 100;
    }
  }
  return 0;
}

function get_gamestyle_ds (rs) {
  if (window.wrappedJSObject.obj_gamestyle.value == 'грубая') {
    var b = rs * 0.05;
    return b < 5 ? 5 : b;
  } else {
    return 0;
  }
}

function get_style_bonus (plr_style) {
  var collision_dict = {
    // player style -> game style -> bonus
    // 1 - спартаковский
    1: {1: 2.5, 2: -1, 3: 0, 4: 0, 5: 0, 6: -1},
    // 2 - бей-беги
    2: {1: -1, 2: 2.5, 3: -1, 4: 0, 5: 0, 6: 0},
    // 3 - бразильская,
    3: {1: 0, 2: -1, 3: 2.5, 4: 0, 5: -1, 6: 0},
    // 4 - тики-така
    4: {1: 0, 2: 0, 3: 0, 4: 2.5, 5: -1, 6: -1},
    // 5 - катеначчо
    5: {1: 0, 2: 0, 3: -1, 4: -1, 5: 2.5, 6: 0},
    // 6 - британская
    6: {1: -1, 2: 0, 3: 0, 4: -1, 5: 0, 6: 2.5},
  };
  if (plr_style == 0) {
    // We actually don't know bonus.
    return 0;
  }
  if (window.wrappedJSObject.style_index == 0) {
    // No style bonus on нормальный style.
    return 0;
  }
  return collision_dict[plr_style][window.wrappedJSObject.style_index];
}

function create_scheme () {
  function inner_def_nbs (n, pos_str) {
    var res = {"GK": []};
    switch (n) {
      case 3:
        l = pos_str.slice(0, 2);
        c = pos_str.slice(2, 4);
        r = pos_str.slice(4, 6);
        res["GK"] = [l, c, r];
        res[l] = [c, "GK"];
        res[c] = [l, "GK", r];
        res[r] = [c, "GK"];
        break;
      case 4:
        l = pos_str.slice(0, 2);
        r = pos_str.slice(6, 8);
        if (pos_str.includes("SW")) {
          res["GK"] = [l, "SW", r];
          res[l] = ["GK", "CD"];
          res[r] = ["GK", "CD"];
          res["SW"] = ["CD", "GK"];
          res["CD"] = [l, "SW", r];
        } else {
          res["GK"] = ["CDl", "CDr"];
          res[l] = ["CDl"];
          res[r] = ["CDr"];
          res["CDl"] = [l, "GK", "CDr"];
          res["CDr"] = [r, "GK", "CDl"];
          if (l == "LD") {
            res["GK"].push(l);
            res[l].push("GK");
          }
          if (r == "RD") {
            res["GK"].push(r);
            res[r].push("GK");
          }
        }
        break;
      case 5:
        l = pos_str.slice(0, 2);
        r = pos_str.slice(8, 10);
        res[l] = ["CDl"];
        res[r] = ["CDr"];
        res["CDl"] = [l];
        res["CDr"] = [r];
        if (pos_str.includes("SW")) {
          res["GK"] = ["SW"];
          res["SW"] = ["GK", "CDl", "CDr"];
          res["CDl"].push("SW");
          res["CDl"].push("CDr");
          res["CDr"].push("SW");
          res["CDr"].push("CDl");
          if (l == "LD") {
            res["GK"].push(l);
            res[l].push("GK");
          }
          if (r == "RD") {
            res["GK"].push(r);
            res[r].push("GK");
          }
        } else {
          res["GK"] = ["CDl", "CDc", "CDr"];
          res["CDl"].push("CDc");
          res["CDl"].push("GK");
          res["CDr"].push("CDc");
          res["CDr"].push("GK");
          res["CDc"] = ["GK", "CDl", "CDr"]
        }
        break;
      default:
        console.log("Wrong defenders number");
        debug_log_calc("Wrong defenders number");
        break;
    }
    return res;
  }
  
  function inner_mid_nbs (n, pos_str) {
    var res = {};
    switch (n) {
      case 2:
        if (pos_str.includes("LM")) {
          res["LM"] = ["RM"];
          res["RM"] = ["LM"];
        } else if (pos_str.includes("FR")) {
          res["CM"] = ["FR"];
          res["FR"] = ["CM"];
        } else if (pos_str == "CMCM") {
          res["CMl"] = ["CMr"];
          res["CMr"] = ["CMl"];
        } else {
          console.log("Incorrect 2 midfielders tactic");
          debug_log_calc("Incorrect 2 midfielders tactic");
          break;
        }
        break;
      case 3:
        l = pos_str.slice(0, 2);
        c = pos_str.slice(2, 4);
        r = pos_str.slice(4, 6);
        if (c == "AM" || c == "FR") {
          res[l] = [];
          res[r] = [];
          res[c] = [];
        } else if (c == "CM" || c == "DM") {
          res[l] = [c];
          res[r] = [c];
          res[c] = [l, r];
        } else {
          console.log("Incorrect 3 midfielders tactic");
          debug_log_calc("Incorrect 3 midfielders tactic");
          break;
        }
        break;
      case 4:
        l = pos_str.slice(0, 2);
        r = pos_str.slice(6, 8);
        mdl = pos_str.slice(2, 6);
        res[l] = [];
        res[r] = [];
        if (mdl == "FRAM") {
          res["AM"] = ["FR"];
          res["FR"] = ["AM"];
        } else if (mdl.includes("AM") || mdl.includes("FR")) {
          a = mdl.slice(0, 2);
          b = mdl.slice(2, 4);
          if (a == "AM" || a == "FR") {
            above = a;
            below = b;
          } else {
            above = b;
            below = a;
          }
          res[l].push(below);
          res[r].push(below);
          res[below] = [l, above, r];
          res[above] = [below];
        } else if (mdl == "CMCM") {
          res[l].push("CMl");
          res[r].push("CMr");
          res["CMl"] = ["CMr"];
          res["CMr"] = ["CMl"];
        } else if (mdl == "DMCM") {
          res[l].push("CM");
          res[r].push("CM");
          res["CM"] = ["DM"];
          res["DM"] = ["CM"];
        } else {
          console.log("Incorrect 4 midfielders tactic");
          debug_log_calc("Incorrect 4 midfielders tactic");
          break;
        }
        break;
      case 5:
        l = pos_str.slice(0, 2);
        r = pos_str.slice(8, 10);
        mdl = pos_str.slice(2, 8);
        res[l] = [];
        res[r] = [];
        if (mdl.includes("AM") && mdl.includes("FR")) {
          m = mdl.replace("AM", "").replace("FR", "");
          res["AM"] = ["FR", m]
          res["FR"] = ["AM", m]
          res[m] = [l, "AM", "FR", r];
          res[l].push(m);
          res[r].push(m);
        } else if (mdl.includes("DMDM")) {
          above = mdl.replace("DMDM", "");
          if (above == "CM") {
            res[l].push("CM");
            res[r].push("CM");
            res["DMl"] = ["CM", "DMr"];
            res["DMr"] = ["CM", "DMl"];
            res["CM"] = [l, "DMl", "DMr", r];
          } else {
            res[l].push("DMl");
            res[r].push("DMr");
            res["DMl"] = [l, above, "DMr"];
            res["DMr"] = ["DMl", above, r];
            res[above] = ["DMl", "DMr"];
          }
        } else if (mdl.includes("DM") && mdl.includes("CM")) {
          if (mdl.includes("AM") || mdl.includes("FR")) {
            above = mdl.replace("DM", "").replace("CM", "");
            res[l].push("CM");
            res[r].push("CM");
            res["CM"] = [l, above, "DM", r];
            res["DM"] = ["CM"];
            res[above] = ["CM"];
          } else {
            rem_dm = mdl.replace("DM", "");
            if (rem_dm == "CMCM") {
              res[l].push("CMl");
              res[r].push("CMr");
              res["DM"] = ["CMl", "CMr"];
              res["CMl"] = [l, "DM", "CMr"];
              res["CMr"] = ["CMl", "DM", r];
            }
          }
        } else if (mdl == "CMCMCM") {
          res[l].push("CMl");
          res["CMl"] = [l, "CMc"];
          res["CMc"] = ["CMl", "CMr"];
          res["CMr"] = ["CMc", r];
          res[r].push("CMl");
        } else if (!mdl.includes("DM") && mdl.includes("CM") &&
            (mdl.includes("AM") || mdl.includes("FR"))) {
          res[l].push("CMl");
          res[r].push("CMr");
          above = mdl.replace("CM", "").replace("CM", "")
          res["CMl"] = [l, above, "CMr"];
          res[above] = ["CMl", "CMr"];
          res["CMr"] = ["CMl", above, r];
        } else {
          console.log("Incorrect 5 midfielders tactic");
          debug_log_calc("Incorrect 5 midfielders tactic");
          break;
        }
        break;
      case 6:
        l = pos_str.slice(0, 2);
        r = pos_str.slice(10, 12);
        mdl = pos_str.slice(2, 10);
        res[l] = [];
        res[r] = [];
        if (mdl == "DMDMFRAM") {
          res[l].push("DMl");
          res[r].push("DMr");
          res["AM"] = ["DMl", "FR", "DMr"];
          res["FR"] = ["DMl", "AM", "DMr"];
          res["DMr"] = [l, "AM", "FR", "DMr"];
          res["DMl"] = [r, "AM", "FR", "DMl"];
        } else if (mdl.includes("DMDM")) {
          if (mdl.includes("CMCM")) {
            res[l].push("CMl");
            res[r].push("CMr");
            res["CMr"] = [l, "DMl", "CMr"];
            res["CMl"] = [r, "DMr", "CMl"];
            res["DMl"] = ["CMl", "DMr"];
            res["DMr"] = ["CMr", "DMl"];
          } else if (mdl.includes("FR") || mdl.includes("AM")) {
            above = mdl.replace("DMDM", "").replace("CM", "");
            res[l].push("CM");
            res[r].push("CM");
            res["CM"] = [l, "DMl", above, "DMr", r];
            res["DMl"] = ["CM", "DMr"];
            res["DMr"] = ["CM", "DMl"];
            res[above] = ["CM"];
          }
        } else if (mdl.includes("AM") && mdl.includes("FR") 
                   && mdl.includes("CM") && mdl.includes("DM")) {
          res[l].push("CM");
          res[r].push("CM");
          res["CM"] = [l, "AM", "DM", "FR", r];
          res["DM"] = ["CM"];
          res["AM"] = ["CM", "FR"];
          res["FR"] = ["AM", "CM"];
        } else if (mdl == "CMCMCM") {
          res[l].push("CMl");
          res[r].push("CMr");
          res["CMl"] = [l, "CMc", "DM"];
          res["CMc"] = ["CMl", "DM", "CMr"];
          res["CMr"] = ["DM", "CMc", r];
          res["DM"] = ["CMl", "CMc", "CMr"];
        } else if ((mdl.includes("AM") && !mdl.includes("FR")) ||
                   (mdl.includes("FR") && !mdl.includes("AM"))) {
          res[l].push("CMl");
          res[r].push("CMr");
          above = mdl.replace("DM", "").replace("CM", "").replace("CM", "");
          res["DM"] = ["CMl", "CMr"];
          res["CMl"] = [l, "DM", above, "CMr"];
          res["CMr"] = ["CMl", above, "DM", r];
          res[above] = ["CMl", "CMr"];
        } else {
          console.log("Incorrect 6 midfielders tactic");
          debug_log_calc("Incorrect 6 midfielders tactic");
          break;
        }
        break;
      default:
        console.log("Wrong midfielders number");
        debug_log_calc("Wrong midfielders number");
        break;
    }
    return res;
  }

  function inner_fwd_nbs (n, pos_str) {
    var res = {};
    switch (n) {
      case 1:
        res[pos_str] = [];
        break;
      case 2:
        if (pos_str == "LFRF" || pos_str == "STCF" || pos_str == "CFST") {
          l = pos_str.slice(0, 2);
          r = pos_str.slice(2, 4);
          res[l] = [r];
          res[r] = [l];
        } else if (pos_str == "CFCF") {
          res["CFl"] = ["CFr"];
          res["CFr"] = ["CFl"];
        } else {
          console.log("Incorrect 2 forwards tactic");
          debug_log_calc("Incorrect 2 forwards tactic");
          break;
        }
        break;
      case 3:
        if (pos_str.includes("ST") && pos_str.includes("CF")) {
          res["CFl"] = ["ST", "CFr"];
          res["ST"] = ["CFl", "CFr"];
          res["CFr"] = ["CFl", "ST"];
        } else if (pos_str == "LFCFRF" || pos_str == "LFSTRF") {
          l = pos_str.slice(0, 2);
          c = pos_str.slice(2, 4);
          r = pos_str.slice(4, 6);
          res[l] = [c];
          res[c] = [l, r];
          res[r] = [c];
        } else if (pos_str == "CFCFCF") {
          res["CFl"] = ["CFc"];
          res["CFc"] = ["CFl", "CFr"];
          res["CFr"] = ["CFc"];
        } else {
          console.log("Incorrect 3 forwards tactic");
          debug_log_calc("Incorrect 3 forwards tactic");
          break;
        }
        break;
      case 4:
        if (pos_str.includes("ST")) {
          res["LF"] = ["ST", "CF"];
          res["ST"] = ["LF", "CF", "RF"];
          res["CF"] = ["LF", "ST", "RF"];
          res["RF"] = ["ST", "CF"];
        } else if (pos_str == "LFCFCFRF") {
          res["LF"] = ["CFl"];
          res["CFl"] = ["LF", "CFr"];
          res["CFr"] = ["CFl", "RF"];
          res["RF"] = ["CFr"];
        } else {
          console.log("Incorrect 4 forwards tactic");
          debug_log_calc("Incorrect 4 forwards tactic");
          break;
        }
        break;
      default:
        console.log("Wrong forwards number");
        debug_log_calc("Wrong forwards number");
        break;
    }
    return res;
  }

  var formation_str = document.getElementById("formation").value;
  var formation = formation_str.split("-");
  var pos_str = window.wrappedJSObject.order_pos.slice(0, 11).join("");
  var def = parseInt(formation[1]);
  var mid = parseInt(formation[2]);
  var fwd = parseInt(formation[3]);

  innd = inner_def_nbs (def, pos_str.slice(2, 2*(def+1)));
  innm = inner_mid_nbs (mid, pos_str.slice(2*(def+1), 2*(def+mid+1)));
  innf = inner_fwd_nbs (fwd, pos_str.slice(2*(def+mid+1)));

  all = Object.assign({}, innd, innm, innf);

  // Add lines between defense and midfielders
  ld = Object.keys(innd).filter(s => s.startsWith("L"))[0];
  rd = Object.keys(innd).filter(s => s.startsWith("R"))[0];
  lm = Object.keys(innm).filter(s => s.startsWith("L"))[0];
  rm = Object.keys(innm).filter(s => s.startsWith("R"))[0];
  if (lm && rm) {
    all[ld].push(lm); all[rd].push(rm); all[lm].push(ld); all[rm].push(rd);
  }
  cds = Object.keys(innd).filter(s => s.startsWith("C"));
  if (formation_str == "1-4-2-4" && lm) {
    if (cds.length == 2) {
      all["CDl"].push(lm); all["CDr"].push(rm);
      all[lm].push("CDl"); all[rm].push("CDr");
    } else {
      console.assert(cds.length == 1, "CDS length 4-2-4");
      all["CD"].push(rm); all["CD"].push(lm);
      all[rm].push("CD"); all[lm].push("CD"); 
    }
  } else {
    bmd = Object.keys(innm).filter(s => s.startsWith("DM"));
    if (bmd.length == 0) {
      bmd = Object.keys(innm).filter(s => s.startsWith("CM"));
      if (bmd.length == 0) {
        bmd = Object.keys(innm).filter(s => s == "FR");
        if (bmd.length == 0) {
          bmd = Object.keys(innm).filter(s => s == "AM");
        }
      }
    }
    if (bmd.length == 3) {
      ml = bmd.filter(s => s.endsWith("l"))[0];
      mc = bmd.filter(s => s.endsWith("c"))[0];
      mr = bmd.filter(s => s.endsWith("r"))[0];
      if (cds.length == 2) {
        all[ml].push("CDl"); all["CDl"].push(ml);
        all[mc].push("CDl"); all["CDl"].push(mc);
        all[mc].push("CDr"); all["CDr"].push(mc);
        all[mr].push("CDr"); all["CDr"].push(mr);
      } else {
        console.assert(cds.length == 1, "CDS length 3 Ms");
        all[ml].push("CD"); all["CD"].push(ml);
        all[mc].push("CD"); all["CD"].push(mc);
        all[mr].push("CD"); all["CD"].push(mr);
      }
    } else if (bmd.length == 2) {
      ml = bmd.filter(s => s.endsWith("l"))[0];
      mr = bmd.filter(s => s.endsWith("r"))[0];
      if (cds.length == 2) {
        all["CDl"].push(ml); all["CDr"].push(mr); 
        all[ml].push("CDl"); all[mr].push("CDr"); 
      } else {
        console.assert(cds.length == 1, "CDS length 2 DMs");
        all["CD"].push(ml); all["CD"].push(mr);
        all[ml].push("CD"); all[mr].push("CD");
      }
    } else if (bmd.length == 1) {
      m = bmd[0];
      if (cds.length == 3) {
        all["CDl"].push(m); all["CDc"].push(m); all["CDr"].push(m); 
        all[m].push("CDl"); all[m].push("CDc"); all[m].push("CDr"); 
      } else if (cds.length == 2) {
        all["CDl"].push(m); all["CDr"].push(m); 
        all[m].push("CDl"); all[m].push("CDr"); 
      } else {
        console.assert(cds.length == 1, "CDS length 1 DMs");
        all["CD"].push(m); all[m].push("CD");
      }
    } else if (bmd.length == 0) {
    } else {
        console.assert(false, "Incorrect number of DMs");
    }
  }

  // Add lines between midfielders and forwards
  lm = Object.keys(innm).filter(s => s.startsWith("L"))[0];
  rm = Object.keys(innm).filter(s => s.startsWith("R"))[0];
  um = Object.keys(innm).filter(s => (s == "AM" || s == "FR"));
  if (um.length == 0) {
    um = Object.keys(innm).filter(s => s.startsWith("CM"));
    if (um.length == 0) {
      um = Object.keys(innm).filter(s => s.startsWith("DM"));
    }
  }
  fs = Object.keys(innf);
  if (fs.length == 1) {
    f = fs[0];
    all[lm].push(f); all[f].push(lm); all[rm].push(f); all[f].push(rm);
    for (var j = 0; j < um.length; j++) {
      all[f].push(um[j]); all[um[j]].push(f);
    }
  } else if (fs.length == 2) {
    if (fs.includes("ST")) {
      f = "CF"
      all[lm].push(f); all[f].push(lm); all[rm].push(f); all[f].push(rm);
      for (var j = 0; j < um.length; j++) {
        all[f].push(um[j]); all[um[j]].push(f);
      }
    } else {
      lf = fs.filter(s => s.startsWith("L"))[0];
      rf = fs.filter(s => s.startsWith("R"))[0];
      if (!lf) {
        lf = fs.filter(s => s.endsWith("l"))[0];
        rf = fs.filter(s => s.endsWith("r"))[0];
      }
      all[lm].push(lf); all[lf].push(lm); all[rm].push(rf); all[rf].push(rm);
      if (um.length == 1 || (um.length == 2 && um.includes("AM"))) {
        m = um.length == 1 ? um[0] : "AM";
        all[lf].push(m); all[m].push(lf); all[rf].push(m); all[m].push(rf);
      } else if (um.length == 2) {
        ml = um.filter(s => s.endsWith("l"));
        mr = um.filter(s => s.endsWith("r"));
        all[ml].push(lf); all[lf].push(ml); all[mr].push(rf); all[rf].push(mr);
      } else if (um.length == 3) {
        ml = um.filter(s => s.endsWith("l"));
        mc = um.filter(s => s.endsWith("c"));
        mr = um.filter(s => s.endsWith("r"));
        all[ml].push(lf); all[lf].push(ml); all[mr].push(rf); all[rf].push(mr);
        if (lf.startsWith("C")) {
          all[mc].push(lf); all[mc].push(rf); all[lf].push(mc); all[rf].push(mc);
        }
      } else {
        console.assert(false, "Incorrect midfielders");
      }
    }
  } else if (fs.length == 3) {
    lf = fs.filter(s => s.startsWith("L"))[0];
    rf = fs.filter(s => s.startsWith("R"))[0];
    if (!lf) {
      lf = fs.filter(s => s.endsWith("l"))[0];
      rf = fs.filter(s => s.endsWith("r"))[0];
    }
    all[lm].push(lf); all[lf].push(lm); all[rm].push(rf); all[rf].push(rm);
    if (fs.includes("LF")) {
      f = fs.includes("ST") ? "ST": "CF";
      for (var k = 0; k < um.length; k++) {
        all[f].push(um[k]); all[um[k]].push(f);
      }
      if (um.length == 1 && um[0] == "FR") {
        all["FR"].push("LF"); all["FR"].push("RF");
        all["LF"].push("FR"); all["RF"].push("FR");
      }
    } else if (fs.includes("ST")) {
      if (um.length == 1) {
        m = um[0];
        all[m].push("CFl"); all[m].push("CFr");
        all["CFl"].push(m); all["CFr"].push(m);
      } else if (um.length == 2) {
        if (um.includes("AM") && um.includes("FR")) {
          all["FR"].push("ST"); all["ST"].push("FR");
          all["AM"].push("CFl"); all["CFl"].push("AM");
          all["AM"].push("CFr"); all["CFr"].push("AM");
        } else {
          // CMCM
          console.assert(um.filter(s => s.startsWith("CM")).length == 2, "AA");
          all["CMl"].push("CFl"); all["CFl"].push("CMl");
          all["CMr"].push("CFr"); all["CFr"].push("CMr");
        }
      } else {
        console.assert(false, "Incorrect midfielders with 3 fwds");
      }
    } else {
      // CFCFCF
      if (um.length == 2 && um.includes("AM") && um.includes("FR")) {
        um = ["AM"];
      }
      if (um.length == 1) {
        for (var k = 0; k < fs.length; k++) {
          all[fs[k]].push(um[0]); all[um[0]].push(fs[k]);
        }
      } else {
        // CFCFCF -> CMCM
        all["CFl"].push("CMl"); all["CMl"].push("CFl");
        all["CFc"].push("CMl"); all["CMl"].push("CFc");
        all["CFc"].push("CMr"); all["CMr"].push("CFc");
        all["CFr"].push("CMr"); all["CMr"].push("CFr");
      }
    }
  } else if (fs.length == 4) {
    ms = Object.keys(innm);
    if (ms.includes("LM")) {
      all["LM"].push("LF"); all["RM"].push("RF");
      all["LF"].push("LM"); all["RF"].push("RM");
      if (fs.includes("ST")) {
        all["LM"].push("CF"); all["RM"].push("CF");
        all["CF"].push("LM"); all["CF"].push("LM");
      } else {
        all["LM"].push("CFl"); all["RM"].push("CFr");
        all["CFl"].push("LM"); all["CFr"].push("LM");
      }
    } else if (ms.includes("FR")) {
      all["FR"].push("LF"); all["FR"].push("RF");
      all["LF"].push("FR"); all["RF"].push("FR");
      if (fs.includes("ST")) {
        all["FR"].push("CF"); all["CF"].push("FR");
      } else {
        all["FR"].push("CFl"); all["CFl"].push("FR");
        all["FR"].push("CFr"); all["CFr"].push("FR");
      }
    } else {
      // CMCM in middle
      all["CMl"].push("CFl"); all["CMr"].push("CFr");
      all["CFl"].push("CMl"); all["CFr"].push("CMr");
      ld = Object.keys(innd).filter(s => s.startsWith("L"))[0];
      rd = Object.keys(innd).filter(s => s.startsWith("R"))[0];
      all[ld].push("LF"); all[rd].push("RF");
      all["LF"].push(ld); all["RF"].push(rd);
    }
  }

  debug_log_calc(all);

  return all;
}

function get_style_vz (sch, pid) {
  function line_vz (lid, rid) {
    if (lid == rid) {
      console.assert(false, "Same player neigbours");
    }

    collision_dict = {
      // player style -> game style -> bonus
      // 1 - спартаковский
      1: {1: 2.5, 2: -1, 3: 0, 4: 0, 5: 0, 6: -1},
      // 2 - бей-беги
      2: {1: -1, 2: 2.5, 3: -1, 4: 0, 5: 0, 6: 0},
      // 3 - бразильская,
      3: {1: 0, 2: -1, 3: 2.5, 4: 0, 5: -1, 6: 0},
      // 4 - тики-така
      4: {1: 0, 2: 0, 3: 0, 4: 2.5, 5: -1, 6: -1},
      // 5 - катеначчо
      5: {1: 0, 2: 0, 3: -1, 4: -1, 5: 2.5, 6: 0},
      // 6 - британская
      6: {1: -1, 2: 0, 3: 0, 4: -1, 5: 0, 6: 2.5},
    };
    
    var li = window.wrappedJSObject.combo_plr[lid];
    var ri = window.wrappedJSObject.combo_plr[rid];

    if (li == -1 || ri == -1) {
      // dummy player on the one side
      return 0;
    }

    lst = window.wrappedJSObject.plr_styles[li];
    rst = window.wrappedJSObject.plr_styles[ri];
    lnt = window.wrappedJSObject.plr_nat[li];
    rnt = window.wrappedJSObject.plr_nat[ri];
    if (lst == rst) { return 12.5; }
    if (lnt == rnt) { return 5; }
    if (lst && rst && collision_dict[lst][rst] == -1) { return -5; }
    return 0;
  }

  function filter(arr, el) {
    var res = [];
    for ( var i = 0; i < _order_pos.length; i++) {
      if (_order_pos[i] == el) {
        res.push(_order_pos[i]);
      }
    }
    return res;
  }

  b = 0;
  var _order_pos = window.wrappedJSObject.order_pos.slice();
  poss = _order_pos.slice(0, 11).join(" ");
  poss += " |";
  n_cd = filter(_order_pos, "CD").length
  if (n_cd == 2) {
    poss = poss.replace(" CD ", " CDl ");
    poss = poss.replace(" CD ", " CDr ");
  } else if (n_cd == 3) {
    poss = poss.replace(" CD ", " CDl ");
    poss = poss.replace(" CD ", " CDc ");
    poss = poss.replace(" CD ", " CDr ");
  }
  n_dm = filter(_order_pos, "DM").length
  if (n_dm == 2) {
    poss = poss.replace(" DM ", " DMl ");
    poss = poss.replace(" DM ", " DMr ");
  }
  n_cm = filter(_order_pos, "CM").length
  if (n_cm == 2) {
    poss = poss.replace(" CM ", " CMl ");
    poss = poss.replace(" CM ", " CMr ");
  } else if (n_cm == 3) {
    poss = poss.replace(" CM ", " CMl ");
    poss = poss.replace(" CM ", " CMc ");
    poss = poss.replace(" CM ", " CMr ");
  }
  n_cf = filter(_order_pos, "CF").length
  if (n_cf == 2) {
    poss = poss.replace(" CF ", " CFl ");
    poss = poss.replace(" CF ", " CFr ");
  } else if (n_cf == 3) {
    poss = poss.replace(" CF ", " CFl ");
    poss = poss.replace(" CF ", " CFc ");
    poss = poss.replace(" CF ", " CFr ");
  }

  opos = poss.replace(" |", "").split(" ");
  cur_pos = opos[pid];
  nbs = sch[cur_pos];
  for (var k = 0; k < nbs.length; k++) {
    nid = opos.findIndex(s => s == nbs[k]);
    b += line_vz (pid, nid);
  }
  return b / nbs.length;
}

function calc_strength() {
  //forecast = window.calc_args.forecast;
  //temperature = window.calc_args.temperature;
  collision = window.calc_args.collision; 
  default_school = window.calc_args.default_school;
  spectators_percent = window.calc_args.spectators_percent; 
  defense_type_result = window.calc_args.defense_type_result; 
  csv_save = window.calc_args.csv_save;
  csv_content = "";

  weather_re = RegExp('.*погоды:\n(.*)\n([0-9]+)°-([0-9]+)°.*', 'i');
  fsg0_string = document.getElementsByClassName("fsg0")[0].innerText;
  fsg0_match = weather_re.exec(fsg0_string);
  forecast = fsg0_match[1];
  temperature = (parseInt(fsg0_match[2]) + parseInt(fsg0_match[3])) / 2;

  if (csv_save) {
    csv_content += "Forecast;" + forecast + ";\n"
    csv_content += "Temperature;" + temperature + ";\n";
    csv_content += "Collision;" + collision + ";\n";
    csv_content += "Defense;" + defense_type_result + ";\n";
    csv_content += "Spectators percent;" + spectators_percent + ";\n";
    csv_content += "id;pid;name;position;НС;РС;ПРС;spec_b;sygran_b;pos_b;";
    csv_content += "collision_b;home_b;morale_b;defense_b;style_b;vz_b;";
    csv_content += "bonus;almost_s;kib;leader_ds;captain_ds;gamestyle_ds;";
    csv_content += "result_s;\n";
    debug_log_calc("csv content header generated");
  }

  var gen_captain_ds = get_captain_ds ();
  debug_log_calc("Captain ds calculated");

  // Get picked players
  var scheme;
  try {
    scheme = create_scheme ();
    debug_log_calc("Schema calculated");
  } catch (e) {
    debug_log_calc("Scheme failed to calculate");
  }

  var start_strength = 0;
  for (var i = 0; i < 11; i++) {
    var id = window.wrappedJSObject.combo_plr[i];
    var rs, ns, wrs;
    var pos = window.wrappedJSObject.order_pos[i];
    if (id == -1) {
      // Add dummy player or what?
      rs = 15;
      ns = 15;
      wrs = 15;
    } else {
      rs = RS(pos, id);
      ns = window.wrappedJSObject.plr_str[id];
      wrs = WRS(ns, rs, window.wrappedJSObject.plr_styles[id], forecast, temperature);
    }

    debug_log_calc("rs ns wrs for player " + i + " calculated");
    if (csv_save) {
      if (id != -1) {
        csv_content += id + ";" + window.wrappedJSObject.plr_id[id] + ";" + window.wrappedJSObject.plr_names[id] + ";";
      } else {
        csv_content += id + ";?;dummy;";
      }
      csv_content += pos + ";" + ns + ";" + rs + ";" + wrs + ";"
    }
    
    var spec_b, sygran_b, style_b, vz_b, pos_b, 
        collision_b, home_b, morale_b, defense_b;
    if (id == -1) {
      spec_b = 0;
      vz_b = 0;
      style_b = 0;
    } else {
      spec_b = plrBonus(window.wrappedJSObject.style_index, id);
      debug_log_calc("spec_b calculated");
      try {
        vz_b = get_style_vz (scheme, i);
        debug_log_calc("vz_b calculated");
      } catch (e) {
        vz_b = 0;
        debug_log_calc("vz_b failed to calculate");
      }
      style_b = get_style_bonus (window.wrappedJSObject.plr_styles[id]);
      debug_log_calc("style_b calculated");
    }
    // bonus сыгранность
    sygran_b = parseFloat(window.wrappedJSObject.obj_syb.innerText);
    debug_log_calc("sygran_b calculated");
    pos_b = positionBonus(pos, i);
    debug_log_calc("pos_b calculated");
    collision_b = collision_bonuses[window.wrappedJSObject.style_index][collision];
    debug_log_calc("collision_b calculated");
    home_b = get_home_bonus (spectators_percent);
    debug_log_calc("home_b calculated");
    morale_b =  get_morale_bonus ();
    debug_log_calc("morale_b calculated");
    defense_b = get_defense_bonus (defense_type_result, pos);
    debug_log_calc("defense_b calculated");
  
    var bonus = spec_b;
    bonus += sygran_b;
    bonus += style_b;
    bonus += vz_b;
    bonus += pos_b;
    bonus += collision_b;
    bonus += home_b;
    bonus += morale_b;
    bonus += defense_b;
    debug_log_calc("bonus calculated");
    
    if (csv_save) {
      csv_content += spec_b + ";" + sygran_b + ";" + pos_b + ";";
      csv_content += collision_b + ";" + home_b + ";" + morale_b + ";";
      csv_content += defense_b + ";" + style_b + ";" + vz_b + ";" + bonus +";";
    }
  
    var almost_s = wrs * ((100 + bonus) / 100);
  
    // TODO! outline from for loop common ds
    var kibonus_ds = parseFloat(window.wrappedJSObject.obj_kibonus.innerText);
    debug_log_calc("kibonus_ds calculated");
    var leader_ds = get_leader_ds (pos);
    debug_log_calc("leader_ds calculated");
    var captain_ds = 0;
    if (window.wrappedJSObject.plr_id[id] != parseInt(window.wrappedJSObject.obj_captain.value)) {
      captain_ds = gen_captain_ds;
    }
    debug_log_calc("captain_ds calculated");
    var gamestyle_ds = get_gamestyle_ds (rs);
    debug_log_calc("gamestyle_ds calculated");
    var result_s = almost_s + kibonus_ds + leader_ds + captain_ds + gamestyle_ds;

    debug_log_calc("result_s calculated");

    if (csv_save) {
      csv_content += almost_s + ";" + kibonus_ds + ";" + leader_ds + ";";
      csv_content += captain_ds + ";" + gamestyle_ds + ";" + result_s + ";\n"
    }
  
    start_strength += result_s;
  }
  
  start_strength = parseInt(start_strength);
  debug_log_calc("Start strength calculated");

  if (csv_save) {
    csv_content += "Start strength;" + start_strength + ";\n";
  }

  var response = {
    response: "Hi from content script", 
    team_id: window.wrappedJSObject.curr,
    strength: start_strength,
    csv: csv_content
  };

  debug_log_calc("Send response");
  debug_log_calc(response);
  return Promise.resolve(response);
};

