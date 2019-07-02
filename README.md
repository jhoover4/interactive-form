# Interactive Form

Adding customized interactivity and validation for a fictional conference registration form using jQuery.

## Description

The form is progressively enhanced and can still be used without Javascript. Form errors are displayed at the top of each section in red and form inputs with errors are highlighted. 

Specific form enhancements detailed below by the section of the form.

Basic Info Section

- When the page first loads, the first text field should be in focus by default.
- Include a text field that will be revealed when the "Other" option is selected from the "Job Role" drop down menu.
- Name field can't be blank.

T-Shirt Section

- For the T-Shirt "Color" menu, only display the color options that match the design selected in the "Design" menu.
- When a new theme is selected from the "Design" menu, the "Color" field and drop down menu is updated.
- Hide the "Color" label and select menu until a T-Shirt design is selected from the "Design" menu.

Activities Section
- If the user selects a workshop, don't allow selection of a workshop at the same day and time -- you should disable the checkbox and visually indicate that the workshop in the competing time slot isn't available.
- Display total calculated for all activities.
- User must select at least one checkbox under the "Register for Activities" section of the form.

Payment Section

- Display payment sections based on the payment option chosen in the select menu.
- Credit Card field should only accept a number between 13 and 16 digits.
- The Zip Code field should accept a 5-digit number.
- The CVV should only accept a number that is exactly 3 digits long.