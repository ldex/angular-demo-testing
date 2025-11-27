import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductDetails } from './product-details';
import { ProductService } from '../product-service';
import { DialogService } from '../../core/dialog-service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('ProductDetails', () => {
  let fixture: ComponentFixture<ProductDetails>;
  let component: ProductDetails;

  const mockProduct = {
    id: 1,
    name: 'Product 1',
    price: 123,
    description: 'desc',
    discontinued: false,
    fixedPrice: false,
    modifiedDate: new Date(),
    imageUrl: '',
  };

  const productServiceMock = { deleteProduct: vi.fn() };
  const dialogServiceMock = { confirm: vi.fn() };
  const titleMock = { setTitle: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductDetails],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: Title, useValue: titleMock },
        { provide: ActivatedRoute, useValue: { data: of({ product: mockProduct }) } },
      ],
    });

    fixture = TestBed.createComponent(ProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
    vi.clearAllMocks();
  });

  it('calls ProductService.deleteProduct when dialog is confirmed', async () => {
    dialogServiceMock.confirm = vi.fn().mockResolvedValue(true);

    component.deleteProduct(mockProduct.id);
    await Promise.resolve(); // allow promise microtask to run

    expect(dialogServiceMock.confirm).toHaveBeenCalledWith('Are you sure to delete this product ?');
    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(mockProduct.id);
  });

  it('does not call deleteProduct when dialog is cancelled', async () => {
    dialogServiceMock.confirm = vi.fn().mockResolvedValue(false);

    component.deleteProduct(mockProduct.id);
    await Promise.resolve();

    expect(dialogServiceMock.confirm).toHaveBeenCalled();
    expect(productServiceMock.deleteProduct).not.toHaveBeenCalled();
  });
});