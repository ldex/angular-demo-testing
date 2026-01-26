import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage-service';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { config } from '../../environments/environment';

describe('StorageService', () => {
  let service: StorageService;

  let storageMock: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // provide a clean stub for global localStorage so tests don't depend on real browser storage
    storageMock = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    // Using vi.stubGlobal is the modern, recommended way to handle localStorage
    // it completely isolates tests from the actual browser environment (or the JSDOM/HappyDOM storage) and prevents tests from "polluting" each other
    vi.stubGlobal('localStorage', storageMock as unknown as Storage);

    TestBed.configureTestingModule({
      providers: [StorageService],
    });
    service = TestBed.inject(StorageService);
  });

  afterEach(() => {
    // Cleanup to prevent affecting other tests
    vi.restoreAllMocks();
    // remove any global stubs
    vi.unstubAllGlobals();
  });

  it('storeToken calls localStorage.setItem with configured key and token', () => {
    const token = 'abc123';

    service.storeToken(token);

    expect(storageMock.setItem).toHaveBeenCalledWith(config.storageTokenKey, token);
  });

  it('getToken returns value from localStorage.getItem for configured key', () => {
    const token = 'token-value';
    storageMock.getItem.mockReturnValue(token);

    const result = service.getToken();

    expect(storageMock.getItem).toHaveBeenCalledWith(config.storageTokenKey);
    expect(result).toBe(token);
  });

  it('removeTokens calls localStorage.removeItem with configured key', () => {
    service.removeTokens();

    expect(storageMock.removeItem).toHaveBeenCalledWith(config.storageTokenKey);
  });
});