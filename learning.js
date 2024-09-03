async function calculateChildsQuantity(executionContext) {
    const form = executionContext.getFormContext();

    const recordId = form.data.entity.getId();

    let fetchXml = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
        '<entity name="cr2ca_inventory_product">' +
        '<attribute name="cr2ca_inventory_productid" />' +
        '<attribute name="cr2ca_name" />' +
        '<attribute name="cr2ca_int_quantity" />' +
        '<attribute name="cr2ca_fk_inventory" />' +
        '<order attribute="cr2ca_name" descending="false" />' +
        '<filter type="and">' +
        '<condition attribute="cr2ca_fk_inventory" operator="eq" uiname="Warehouse1" uitype="cr2ca_inventory" value="' + recordId + '" />' +
        '</filter>' +
        '</entity>' +
        '</fetch>';

    fetchXml = "?fetchXml=" + encodeURIComponent(fetchXml);

    const records = await Xrm.WebApi.retrieveMultipleRecords('cr2ca_inventory_product', fetchXml);


    form.getAttribute("cr2ca_int_items_quantity").setValue(records.entities.length);
}