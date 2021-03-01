import { FavouriteService } from './favourite.service';

// Basics tests outside Angular
describe('Favourite Service', () => {
    let service: FavouriteService;

    beforeEach(() => { service = new FavouriteService(); });

    it('should have 0 favourite', () => {
        expect(service.favourites.size).toBe(0);
    });

    it('should have custom', () => {
        expect("test").toStartWith("to");
    });

    it('should have 1 favourite', () => {
        let p = {
            name: 'Trek SSL 2015',
            price: 999.9,
            description: 'Racing bike.',
            discontinued: false,
            fixedPrice: false,
            imageUrl: '',
            modifiedDate: new Date('2016-05-08')
        };
        service.addToFavourites(p);

        expect(service.favourites.size).toBe(1);
    });

    it('should get favourites number', () => {

        expect(service.getFavouritesNb()).toBe(0);

        let p = {
            name: 'Trek SSL 2015',
            price: 999.9,
            description: 'Racing bike.',
            discontinued: false,
            fixedPrice: false,
            imageUrl: '',
            modifiedDate: new Date('2016-05-08')
        };
        service.addToFavourites(p);

        expect(service.getFavouritesNb()).toBe(1);
    });
});