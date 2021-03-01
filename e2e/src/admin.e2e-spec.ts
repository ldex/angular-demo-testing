import { AdminPage } from './admin.po';

describe('Admin', () => {
  let page: AdminPage;

  beforeEach(async() => {
    page = new AdminPage();
    await page.navigateTo();
  });

  it('Unauthenticated users should not access Admin', async() => {
    page.getAdminMenuElement().click();
    expect(page.getTitle()).toEqual('Login');
  });
});
