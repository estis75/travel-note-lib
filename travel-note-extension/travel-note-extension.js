// https://transit.yahoo.co.jp/search/


// let script = document.createElement("script");
// script.setAttribute("type", "application/javascript");
// script.setAttribute("id", "travel-note-ext");
// script.innerHTML = `
function download_as_satysfi(data, filename = "download") {
  let a = document.createElement("a");
  a.href = URL.createObjectURL(
      new Blob([data],
      {type: "text/plain;charset=utf-8"}));
  a.download = filename + ".saty";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function create_data(route_id_tmp) {
  const wasted_lines = document.getElementById('srline').childNodes;
  // 1-indexed
  const lines = Array.prototype.filter.call(wasted_lines, (e) => e.id)

  const route_id = route_id_tmp - 1;
  const line = lines[route_id];
  const stations = line.querySelectorAll(".station");
  const infos = line.querySelectorAll(".info");
  let start_time = "";
  let end_time = "";

  const minLength = Math.min(stations.length, infos.length);
  let results = [];
  let to_contains_direct_from = undefined;
  let to_contains_direct_via = undefined;
  for (var i = 0; i < minLength; i++) {
    const from = to_contains_direct_from ? to_contains_direct_from : stations[i];
    const via = to_contains_direct_via ? to_contains_direct_via : infos[i];
    to_contains_direct_from = undefined;
    to_contains_direct_via = undefined;
    const to = stations[i+1];
    if (to.classList.contains("direct")) {
      to_contains_direct_from = from;
      to_contains_direct_via = via;
      continue;
    }

    const from_times = from.querySelector(".time").childNodes;
    let from_time = "";
    if (from_times.length == 1) {
      from_time = from_times[0].textContent.replace(":", "");
      start_time = from_time;
    }else{
      const from_times0 = Array.prototype.map.call(from_times[0].childNodes, e => e.textContent);
      if (from_times0.includes('発')) {
        from_time = from_times[0].childNodes[0].textContent.replace(":", "");
      }else{
        from_time = from_times[1].childNodes[0].textContent.replace(":", "");
      }
    }
    const from_station = from.querySelector("dl dt a").innerHTML;
    
    let via_line = "";
    via.querySelector(".transport div").childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        via_line = node.textContent;
      }
    });
    const via_tmp = via.querySelector(".transport div .destination");
    let via_destination = "";
    if ( via_tmp !== null ) {
      const via_destination_tmp = via.querySelector(".transport div .destination");
      via_destination_tmp.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          via_destination = node.textContent;
        }
      });
    }else{
      via_destination = "";
    }

    const to_times = to.querySelector(".time").childNodes;
    let to_time = "";
    if (to_times.length == 1) {
      to_time = to_times[0].textContent.replace(":", "");
      end_time = to_time;
    }else{
      const to_times0 = Array.prototype.map.call(to_times[0].childNodes, e => e.textContent);
      if (to_times0.includes('着')) {
        to_time = to_times[0].childNodes[0].textContent.replace(":", "");
      }else{
        to_time = to_times[1].childNodes[0].textContent.replace(":", "");
      }
    }
    const to_station = to.querySelector("dl dt a").innerHTML;

    results.push([from_time, from_station, via_destination, via_line, to_time, to_station]);
  }

  const data = results.map(([from_time, from_station, via_destination, via_line, to_time, to_station], idx) => {
    let fromto = "";
    if (idx == 0) {
      fromto =
    "    +interstation ?:({" + from_station + "}) ?:({" + from_time + "}) ?:({" + to_station + "}) ?:({" + to_time + "})<\n" +
    "      +Itinerary.p {\n" +
    "        " + via_line + (via_destination === "" ? "" : "・") + via_destination + "\n" +
    "      }\n" +
    "    >\n"
    }else{

      fromto = 
    "    +interstation ?* ?:({" + from_time + "}) ?:({" + to_station + "}) ?:({" + to_time + "})<\n" +
    "      +Itinerary.p {\n" +
    "        " + via_line + (via_destination === "" ? "" : "・") + via_destination + "\n" +
    "      }\n" +
    "    >\n"
    }
    
    return fromto;
  }).join('\n');


  const date = document.querySelector("#bef_aftr .time").textContent;
  const time = start_time + "-" + end_time;
  download_as_satysfi(data, date + "-" + time);
}
// `;

// document.querySelector("head").appendChild(script);

const line_list_num = document.getElementById('rsltlst').childNodes.length;

for(let i = 1; i <= line_list_num; i++) {
  var newButton = document.createElement("li");
  const innerhtml = '<p class="btnDefault"><a id="tnt' + i + '" href="javascript:void(0);" style="cursor:pointer;color:#0059b2" class="newButtonClass" data-type="1"><span class="icnNew"></span>toSATySFi</a></p>'
  newButton.innerHTML = innerhtml;

  var targetUl = document.querySelector("#route0" + i + " .option ul");
  targetUl.appendChild(newButton);

  // document.addEventListener('DOMContentLoaded', function() {
      const a = document.querySelector("#tnt" + i);
      a.addEventListener('click', () => create_data(i));
  // });
}

// const script = document.createElement('script');
// script.src = "travel-note-extension.js"
// document.appendChild();