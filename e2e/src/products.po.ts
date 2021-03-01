import { browser, by, element } from 'protractor';

export class ProductListPage {
  async navigateTo() {
    return await browser.get('/products');
  }

  getTitle() {
    return element(by.css('app-root h2')).getText();
  }

  getProductsNumber() {
    return element(by.id('productsNumber')).getText();
  }

  async getProductListElements() {
    return await element.all(by.css('.productItem'));
  }

  async getFirstProductNameElement() {
    const list = await this.getProductListElements();
    return await list[0].element(by.css('.name'));
  }

  async getFirstProductPriceElement() {
    const list = await this.getProductListElements();
    return await list[0].element(by.css('.price'));
  }

  getSortByNameButtonElement() {
    return element(by.id('sortByName'));
  }

  getSortByDateButtonElement() {
    return element(by.id('sortByDate'));
  }

  getSortByPriceButtonElement() {
    return element(by.id('sortByPrice'));
  }
}
