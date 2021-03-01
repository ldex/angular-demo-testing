import { ProductListPage } from './products.po';
import JasmineExpect from "jasmine-expect";

describe('Products', () => {
  let page: ProductListPage;

  beforeEach(async() => {
    page = new ProductListPage();
    await page.navigateTo();
  });

  it('should display correct title', () => {
    expect(page.getTitle()).toEqual('Products');
  });

  it('should display correct products number', () => {
    expect(page.getProductsNumber()).toEqual('10');
  });

  it('should display the correct number of products', async() => {
    const list = await page.getProductListElements();
    expect(list.length).toBe(5);
  });

  it('should display correctly the first product after sorting by name', async() => {
    await page.getSortByNameButtonElement().click();
    const elem = await page.getFirstProductNameElement();
    const productName = await elem.getText();
    expect(productName.toLowerCase().startsWith("a")).toBe(true);
  });

  //https://github.com/JamieMason/Jasmine-Matchers
});
