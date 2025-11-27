You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Testing

- Tests should rely on Vitest in a zoneless Angular app
- The old Angular helpers waitForAsync(), fakeAsync() and tick() should not be used
- Replace the usage of waitForAsync() with async/await
- Avoid using the done callback pattern, use async/await instead
- Use vi.spyOn() for spies
- Use the Angular TestBed as a prefered way to test services and components
- For HttpClient based code testing: configure the tests to rely on a TestBed configured with those providers: provideHttpClient() and provideHttpClientTesting() ans inject the HttpTestingController
- Avoid using fakeAsync and prefer using Vitest's fake timers instead
- For testing routed components, use RouterTestingHarness which provides a cleaner API and eliminates the need for test host components
- Do not mock Angular Router - Instead, provide real route configurations and use the harness to navigate
- Router navigation is asynchronous. Use async/await to properly handle timing
