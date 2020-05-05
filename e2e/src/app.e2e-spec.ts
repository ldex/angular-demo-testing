import { ProductListPage } from './product-list.po';

describe('Product List', () => {
  let page: ProductListPage;

  beforeEach(async() => {
    page = new ProductListPage();
    await page.navigateTo();
  });

  it('should display correct title', () => {
    expect(page.getTitle()).toEqual('Products');
  });

  it('should get the number of products', async() => {
    const list = await page.getProductListElements();
    expect(list.length).toBe(5);
  });

  it('should get the product name after sort', async() => {
    await page.getSortByNameButtonElement().click();
    const elem = await page.getFirstProductNameElement();
    expect(elem.getText()).toBe('665');
  });
});
