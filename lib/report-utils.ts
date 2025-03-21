/**
 * Creates and downloads a dummy report file
 * @param reportName The name of the report file
 */
export function downloadDummyReport(reportName = "inventory-report") {
  // Create a simple CSV content for the dummy report
  const currentDate = new Date().toISOString().split("T")[0]
  const csvContent = `
Item Name,Category,Purchase Date,Purchase Price,Current Value,Location
MacBook Pro 16",Electronics,2023-01-15,$2499,$2100,Home Office
Leather Sofa,Furniture,2023-02-20,$1200,$1000,Living Room
Samsung 65" OLED TV,Electronics,2023-03-10,$1800,$1500,Living Room
Dining Table,Furniture,2023-04-05,$800,$750,Dining Room
Refrigerator,Appliances,2023-05-12,$1200,$1150,Kitchen
Gold Necklace,Jewelry,2023-06-18,$1500,$1600,Safe
Washing Machine,Appliances,2023-07-22,$700,$650,Laundry Room
Artwork - Abstract,Art,2023-08-30,$500,$550,Living Room
Winter Coat,Clothing,2023-09-15,$200,$180,Closet
Power Drill,Tools,2023-10-05,$150,$130,Garage

Report generated on: ${currentDate}
`.trim()

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a download link and trigger the download
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", `${reportName}-${currentDate}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

