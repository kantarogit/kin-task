import { $ } from "@wdio/globals";
import Page from "./page";

class BrokerPage extends Page {

  public get phoneNumbers() {
    return $$(".tel");
  }

  public async searchBroker(brokerName: string) {
    return $(".input-search").setValue(brokerName);
  }

  public get loadMore() {
    return $(".load-more-results-list");
  }

  public open() {
    return super.open("broker");
  }

  public async loadMoreResults() {
    await this.loadMore.waitForDisplayed({ timeout: 5000 });
    await this.loadMore.waitForClickable({ timeout: 5000 });
    return this.loadMore.click();
  }

  public async getBrokerNames() {
    const brokers = await $$(".name");
    let brokerNames = [];

    for (const broker of brokers) {
      let name = await broker.$("a").getText();
      brokerNames.push(name);
    }

    return brokerNames;
  }

  public async waitUntilBrokersLoaded() {
    return browser.waitUntil(
      async function () {
        //wait until the number of brokers is more than initial page load of 8 brokers
        return (await $$(".name")).length > 8;
      },
      {
        timeout: 5000,
        timeoutMsg: "expected some brokers to be loaded after 5s",
      }
    );
  }

  public async waitForBrokerToLoad() {
    const spinner = await $(".brokers-loading");
    try {
      await spinner.waitForDisplayed({ timeout: 10000 });
    } catch (error) {
      console.log("no spinner");
    }

    return await spinner.waitForDisplayed({ reverse: true, timeout: 10000 });
  }
}

export default new BrokerPage();
