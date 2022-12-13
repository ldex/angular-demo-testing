import { Product } from '../products/product.interface';
import { FavouriteService } from './favourite.service';

// Basics tests outside Angular
describe('Favourite Service', () => {
    let service: FavouriteService;
    let fakeProduct: Product;

    beforeAll(() => {
        fakeProduct = {
            name: 'Trek SSL 2015',
            price: 999.9,
            description: 'Racing bike.',
            discontinued: false,
            fixedPrice: false,
            imageUrl: '',
            modifiedDate: new Date(2021, 3, 2)
        }
    })

    beforeEach(() => { service = new FavouriteService(); });

    it('should have 0 favourite', () => {
        expect(service.favourites.size).toBe(0);
    });

    it('should have 1 favourite when adding 1', () => {
        service.addToFavourites(fakeProduct);
        expect(service.favourites.size).toBe(1);
    });

    it('should get favourites number', () => {
        expect(service.getFavouritesNb()).toBe(0);
        service.addToFavourites(fakeProduct);
        expect(service.getFavouritesNb()).toBe(1);
    });
});