function onError(error) {
  console.error(`Error: ${error}`);
  console.error("Error:", error);
}

function get_command() {
  hint = document.getElementById("hint_1");
  spec_table = hint.parentNode.parentNode.parentNode.parentNode;
  rows = spec_table.rows;
  team = rows[1].getElementsByTagName("a")[0].href;
  return team;
}

function get_at_bonus() {
  hint = document.getElementById("hint_6");
  spec_td = hint.parentNode.parentNode.getElementsByTagName("td")[1];
  specs = spec_td.innerText.split(" ");
  for(var i = 0; i < specs.length; i++) {
    switch (specs[i]) {
      case "Ат":
        return 1;
      case "Ат2":
        return 2;
      case "Ат3":
        return 3;
      case "Ат4":
        return 4;
    }
  }
  return 0;
}

function get_age() {
  hint = document.getElementById("hint_1");
  spec_td = hint.parentNode.parentNode.getElementsByTagName("td")[1];
  age = spec_td.innerText.split(" ")[0];
  return parseInt(age);
}

function get_age_base_fatigue(age) {
  ret = {"B": 0, "C": 0};
  if (age >= 16 && age <= 23) {
    ret["B"] = 2;
    ret["C"] = 1;
  } else if (age >= 24 && age <= 29) {
    ret["B"] = 3;
    ret["C"] = 2;
  } else if (age >= 30 && age <= 34) {
    ret["B"] = 4;
    ret["C"] = 3;
  }
  return ret;
}

function game_type(tournament) {
  if (tournament.startsWith("Кубок межсезонья") ||
      tournament.startsWith("Чемпионат") ||
      tournament.startsWith("Переходные матчи") ||
      tournament.startsWith("Комм. турнир") ||
      tournament.startsWith("Конференция")) {
    // TODO! final international tournament
    return "B";
  }
  if (tournament.startsWith("Товарищеский матч")) {
    return "A";
  }
  return "C";
}

function calc_fatigue(type, minutes, age_base, atb, ip, att) {
  ret = 0;
  if (type == "A") {
    ret = 0;
  }
  if (type == "B") {
    ret = Math.floor((age_base[type] + ip) / 90 * minutes);
  }
  if (type == "C") {
    ret = Math.floor((age_base[type] + Math.floor(ip / 2)) / 90 * minutes);
  }
  if (att > 0) {
    ret = ret * 2;
  }
  if (att < 0) {
    ret = 0;
  }
  ret -= atb;
  if (ret < 0) {
    return 0;
  } else {
    return ret;
  }
}

function calc_rest(type, fizcenter_bonus, ip, op) {
//  ИП	1	 2	3	 4	5	6	..
//  ОП0 15 12 10 8	6	5	5
//  ОП1	5	 5	5	 5	5	5	5
//  ОП2	4	 4	4	 4	4	4	4
//  ОП3	4	 4	4	 4	4	4	4
  ret = 0;
  if (type == "A" || type == "C") {
    return ret;
  }
  if (op == 0) {
    switch (ip) {
      case 1:  ret = -15; break;
      case 2:  ret = -12; break;
      case 3:  ret = -10; break;
      case 4:  ret = -8; break;
      case 5:  ret = -6; break;
      default: ret = -5; break;
    }
  } else if (op == 1) {
    ret = -5;
  } else if (op >= 2) {
    ret = -4;
  }
  ret += fizcenter_bonus;
  return ret;
}

function calc_ip(mins, ip) {
  if (isNaN(mins)) {
    return 0;
  } else if (mins < 15) {
    return ip;
  } else {
    return ip + 1;
  }
}

function calc_op(mins, op) {
  if (isNaN(mins)) {
    return op + 1;
  } else if (mins < 15) {
    return op;
  } else {
    return 0;
  }
}

const parser = new DOMParser();

async function get_attitude(url, team) {
  // positive is super
  // zero is general
  // negative is rest
  text = await fetch(url).then(response => response.text());
  page = parser.parseFromString(text, "text/html");

  hdr_table = page.getElementsByClassName("tobl")[0];
  team_hrefs = hdr_table.getElementsByClassName("mnuw");
  is_home = false;
  if (team_hrefs[0].href == team) {
    is_home = true;
  }

  hint = page.getElementById("hint_7");
  att_row = hint.parentNode.parentNode;
  att_tds = att_row.getElementsByTagName("td");
  att_td = att_tds[2];
  if (is_home) {
    att_td = att_tds[0];
  }
  switch (att_td.innerText) {
    case "обычный":
      return 0;
    case "супер":
      return 1;
    case "отдых":
      return -1;
  }
  return 0;
}


async function main() {
  tables = document.getElementsByClassName("tbl")
  if (tables.length == 1) {
    game_table = tables[0];
  } else if (tables.length == 2) {
    game_table = tables[1];
  } else {
    console.assert("More tables than expected!");
  }

  fizcenter_bonus = -parseInt(document.getElementById("fizcenter-bonus").value);
  start_fatigue = parseInt(document.getElementById("start_fatigue").value);

  atb = get_at_bonus();
  age = get_age();
  team = get_command();

  age_base = get_age_base_fatigue(age);
  fatigue = start_fatigue;
  ip = 0;
  op = 1;
  tour = 0;
  console.log(
    "team: ", team,
    "ATB: ", atb, "start_fatigue: ", start_fatigue,
    "age ", age, "age_base:", age_base
  );

  for (var i = 1; i < game_table.rows.length; i++) {
    row = game_table.rows[i];
    columns = row.getElementsByTagName("td");
    if (columns.length != 16) {
      continue;
    }

    cell = row.insertCell(-1);
    stage = columns[5].innerText;
    if (stage == "Стадия") {
      // current fatigue in last row (not game row)
      cell.className = "lh18 txtw";
      cell.style.backgroundColor = "#B45618";
    }

    // TODO! Super and rest
    hrefs = columns[3].getElementsByTagName("a");
    if (hrefs.length) {
      game_href = hrefs[0].href;
      attitude = 0;
      if (game_href) {
        attitude = await get_attitude(game_href, team);
      }
    }

    tournament = columns[4].innerText;
    minutes = parseInt(columns[15].innerText);
    type = game_type(tournament);

    console.log(tournament, stage, attitude);

    if (type == "B" && stage == "1 тур") {
      fatigue = start_fatigue;
      ip = 0;
      op = 1;
    }

    if (type == "B") {
      ss = stage.split(" ");
      if (ss.length == 2) {
        new_tour = ss[0];
        if (tour) {
          delta = new_tour - tour;
          if (delta > 1) {
            // simulate delta days of rest in raw
            for(var k = 0; k < delta; k++) {
              fatigue += calc_rest(type, fizcenter_bonus, ip, op);
              if (fatigue < 0) {
                fatigue = 0;
              }
              ip = 0;
              op += 1;
            }
          }
        }
        tour = new_tour;
      }
    }

    if (type == "A") {
      cell.appendChild(document.createTextNode(25));
    } else {
      cell.appendChild(document.createTextNode(fatigue));
    }

    if (isNaN(minutes)) {
      fatigue += calc_rest(type, fizcenter_bonus, ip, op);
      if (fatigue < 0) {
        fatigue = 0;
      }
    } else {
      fatigue += calc_fatigue(type, minutes, age_base, atb, ip, attitude);
    }

    ip = calc_ip(minutes, ip);
    op = calc_op(minutes, op);
  }
}

function add_buttons() {
  ads = document.createElement('div');
  ads.style.backgroundColor = "white"
  ads.sandbox="allow-popups allow-scripts"

  tables = document.getElementsByClassName("tbl")
  if (tables.length == 1) {
    game_table = tables[0];
  } else if (tables.length == 2) {
    game_table = tables[1];
  } else {
    console.assert("More tables than expected!");
  }

  hdr_row = game_table.rows[0];
  hdr_td = hdr_row.insertCell(-1);
  hdr_td.innerHTML = "<b>Уст</b>";
  hdr_td.className = "lh18 txtw";
  hdr_td.style.backgroundColor = "#B45618";

  pre_ads_row = game_table.getElementsByTagName("tbody")[0].insertRow(0);
  pre_ads_cell = pre_ads_row.insertCell(0);
  pre_ads_cell.colSpan = 17;
  pre_ads_cell.appendChild(document.createTextNode(" s "));
  pre_ads_row.style.backgroundColor = "#B45618"
  pre_ads_row.style.color = "#B45618"

  ads_row = game_table.getElementsByTagName("tbody")[0].insertRow(1);
  ads_row.style.backgroundColor = "#F4F8F2"
  ads_cell = ads_row.insertCell(0);
  ads_cell.colSpan = 10;
  ads_cell.appendChild(ads);

  tbl = document.createElement('table');
  tbl.insertRow().insertCell().appendChild(document.createTextNode("Стартовая усталость"));
  inp1 = document.createElement('input');
  inp1.type = 'text';
  inp1.size = 2;
  inp1.placeholder = 3;
  inp1.value = 3;
  inp1.id = "start_fatigue"
  tbl.insertRow().insertCell().appendChild(inp1);
  tbl.insertRow().insertCell().appendChild(document.createTextNode("Бонус физ. центра"));
  inp2 = document.createElement('input');
  inp2.type = 'text';
  inp2.size = 2;
  inp2.placeholder = 3;
  inp2.value = 3;
  inp2.id = "fizcenter-bonus";
  tbl.insertRow().insertCell().appendChild(inp2);
  btn = document.createElement("input")
  btn.type = "button";
  btn.value = "Посчитать";
  btn.id = "recalc-button";
  btn.style.backgroundColor = "#B45618"
  btn.className = "lh18 txtw";
  tbl.insertRow().insertCell().appendChild(btn);
  btn_cell = ads_row.insertCell(-1);
  btn_cell.colSpan = 7;
  btn_cell.appendChild(tbl);

  document.getElementById("recalc-button").addEventListener("click", main);
}

add_buttons();
//main();