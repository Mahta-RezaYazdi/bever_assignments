async function calculateTotalPriceInventory(executionContext) {
    const form = executionContext.getFormContext();

    const recordId = form.data.entity.getId();

    const priceList = form.getAttribute("cr2ca_fk_price_list").getValue();

    let fetchXml = `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">` +
        `<entity name="cr2ca_inventory_product">` +
        `<attribute name="cr2ca_inventory_productid" />` +
        `<attribute name="cr2ca_name" />` +
        `<attribute name="cr2ca_int_quantity" />` +
        `<attribute name="cr2ca_fk_product" />` +
        `<attribute name="cr2ca_fk_inventory" />` +
        `<order attribute="cr2ca_name" descending="false" />` +
        ` <filter type="and">` +
        `<condition attribute="cr2ca_fk_inventory" operator="eq"  value="` + recordId + `" />` +
        `</filter>` +
        `</entity>` +
        `</fetch>`;

    fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);

    const inventoryLines = await Xrm.WebApi.retrieveMultipleRecords('cr2ca_inventory_product', fetchXml);

    if (priceList !== null && priceList[0] !== null) {
        for (let i = 0; i < inventoryLines.entities.length; i++) {
            const quantity = inventoryLines.entities[i]["cr2ca_int_quantity"];
            const product = inventoryLines.entities[i]["_cr2ca_fk_product_value"];
            const priceList = priceList[0].id;

            let fetchXml = ` <fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">` +
                `<entity name="cr2ca_pricelist_item">` +
                `<attribute name="cr2ca_pricelist_itemid" />` +
                `<attribute name="cr2ca_mon_price" />` +
                `<order attribute="cr2ca_mon_price" descending="false" />` +
                ` <filter type="and">` +
                `<filter type="and">` +
                `<condition attribute="cr2ca_fk_product" operator="eq"  value="` + product + `" />` +
                `<condition attribute="cr2ca_fk_price_list" operator="eq" value="` + priceList + `" />` +
                `</filter>` +
                `</filter>` +
                `</entity>` +
                `</fetch>`;

            fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);
            const priceListLines = await Xrm.WebApi.retrieveMultipleRecords('cr2ca_pricelist_item', fetchXml);

            let price = 0;
            for (let j = 0; j > priceListLines.entities.length; j++) {
                price = priceListLines.entities[j]["cr2ca_mon_price"];
            }
        }
    }


}