# Learner Data Processing Application

I designed this app to calculate metrics such as average scores and individual assignment scores for each learner. Additionally, it ensures data integrity by handling scenarios where scores exceed the maximum points possible for an assignment. Below are other key features.

## Key Features

* **Weighted Average Calculation:** Accurately determines learner's overall performance by considering the relative weights of different assignments.
* **Late Submission Handling:**  Applies a configurable penalty (default: 10%) to assignments submitted after their due dates.
* **Flexible Assignment Exclusion:**  Allows specific assignments to be omitted from calculations for individual learners, if needed.
* **Error Handling:** Incorporates validations to catch invalid input data, incorrect data types in the provided datasets, and potential errors during calculations (e.g., division by zero).
