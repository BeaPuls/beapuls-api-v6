var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import AuthProviders from '#auth/models/auth_providers';
import User from '#auth/models/user';
import Artist from '#profile/models/artist';
import Track from '#profile/models/track';
import ProfileService from '#profile/services/profile.service';
import ArtistService from '#spotify/services/artist.service';
import SpotifyService from '#spotify/services/spotify.service';
import TrackService from '#spotify/services/track.service';
import env from '#start/env';
import { inject } from '@adonisjs/core';
import { Exception } from '@poppinss/utils';
import { DateTime } from 'luxon';
let SpotifyController = class SpotifyController {
    profileService;
    spotifyService;
    trackService;
    artistService;
    constructor(profileService, spotifyService, trackService, artistService) {
        this.profileService = profileService;
        this.spotifyService = spotifyService;
        this.trackService = trackService;
        this.artistService = artistService;
    }
    async authorize({ ally }) {
        return ally.use('spotify').stateless().redirect();
    }
    async useSpotify(ally) {
        const spotify = ally.use('spotify').stateless();
        if (spotify.accessDenied()) {
            throw new Exception('Access was denied');
        }
        if (spotify.stateMisMatch()) {
            throw new Exception('Request expired. try again');
        }
        if (spotify.hasError()) {
            console.log('useSpotify : ', spotify.getError());
            throw new Exception('something went wrong with provider');
        }
        try {
            return await spotify.user();
        }
        catch (err) {
            throw new Exception('External error');
        }
    }
    async callback({ ally, response }) {
        const { token, email, id: providerUserId, nickName, avatarUrl } = await this.useSpotify(ally);
        const user = await User.firstOrCreate({
            email: email,
        }, {
            email: email,
            username: nickName,
        });
        await AuthProviders.updateOrCreate({
            name: 'spotify',
            userId: user.id,
        }, {
            accessToken: token.token,
            refreshToken: token.refreshToken,
            type: token.type,
            expiresIn: token.expiresIn,
            expiresAt: DateTime.fromJSDate(token.expiresAt),
            providerUserId,
        });
        const profile = await this.profileService.createUserProfile(user, avatarUrl);
        this.initializeUserData(profile.id, user.id);
        const authToken = await this.generateUserToken(user);
        response.redirect(this.success(authToken, user));
    }
    success(accessToken, user) {
        const url = new URL(env.get('SPOTIFY_SUCCESS_URL', `${env.get('BASE_API_URL')}/auth/success`));
        url.searchParams.append('userToken', accessToken.value.release());
        url.searchParams.append('userId', user.id);
        return url.toString();
    }
    async generateUserToken(user) {
        return User.accessTokens.create(user);
    }
    async initializeUserData(profileId, userId) {
        const trackExist = await Track.query().where('profile_id', userId);
        console.log(trackExist.length);
        console.log(profileId);
        if (!trackExist.length) {
            const topTracks = await this.spotifyService.getTracks(userId, 5);
            await this.trackService.saveTracks(profileId, topTracks);
        }
        const artistExist = await Artist.query().where('profile_id', userId);
        if (!artistExist.length) {
            const topArtists = await this.spotifyService.getArtists(userId, 5);
            await this.artistService.saveArtist(profileId, topArtists);
        }
    }
};
SpotifyController = __decorate([
    inject(),
    __metadata("design:paramtypes", [ProfileService,
        SpotifyService,
        TrackService,
        ArtistService])
], SpotifyController);
export default SpotifyController;
//# sourceMappingURL=auth_spotify.controller.js.map