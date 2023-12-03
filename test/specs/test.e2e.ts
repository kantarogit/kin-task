import { expect } from "@wdio/globals";
import BrokerPage from "../pageobjects/brokers.page";

describe("Brokers search", async function() {
  //set timeout to 10 minutes because it takes a long time to load all brokers
  this.timeout(600000);
  it("should return 2 phone numbers for each broker", async function() {
    browser.maximizeWindow();
    await BrokerPage.open();
    await BrokerPage.loadMoreResults();
    await BrokerPage.waitUntilBrokersLoaded();
    let brokerNames = await BrokerPage.getBrokerNames();

    //some form of soft assertion
    //for each broker, check if there are 2 phone numbers, if not, add to errors array
    let errors = [];

    for (const brokerName of brokerNames) {
      await BrokerPage.searchBroker(brokerName);
      await BrokerPage.waitForBrokerToLoad();
      let phones = await BrokerPage.phoneNumbers;
      try {
        expect(phones.length).toEqual(2);
      } catch (error) {
        errors.push(`Error for broker ${brokerName}}`);
      }
    }

    //print errors if any, otherwise test passes
    //the error would list all the brokers that don't have 2 phone numbers
    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
  });
});
