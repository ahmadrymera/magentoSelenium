// Import necessary modules from Cucumber and Selenium WebDriver
const { Given, When, Then, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { Builder, By, until } = require("selenium-webdriver");

// Set a default timeout for the steps
setDefaultTimeout(60 * 1000);

let isGuest;
let driver;

// Set up WebDriver before running scenarios
Before(async () => {
  driver = new Builder().forBrowser("chrome").build();
});

// Close the WebDriver after running scenarios
After(async () => {
  await driver.quit();
});

// Step: Given the user logs in with the provided data
Given("the user logged in with the following data:", async (dataTable) => {
  const data = dataTable.rowsHash();

  if (data["email"] == "guest") {
    isGuest = true;
    // Open the Magento Demo homepage for guest users
    await driver.get("https://magento.softwaretestingboard.com");
  } else {
    isGuest = false;
    // Open the login page for registered users
    await driver.get("https://magento.softwaretestingboard.com/customer/account/login/");
    // Enter user credentials and log in
    await driver.findElement(By.id("email")).sendKeys(data["email"]);
    await driver.findElement(By.id("pass")).sendKeys(data["password"]);
    await driver.findElement(By.id("send2")).click();
    // Wait for the block dashboard to appear
    await driver.wait(until.elementLocated(By.className("block-dashboard-info"), 120000));
  }
});

// Step: When the user puts the specified items into the cart
When("the user puts the following items into the cart:", async (dataTable) => {
  const products = dataTable.hashes();

  for (const product of products) {
    // Open the product page based on the product name
    await driver.get("https://magento.softwaretestingboard.com/" + product.ProductName.replace(/\W+/g, "-") + ".html");

    // Wait for the product title
    await driver.wait(until.titleIs(product.ProductName), 120000);

    // Wait for the product options to appear
    await driver.wait(until.elementIsVisible(driver.findElement(By.className("swatch-opt")), 120000));

    // Handle product size if available
    const sizeElement = await driver.findElements(By.className("swatch-attribute size"));
    if (sizeElement.length > 0) {
      await driver.wait(until.elementIsVisible(sizeElement[0]), 120000);
      // Find and select the specified size
      const selectedSize = await sizeElement[0].findElement(
        By.xpath(`//div[@class='swatch-option text' and text()='${product.Size}']`)
      );
      await selectedSize.click();
    }

    // Handle product color if available
    const colorElement = await driver.findElements(By.className("swatch-attribute color"));
    if (colorElement.length > 0) {
      await driver.wait(until.elementIsVisible(colorElement[0]), 120000);
      // Find and select the specified color
      const selectedColor = await colorElement[0].findElement(
        By.xpath(`//div[@class='swatch-option color' and (@aria-label='${product.Color}')]`)
      );
      await selectedColor.click();
    }

    // Clear and set the quantity
    const qtyInput = await driver.findElement(By.id("qty"));
    await qtyInput.clear();
    await qtyInput.sendKeys(product.Qty);

    // Click "Add to Cart" button
    await driver.findElement(By.id("product-addtocart-button")).click();

    // Wait for the success message
    await driver.wait(
      until.elementLocated(By.xpath(`//div[contains(text(), 'You added ${product.ProductName} to your')]`)),
      120000
    );
  }
});

// Step: When the user navigates to the checkout page
When("the user is navigating to the checkout page", async () => {
  // Navigate to the checkout page
  await driver.get("https://magento.softwaretestingboard.com/checkout/#shipping");
  // Specify the element to wait for until it's not visible
  const elementToWaitFor = await driver.findElement(By.id("checkout-loader"));
  // Wait until the element is not visible
  await driver.wait(until.stalenessOf(elementToWaitFor), 120000);
});

// Step: When the user selects a shipping option
When("the user is selecting {string} Shipping option", async (shipping) => {
  // Select the specified shipping option
  await driver
    .findElement(By.css(`input[value='${shipping === "Flat Rate" ? "flatrate_flatrate" : "tablerate_bestway"}']`))
    .click();
});

// Step: When the user fills out checkout data with the provided information
When("the user is filling checkout data with the following data:", async (dataTable) => {
  const data = dataTable.rowsHash();
  // Fill out the checkout form with the provided data
  await driver.findElement(By.id("customer-email")).sendKeys(data["Email"]);
  await driver.findElement(By.name("firstname")).sendKeys(data["FirstName"]);
  await driver.findElement(By.name("lastname")).sendKeys(data["LastName"]);
  await driver.findElement(By.name("street[0]")).sendKeys(data["Address"]);
  await driver.findElement(By.name("city")).sendKeys(data["City"]);

  await driver.findElement(By.name("region_id")).click();
  await driver.findElement(By.xpath(`//option[text()='${data["State"]}']`)).click();

  await driver.findElement(By.name("postcode")).sendKeys(data["Zip"]);
  await driver.findElement(By.name("telephone")).sendKeys(data["PhoneNumber"]);
});

// Step: Then the transaction should be successful
Then("the Transaction should be success", async () => {
  // Click the "Next" button
  await driver.findElement(By.xpath(`//*[@id="shipping-method-buttons-container"]/div/button`)).click();

  // Wait until the button becomes accessible
  await driver.manage().setTimeouts({ implicit: 5000 });
  const placeOrderButton = await driver.findElement(By.css(".checkout > span"));
  // Click the "Place Order" button
  await driver.executeScript("arguments[0].click();", placeOrderButton);
  // Wait for the success message to appear
  await driver.wait(until.elementLocated(By.className("checkout-success"), 120000));
});
