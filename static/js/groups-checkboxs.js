document.querySelectorAll('input[type="checkbox"][data-type="spe"]').forEach((speCheckBox) => {

    speCheckBox.addEventListener("input", (e) => {
        document.querySelectorAll(`input[type="checkbox"][data-type="grp"][data-refers="${e.target.id}"]`).forEach((grpBox) => {
            grpBox.checked = e.target.checked;
        });
    });

    let groups = Array.from(document.querySelectorAll(`input[type="checkbox"][data-type="grp"][data-refers="${speCheckBox.id}"]`));
    let totalGroups = groups.length;
    let checkedCount = groups.filter((grp) => grp.checked).length;

    if(checkedCount == totalGroups) {
        speCheckBox.checked = true;
    } else if(checkedCount > 0) {
        speCheckBox.indeterminate = true;
    }

});

document.querySelectorAll('input[type="checkbox"][data-type="grp"]').forEach((grpBox) => {
    grpBox.addEventListener("input", (e) => {
        let elements = Array.from(document.querySelectorAll(`input[type="checkbox"][data-type="grp"][data-refers="${e.target.dataset.refers}"]`));
        let totalEl = elements.length;
        let checkedCount = elements.filter((el) => el.checked).length;
        let speCheckbox = document.getElementById(e.target.dataset.refers);
        if(checkedCount == totalEl) {
            speCheckbox.checked = true;
            speCheckbox.indeterminate = false;
        } else if(checkedCount > 0) {
            speCheckbox.checked = false;
            speCheckbox.indeterminate = true;
        } else {
            speCheckbox.indeterminate = false;
            speCheckbox.checked = false;
        }
    });
});

document.getElementById("submitButton").addEventListener("click", (e) => {
    let groups = Array.from(document.querySelectorAll('input[type="checkbox"][data-type="grp"]'))
                        .filter((el) => el.checked)
                        .map((el) => el.value)
                        .reduce((prev, next, i) => i == 0 ? next : `${prev},${next}`, "");
    document.getElementById("groupsField").value = groups;
});