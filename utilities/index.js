const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

Util.buildGrid = async function (data) {
  if (data.length > 0) {
    return `
    <ul id="inventory-list">
      ${data
        .map((vehicle) => {
          return `  
        <li>
          <a href="../../inv/detail/${vehicle.inv_id}"  title="View ${
            vehicle.inv_make
          } ${vehicle.inv_model}">
            <img src="${vehicle.inv_image}" alt="${vehicle.inv_make}"  />
          </a>
          <div class="namePrice">
            <div class="separator"></div>
            <h2>
              <a href="../../inv/detail/${vehicle.inv_id}" title="${
            vehicle.inv_make
          } ${vehicle.inv_model}">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
          <span>
            $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}
          </span>
        </div>
      </li>
        `;
        })
        .join("")}
      </ul>
    `;
  } else {
    return "<p>Vehicles not found</p>";
  }
};

Util.buildDetailPage = async function (data) {
  const vehicle = data[0];

  if (vehicle) {
    return `
      <div id="detail-vehicle">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make}" />
        <div>
          <h2>
            ${vehicle.inv_make} ${vehicle.inv_model}
          </h2>
          <p> Description: <span id="description"> ${
            vehicle.inv_description
          }</span></p>
          <p> Price: <span id="price">$${new Intl.NumberFormat("en-US").format(
            vehicle.inv_price
          )}</span></p>
          <p> Mileage: <span>${new Intl.NumberFormat("en-US").format(
            vehicle.inv_miles
          )}</span></p>
          <p> Color: <span>${vehicle.inv_color}</span></p>
        </div>
      </div>
    `;
  } else {
    return "<p>Vehicle not found</p>";
  }
};

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
