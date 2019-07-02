"use strict";

const runValidations = (elToAppendTo, validationFunctions) => {
  let errors = [];

  for (const errorFn of validationFunctions) {
    const errorStr = errorFn();

    if (errorStr !== "") {
      errors.push(errorStr);
    }
  }

  const existingErrHtml = elToAppendTo.children(".error");

  if (errors.length > 0) {
    if (existingErrHtml.length) {
      existingErrHtml.text("Errors: " + errors.join(" "));
    } else {
      const errHtml = $(`<p class='error'>Errors: ${errors.join(" ")}</p>`);
      elToAppendTo.prepend(errHtml);
    }
  } else {
    existingErrHtml.remove();
  }

  return errors.length === 0;
};

const validateInputWithRegex = (selector, regex, errorMessage) => {
  return () => {
    const field = $(selector);

    if (!field.val().match(regex)) {
      field.addClass("field-error");
      return errorMessage;
    } else {
      field.removeClass("field-error");
    }

    return "";
  };
};

const basicInfoPanel = (function($) {
  const setPanel = () => {
    focusFirstField();
    showOtherJobRoleField();
  };

  const validations = () => {
    const panel = $("#basic-info-panel");
    const checkNameFieldNotBlank = validateInputWithRegex(
      "#name",
      /^[a-zA-Z\s]+$/,
      "Name field must be filled."
    );
    const checkValidEmail = validateInputWithRegex(
      "#mail",
      /^\S+@\S+\.\w+$/,
      "Email is not valid."
    );

    return runValidations(panel, [checkNameFieldNotBlank, checkValidEmail]);
  };

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

  return {
    setPanel,
    validations
  };
})(jQuery);

const tShirtPanel = (function($) {
  const tShirtSelectParent = $("#colors-js-puns");
  const $designSelect = $("#design");

  const setPanel = () => {
    settShirtInfo();
    hideColorUntilSelected();
  };

  const settShirtInfo = () => {
    const tShirtColorSelect = $("#color");

    const jsPunOptions = ["cornflowerblue", "darkslategrey", "gold"];
    const iHeartJsOptions = ["tomato", "steelblue", "dimgrey"];

    $designSelect.change(() => {
      let filterArr = [];
      if ($designSelect.val() === "js puns") {
        filterArr = jsPunOptions;
      } else if ($designSelect.val() === "heart js") {
        filterArr = iHeartJsOptions;
      }

      if (filterArr.length) {
        tShirtSelectParent.show();
        tShirtColorSelect.val(filterArr[0]);

        for (let colorChoice of tShirtColorSelect.children()) {
          colorChoice = $(colorChoice);
          colorChoice.show();

          if (!filterArr.includes(colorChoice.val())) {
            colorChoice.hide();
          }
        }
      } else {
        tShirtSelectParent.hide();
      }
    });
  };

  const hideColorUntilSelected = () => {
    tShirtSelectParent.hide();
  };

  return {
    setPanel
  };
})(jQuery);

const activityRegisterPanel = (function($) {
  const activityPanel = $(".activities");
  const activities = activityPanel.find("label");
  const totalEl = $("<p></p>");

  const setPanel = () => {
    appendWorkshopTotalEl(activityPanel);
    setActivityCheckEvent();
  };

  const setActivityCheckEvent = () => {
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

  const validations = () => {
    return runValidations(activityPanel, [checkIfActivitySelected]);
  };

  const checkIfActivitySelected = () => {
    if (activities.children(":checkbox:checked").length === 0) {
      return "Must have one activity checked.";
    }

    return "";
  };

  return {
    setPanel,
    validations
  };
})(jQuery);

const paymentPanel = (function($) {
  const paymentSelect = $("#payment");

  const setPanel = () => {
    paymentSelect.val("credit card");
    hideShowInfoDivs("credit card");

    paymentSelect.change(e => {
      const selectedValue = $(e.target).val();
      hideShowInfoDivs(selectedValue);
    });
  };

  const validations = () => {
    const panel = $("#payment-panel");

    const checkCreditCardZip = validateInputWithRegex(
      "#zip",
      /^\d{5}$/,
      "Not a valid zip code."
    );
    const checkCreditCardCvv = validateInputWithRegex(
      "#cvv",
      /^\d{3}$/,
      "Not a valid cvv number."
    );

    if (paymentSelect.val() === "credit card") {
      return runValidations(panel, [
        checkCreditCardNumber,
        checkCreditCardZip,
        checkCreditCardCvv
      ]);
    }
  };

  const hideShowInfoDivs = selectedVal => {
    const paymentSectionMap = new Map();
    paymentSectionMap.set("credit card", $("#credit-card"));
    paymentSectionMap.set("paypal", $("#paypal-info"));
    paymentSectionMap.set("bitcoin", $("#bitcoin-info"));

    for (let [key, sectionEl] of paymentSectionMap) {
      if (key === selectedVal) {
        sectionEl.show();
      } else {
        sectionEl.hide();
      }
    }
  };

  const checkCreditCardNumber = () => {
    const creditCardNumberField = $("#cc-num");
    const regex = /^\d{13,16}$/;
    let errorMsg = "";

    if (!creditCardNumberField.val().match(regex)) {
      creditCardNumberField.addClass("field-error");

      if (creditCardNumberField.val() === "") {
        errorMsg = "Credit card field is empty.";
      } else {
        errorMsg =
          "Please enter a credit card number that is between 13 and 16 digits long.";
      }
    } else {
      creditCardNumberField.removeClass("field-error");
    }

    return errorMsg;
  };

  return {
    setPanel,
    validations
  };
})(jQuery);

(function() {
  basicInfoPanel.setPanel();
  tShirtPanel.setPanel();
  activityRegisterPanel.setPanel();
  paymentPanel.setPanel();
})();

$("form").submit(e => {
  const basicInfoPassed = basicInfoPanel.validations();
  const activityRegisterPassed = activityRegisterPanel.validations();
  const paymentPanelPassed = paymentPanel.validations();

  if (!basicInfoPassed || !activityRegisterPassed || !paymentPanelPassed) {
    e.preventDefault();
  }
});
