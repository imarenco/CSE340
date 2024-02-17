let approvalList = document.querySelector("#approval-list");

approvalList.addEventListener("change", function () {
  const option = approvalList.value;
  const url = `/approve/list/${option}`;

  request(
    url,
    option == "classification" ? buildClassApprovalList : buildInvApprovalList
  );
});

async function request(URL, buildFn) {
  fetch(URL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network request problem");
    })
    .then(function (data) {
      buildFn(data);
    })
    .catch(function (error) {
      console.log("There was a problem:", error.message);
    });
}

async function buildClassApprovalList(data) {
  let approvalBox = document.querySelector(".approval-box");
  let dataList = '<ul class="approval-list">';

  const account_id = document.getElementById("account_id").value;
  data.forEach(function (element) {
    dataList += `<li>
        <span>ID: ${element.classification_id}</span>
        <span>Name: ${element.classification_name}</span>
        <div class="form-buttons">
          <form action="/approve/confirm/approve/classification" method="post">
            <input type="hidden" id="classification_id" name="classification_id" value="${element.classification_id}">
            <input type="hidden" name="account_id" value="${account_id}" >
            <input type="submit"   class="AddButton" value="Approve">
          </form>
          <form action="/approve/confirm/reject/classification" method="post">
            <input type="hidden" id="classification_id" name="classification_id" value="${element.classification_id}">
            <input type="hidden" name="account_id"  value="${account_id}"  >
            <input type="submit"   class="AddButton" value="Reject">
          </form>
        </div>
    </li>`;
  });
  dataList += "</ul>";

  approvalBox.innerHTML = dataList;
}

async function buildInvApprovalList(data) {
  const account_id = document.getElementById("account_id").value;
  let approvalBox = document.querySelector(".approval-box");

  let dataList = '<ul class="approval-list">';
  // Iterate over all vehicles in the array and put each in a row
  data.forEach(function (element) {
    dataList += `<li>
        <span>ID: ${element.inv_id}</span>
        <span>Vehicle: ${element.inv_year} ${element.inv_make} ${element.inv_model}</span>
        <span>Image Path: ${element.inv_image}</span>
        <span>Price: ${element.inv_price}</span>
        <span>Mileage: ${element.inv_miles}</span>
        <br />
        <br />
        
        <span>Description: <br /> ${element.inv_description}</span>
        
        <div class="form-buttons">
          <form action="/approve/confirm/approve/inventory" method="post">
            <input type="hidden" id="inv_id" name="inv_id" value="${element.inv_id}">
            <input type="hidden" name="account_id"  value="${account_id}"  >
            <input type="submit"   class="AddButton" value="Approve">
          </form>
          <form action="/approve/confirm/reject/inventory" method="post">
            <input type="hidden" id="inv_id" name="inv_id" value="${element.inv_id}">
            <input type="hidden" name="account_id"  value="${account_id}"  >
            <input type="submit"   class="AddButton" value="Reject">
          </form>
        </div>
        </li>`;
  });
  dataList += "</ul>";
  approvalBox.innerHTML = dataList;
}

async function hideClickedItem(parentElement) {
  const actionButton = document.getElementsByClassName("approval-button");
  actionButton.addEventListener("click", function () {
    parentElement.parentElement.remove();
  });
}
