# Automated Testing with Selenium, Cucumber, and JavaScript for Magento

This repository contains an example of automated tests using Selenium, Cucumber, and JavaScript for practicing and learning automation testing on the Magento demo site (https://magento.softwaretestingboard.com/).

## Tutorial

### Prerequisites
- Node.js installed on your machine
- Git installed on your machine
- Latest Chrome browser installed
- Log in as a registered user and remove all items in your cart
- Change the email and password for the login step with yours

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ahmadrymera/magentoSelenium
   ```

2. **Navigate to the Repository Directory**
   ```bash
   cd magentoSelenium
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the Test**
   ```bash
   npm test
   ```
   This command will execute the automated tests using Selenium and Cucumber.

## Test Structure
The test scenarios are written in Gherkin language using Cucumber, and the automation scripts are implemented in JavaScript with Selenium WebDriver.

## Test Scenarios
The test scenarios cover various functionalities of the Magento demo site, including user authentication, product addition to the cart, and the checkout process.

Feel free to explore and modify the scenarios based on your learning goals.

## Note
This repository is intended for educational purposes and practice in automation testing. Ensure that you have the necessary permissions to run tests on external websites. The Magento demo site used here is publicly accessible for testing.

Happy learning and happy testing!