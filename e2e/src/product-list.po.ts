import { browser, by, element } from 'protractor';

export class ProductListPage {
  async navigateTo() {
    return await browser.get('/products');
  }

  getTitle() {
    return element(by.css('app-root h2')).getText();
  }

  async getProductListElements() {
    return await element.all(by.css('.productItem'));
  }

  async getFirstProductNameElement() {
    return await element(by.css('.productItem .name'));
  }

  getSortByNameButtonElement() {
    return element(by.css('.sortByName'));
  }
}
