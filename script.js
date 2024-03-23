/*countriesurl = to get the country names, country codes for retreaving holidays list from holidayUrl 
                and country's latitude and longitude for retreaving sun rise and sun set details from sunUrl.*/
let countriesurl = "https://restcountries.com/v2/all";
let holidayUrl = "https://date.nager.at/api/v3/publicholidays/2024";

let containerDiv = document.createElement("div");
containerDiv.className =
  "container d-flex flex-column align-items-center justify-content-center";

let header2 = document.createElement("h1");
header2.className = "header text-primary";
header2.innerText = "2024's Public Holidays";

let holidayDiv = document.createElement("div");
holidayDiv.className =
  "holidayDiv shadow-lg p-3 mb-5 bg-body rounded text-primary";
let select = document.getElementById("selectBox");

let ol = document.createElement("ol");

// Displays the country names for retrieving the holidays list based on the country codes present in holiday api
function showCountries() {
  let countries = getCountryNames();
  countries.then((cts) =>
    cts.forEach((country) => {
      getHolidayCountry(country);
    })
  );
}

// Checks the country codes present in api and returns to show
async function getHolidayCountry(country) {
  try {
    const response = await fetch(`${holidayUrl}/${country.code}`);
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    } else {
      const data = await response.json();
      let code;
      data.map((element) => {
        code = element.countryCode;
      });
      if (code == country.code) {
        let option = document.createElement("option");
        option.innerText = country.name;
        option.value = country.code;
        select.append(option);
      }
    }
  } catch (error) {
    console.error(error);
  }
  containerDiv.append(header2, select);
}

// Displays the selected country's list of public holidays.
async function getHolidays() {
  let selectBox = document.getElementById("selectBox");
  let selectedValue = selectBox.options[selectBox.selectedIndex].value;
  try {
    const response = await fetch(`${holidayUrl}/${selectedValue}`);
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    const data = await response.json();
    ol.innerHTML = "";
    data.map((element) => {
      let li = document.createElement("li");
      li.innerText = `${element.date} - ${element.localName} - ${element.name}`;
      // console.log(element.date, element.localName + "-", element.name);

      ol.append(li);
      holidayDiv.append(ol);
    });
  } catch (error) {
    console.error(error);
  }
  containerDiv.append(holidayDiv);
}

// constructor function for Country
function Country(name, code, lat, lng) {
  (this.name = name), (this.code = code), (this.lat = lat), (this.lng = lng);
}

// Gets the country names, codes and lantitude and longitudes..
async function getCountryNames() {
  let countries = [];
  try {
    let data = await fetch(countriesurl);
    let result = await data.json();
    for (const iterator of result) {
      if (iterator.latlng === undefined) {
        continue;
      } else {
        const country = new Country(
          iterator.name,
          iterator.alpha2Code,
          iterator.latlng[0],
          iterator.latlng[1]
        );
        countries.push(country);
      }
    }
    return countries;
  } catch (error) {
    console.error(error);
  }
}

window.onload = function () {
  showCountries(); // starts the execution from here
  containerDiv.append(select);
  document.body.append(containerDiv);
};
