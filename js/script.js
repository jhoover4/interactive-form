"use strict";

const focusFirstField = () => {
  $("form input")
    .eq(0)
    .focus();
};

const showOtherJobRoleField = () => {
  const otherTitleTextField = $("#other-title");

  // Initialize to hidden
  otherTitleTextField.hide();

  $('select[name="user_title"]').change(e => {
    if ($(e.target).val() === "other") {
      otherTitleTextField.show();
    } else {
      otherTitleTextField.hide();
    }
  });
};

const settShirtInfo = () => {
  const tShirtColorSelect = $("#color");

  const jsPunOptions = ["cornflowerblue", "darkslategrey", "gold"];
  const iHeartJsOptions = ["tomato", "steelblue", "dimgrey"];

  $("#design").change(() => {
    for (let colorChoice of tShirtColorSelect.children()) {
      colorChoice = $(colorChoice);

      if (jsPunOptions.includes(colorChoice.val())) {
        colorChoice.show();
      } else {
        colorChoice.hide();
      }
    }
  });
};

const setRegisterForActivities = () => {
  const activities = $(".activities label");

  activities.children(":checkbox").click(e => {
    const selectedCheckbox = $(e.target);
    const selectedLabel = selectedCheckbox.parent();
    const selectedLabelText = selectedLabel.text();

    const currentBoxTime = getActivityValues(selectedLabelText).time;

    let checkedLabels = selectedLabel.siblings().has("input");
    for (let checkedLabel of checkedLabels) {
      const labelText = checkedLabel.textContent;
      const checkBox = $(checkedLabel).children();

      const activityTime = getActivityValues(labelText).time;

      if (activityTime === currentBoxTime && selectedCheckbox.is(":checked")) {
        checkBox.attr("disabled", true);
        checkBox.attr("checked", false);
      } else {
        checkBox.attr("disabled", false);
      }
    }
  });
};

const getActivityValues = activityText => {
  const activityVals = {
    name: "",
    time: "",
    cost: 0
  };

  let activitySplit = activityText.split(" — ");

  activityVals.name = activitySplit[0].trim();

  let nextSplit = activitySplit[1].split(",");

  let rawCost;
  if (nextSplit.length > 1) {
    activityVals.time = nextSplit[0];
    rawCost = nextSplit[1].trim();
  } else {
    activityVals.time = "";
    rawCost = nextSplit[0];
  }

  activityVals.cost = Number(rawCost.replace(/[^0-9.]+/g, ""));

  return activityVals;
};

const calcWorkshopCost = () => {
  // TODO: Tally running cost of workshops.
};

const run = () => {
  focusFirstField();
  showOtherJobRoleField();
  settShirtInfo();
  setRegisterForActivities();
};
run();
