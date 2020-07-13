function onError(error) {
  console.error(`Error: ${error}`);
  console.error("Error:", error);
}

function get_fwds (url, is_home, cell) {
  fetch(url).then(response => response.text()).then(function (text) {
    console.log("AAAA", url, is_home);
    var page = document.createElement('html');
    page.innerHTML = text;
    tbls = page.getElementsByClassName("tbl");
    var tbl = is_home ? tbls[0] : tbls[1];
    var rows = tbl.getElementsByTagName("tr");
    if (rows.length < 16) {
      cell.innerHTML = "N/A";
      return;
    }
    var fwds = 0;
    for (var i = 1; i <= 16; i++) {
      var columns = rows[i].getElementsByTagName("td");
      var span = columns[0].getElementsByTagName("span");
      if (span.length == 0) {
        continue;
      }
      var position = span[0].innerText;
      switch (position) {
        case "LW":
        case "LF":
        case "CF":
        case "ST":
        case "RW":
        case "RF":
        case "AM":
          fwds += 1;
          break;
        default:
          break;
      }
    }
    cell.innerHTML = fwds;
    if (fwds > 3) {
      cell.style.backgroundColor = "#ffe0e0";
    } else {
      cell.style.backgroundColor = "#e0ffe0";
    }
  }).catch(onError);
}

ads = document.createElement('iframe');
ads.src = "http://pcstat.ru/banner"
ads.style="display: block"
ads.height = 160;
ads.width = 500;
ads.style.backgroundColor = "white"
ads.sandbox="allow-popups allow-scripts"
season_table = document.getElementsByClassName("tbl")[0];
pre_ads_row = season_table.getElementsByTagName("tbody")[0].insertRow(-1);
pre_ads_cell = pre_ads_row.insertCell(0);
pre_ads_cell.colSpan = 8;
pre_ads_cell.appendChild(document.createTextNode(" s "));
pre_ads_row.style.backgroundColor = "#B45618"
pre_ads_row.style.color = "#B45618"
ads_row = season_table.getElementsByTagName("tbody")[0].insertRow(-1);
ads_row.style.backgroundColor = "#F4F8F2"
ads_cell = ads_row.insertCell(0);
ads_cell.colSpan = 8;
ads_cell.appendChild(ads);

game_table = document.getElementsByClassName("tbl")[1];
hdr_row = game_table.rows[0];
hdr_td = hdr_row.insertCell(-1)
hdr_td.innerHTML = "<b>Нпд</b>";
hdr_td.className = "lh18 txtw";
hdr_td.style.backgroundColor = "#B45618";
for (var i = 1; i < game_table.rows.length; i++) {
  row = game_table.rows[i];
  columns = row.getElementsByTagName("td");
  is_home_side = columns[5].innerText == "Д";
  game_td = columns[10];
  game_href = game_td.getElementsByTagName("a")[0].href;
  cell = row.insertCell(-1);
  get_fwds(game_href, is_home_side, cell);
}
