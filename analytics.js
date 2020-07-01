function onError(error) {
  console.error(`Error: ${error}`);
  console.error("Error:", error);
//  debug_log("Received error:");
//  debug_log(error.toString());
//  debug_file();
}

//function process_page(response) {
//  console.log(response);
//  response.text().then(function (text) {
//    var page = document.createElement('html');
//    page.innerHTML = text;
//    tbls = page.getElementsByClassName("tbl");
//    console.log(tbls);
//    console.log("AAAA", is_home);
//  });
//}

//function process_page (text) {
//  var page = document.createElement('html');
//  page.innerHTML = text;
//  tbls = page.getElementsByClassName("tbl");
//  console.log(tbls);
//  console.log("AAAA", is_home);
//  return 4;
//}

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
      console.log(position);
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

//console.log(document.getElementsByClassName("tbl")[1].rows);

game_table =  document.getElementsByClassName("tbl")[1];
hdr_row = game_table.rows[0];
hdr_td = hdr_row.insertCell(-1)
hdr_td.innerHTML = "<b>Нпд</b>";
hdr_td.className = "lh18 txtw";
hdr_td.style.backgroundColor = "#B45618";
for (var i = 1; i < game_table.rows.length; i++) {
  row = game_table.rows[i];
  columns = row.getElementsByTagName("td");
  is_home_side = columns[5].innerText == "Д";
//  console.log(is_home_side);
  game_td = columns[10];
  game_href = game_td.getElementsByTagName("a")[0].href;
//  console.log(game_href);
//  fetch(game_href).then(process_page).catch(onError);
//  fetch(game_href).then(response => response.text())
//                  .then(process_page).catch(onError);
  cell = row.insertCell(-1);
  get_fwds(game_href, is_home_side, cell);
  console.log("BBBB");
//  row.insertCell(-1).innerHTML = "3-4-4";
}
