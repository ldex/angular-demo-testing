import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog-service';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('DialogService', () => {
  let service: DialogService;
  let confirmSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create a mock for window.confirm
    confirmSpy = vi.fn();

    // Stub the global 'confirm' function
    vi.stubGlobal('confirm', confirmSpy);

    TestBed.configureTestingModule({
      providers: [DialogService],
    });
    service = TestBed.inject(DialogService);
  });

  afterEach(() => {
    // Cleanup to prevent affecting other tests
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should return true when the user confirms', async () => {
    confirmSpy.mockReturnValue(true);

    const result = await service.confirm('Are you sure?');

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure?');
    expect(result).toBe(true);
  });

  it('should return false when the user cancels', async () => {
    confirmSpy.mockReturnValue(false);

    const result = await service.confirm('Delete item?');

    expect(confirmSpy).toHaveBeenCalledWith('Delete item?');
    expect(result).toBe(false);
  });

  it('should use default message if no message is provided', async () => {
    confirmSpy.mockReturnValue(true);

    await service.confirm();

    expect(confirmSpy).toHaveBeenCalledWith('Is it OK?');
  });
});