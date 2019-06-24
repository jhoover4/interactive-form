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

  const $designSelect = $("#design");

  $designSelect.change(() => {
    let filterArr = [];
    if ($designSelect.val() === "js puns") {
      filterArr = jsPunOptions;
    } else if ($designSelect.val() === "heart js") {
      filterArr = iHeartJsOptions;
    }

    for (let colorChoice of tShirtColorSelect.children()) {
      colorChoice = $(colorChoice);
      colorChoice.show();

      if (filterArr.length !== 0 && !filterArr.includes(colorChoice.val())) {
        colorChoice.hide();
      }
    }
  });
};

const activityRegisterPanel = (function($) {
  const activityPanel = $(".activities");
  const totalEl = $("<p></p>");

  const setActivityPanel = () => {
    appendWorkshopTotalEl(activityPanel);
    setActivityCheckEvent();
  };

  const setActivityCheckEvent = () => {
    const activities = activityPanel.find("label");

    activities.children(":checkbox").click(e => {
      setTotalVal(calculateCost(activities));
      hideOverlappingActivities(activities);
    });
  };

  const hideOverlappingActivities = activities => {
    const checkedActivities = activities.filter(":has(:checked)");
    const unCheckedActivities = activities.filter(":not(:has(:checked))");

    let checkedActivityTimes = [];
    for (let checkedActivity of checkedActivities) {
      const checkedActivityTime = getActivityValues(checkedActivity.textContent)
        .time;
      checkedActivityTimes.push(checkedActivityTime);
    }

    for (let activity of unCheckedActivities) {
      activity = $(activity);

      const activityTime = getActivityValues(activity.text()).time;
      const activityCheckbox = activity.children();

      if (checkedActivityTimes.includes(activityTime)) {
        activityCheckbox.attr("disabled", true);
        activityCheckbox.attr("checked", false);
      } else {
        activityCheckbox.attr("disabled", false);
      }
    }
  };

  const calculateCost = activities => {
    let totalAmt = 0;

    for (let activity of activities) {
      activity = $(activity);

      const labelText = activity.text();
      const checkBox = activity.children();

      const activityValues = getActivityValues(labelText);

      if (checkBox.is(":checked")) {
        totalAmt += activityValues.cost;
      }
    }

    return totalAmt;
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

  const setTotalVal = totalAmt => {
    totalEl.text(`Total Cost: $${totalAmt}`);
  };

  const appendWorkshopTotalEl = parentEl => {
    setTotalVal(0);

    parentEl.append(totalEl);
    return totalEl;
  };

  return {
    setActivityPanel
  };
})(jQuery);

const run = () => {
  focusFirstField();
  showOtherJobRoleField();
  settShirtInfo();
  activityRegisterPanel.setActivityPanel();
};
run();
