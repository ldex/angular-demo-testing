// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  demo: true,
  offline: false
};

export const config = {
  apiUrl: 'https://storerestservice.azurewebsites.net/api',
  adminApiUrl: 'https://storerestservice.azurewebsites.net/api/admin',
  authUrl: 'https://demo2584715.mockable.io/api/login'
};