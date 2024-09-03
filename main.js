function makeNameReadOnly(executionContext) {
    const form = executionContext.getFormContext();
    form.getAttribute("cr2ca_name").setRequiredLevel("none");

    const productLookup = form.getAttribute("cr2ca_fk_product").getValue();
    if (productLookup !== null && productLookup[0] !== null) {
        const productName = productLookup[0].name ?? "";
        form.getAttribute("cr2ca_name").setValue(productName);
    }

    form.getControl("cr2ca_name").setDisabled(true);
}


function onFormLoad(executionContext) {
    const form = executionContext.getFormContext();
    const formType = form.ui.getFormType();
    const controls = form.ui.controls.get();

    const shouldDisable = formType === 2;

    controls.forEach((control) => {
        if (control.getDisabled !== undefined) {
            control.setDisabled(shouldDisable);
        }
    });

    makeNameReadOnly(executionContext);
}



function onProductChange(executionContext) {
    const form = executionContext.getFormContext();

    const productLookup = form.getAttribute("cr2ca_fk_product").getValue();
    if (productLookup !== null && productLookup[0] !== null) {
        const productName = productLookup[0].name ?? "";
        form.getControl("cr2ca_name").setDisabled(false);
        form.getAttribute("cr2ca_name").setValue(productLookup[0].name);
        form.getControl("cr2ca_name").setDisabled(true);
    }

}

function calculateTotalAmount(executionContext) {
    const form = executionContext.getFormContext();

    const quantity = form.getAttribute("cr2ca_int_quantity").getValue();
    const pricePerUnit = form.getAttribute("cr2ca_mon_price_per_unit").getValue();

    if (quantity === null || pricePerUnit === null) {
        form.getAttribute("cr2ca_mon_total_amount").setValue(null);
    } else {
        const totalPrice = parseFloat(quantity) * parseFloat(pricePerUnit);
        form.getAttribute("cr2ca_mon_total_amount").setValue(totalPrice);
    }
}

function togglePricePerUnit(executionContext) {
    const form = executionContext.getFormContext();
    const selectedOption = form.getAttribute("cr2ca_os_type").getSelectedOption();

    if (selectedOption !== null) {
        const type = selectedOption.text;
        if (type === "Product") {
            form.getControl("cr2ca_mon_price_per_unit").setVisible(true);
        } else if (type === "Service") {
            form.getControl("cr2ca_mon_price_per_unit").setVisible(false);
        }
    } else {
        form.getControl("cr2ca_mon_price_per_unit").setVisible(false);
    }
}