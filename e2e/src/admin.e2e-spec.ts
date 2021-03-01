import { browser, by, element } from 'protractor';

describe('Admin', () => {

  beforeEach(async() => {
    await browser.get('/admin');
  });

  it('Authenticated users should not access Admin', async() => {
    const title = element(by.css('app-root h2')).getText();
    expect(title).toBe("Login");
  });
});
