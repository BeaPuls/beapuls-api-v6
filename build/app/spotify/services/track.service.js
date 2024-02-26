var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Track from '#profile/models/track';
import { inject } from '@adonisjs/fold';
let TrackService = class TrackService {
    async saveTracks(profileId, tracks) {
        for (let track of tracks) {
            const newTrack = new Track();
            newTrack.name = track.name;
            newTrack.spotifyId = track.id;
            newTrack.spotifyImage = track.album?.images[0].url;
            newTrack.spotifyUri = track.uri;
            newTrack.artistName = track.artists?.name;
            newTrack.albumName = track.album?.name;
            newTrack.profileId = profileId;
            await newTrack.save();
        }
    }
    getTracksData(tracks) {
        const mappdTracks = tracks?.map((track) => {
            return {
                name: track.name,
                trackId: track.id,
                album: track?.albumName,
                artist: track?.artistName,
            };
        });
        return mappdTracks;
    }
    async updateFavoriteTracks(profileId, trackIds) {
        const markFavorite = await Track.query()
            .where('profile_id', profileId)
            .whereIn('spotify_id', trackIds);
        return {
            data: markFavorite,
        };
    }
};
TrackService = __decorate([
    inject()
], TrackService);
export default TrackService;
//# sourceMappingURL=track.service.js.map