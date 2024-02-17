const pool = require("../database/");

async function getClassificationsWithoutApproval() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification WHERE classification_approved = false ORDER BY classification_name "
    );
    return data.rows;
  } catch (error) {
    console.error("Error retrieving classification approvals" + error);
  }
}

async function getInventoryWithoutApproval() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory  WHERE inv_approved = false ORDER BY inv_id"
    );
    return data.rows;
  } catch (error) {
    console.error("Error retrieving inventory approvals" + error);
  }
}

async function approveInventory(inv_id, account_id) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_approved = true, account_id = $1, inv_approved_date = CURRENT_TIMESTAMP WHERE inv_id = $2 RETURNING *";
    return await pool.query(sql, [account_id, inv_id]);
  } catch (error) {
    console.error("model error: " + error);
  }
}

async function approveClassification(classification_id, account_id) {
  try {
    const sql =
      "UPDATE public.classification SET classification_approved = true, account_id = $1, classification_approval_date = CURRENT_TIMESTAMP WHERE classification_id = $2 RETURNING *";
    const data = await pool.query(sql, [account_id, classification_id]);
    return data;
  } catch (error) {
    console.error("model error: " + error);
  }
}
module.exports = {
  getClassificationsWithoutApproval,
  getInventoryWithoutApproval,
  approveInventory,
  approveClassification,
};
