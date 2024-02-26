var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Artist from '#profile/models/artist';
import { inject } from '@adonisjs/fold';
let ArtistService = class ArtistService {
    async saveArtist(profileId, artists) {
        for (let artist of artists) {
            const newArtist = new Artist();
            newArtist.name = artist.name;
            newArtist.spotifyId = artist.id;
            newArtist.spotifyImage = artist.album?.images[0].url;
            newArtist.spotifyUri = artist.uri;
            newArtist.popularity = artist.popularity;
            newArtist.followers = artist.followers?.total;
            newArtist.profileId = profileId;
            await newArtist.save();
        }
    }
    getArtistsData(artists) {
        const mappdArtists = artists?.map((artist) => {
            return {
                name: artist.name,
                artistId: artist.id,
            };
        });
        return mappdArtists;
    }
    async updateFavoriteArtists(profileId, artistIds) {
        const markFavorite = await Artist.query()
            .where('profile_id', profileId)
            .whereIn('spotify_id', artistIds);
        return {
            data: markFavorite,
        };
    }
};
ArtistService = __decorate([
    inject()
], ArtistService);
export default ArtistService;
//# sourceMappingURL=artist.service.js.map