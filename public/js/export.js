function exportDashboardToExcel() {
  const table = document.getElementById('dashboardExportTable');
  const wb = XLSX.utils.table_to_book(table, { sheet: "HOI Dashboard Stats" });
  XLSX.writeFile(wb, "HOI_Dashboard_Export.xlsx");
}