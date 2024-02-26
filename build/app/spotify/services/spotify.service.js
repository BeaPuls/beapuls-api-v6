import AuthProviders from '#auth/models/auth_providers';
import env from '#start/env';
import axios from 'axios';
export const BASE_PATH = env.get('SPOTIFY_URL');
export default class SpotifyService {
    async getArtists(userId, limit) {
        const authProvider = await AuthProviders.query().where('user_id', userId).first();
        const resp = await axios.get(`${BASE_PATH}/me/top/artists?time_range=medium_term&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${authProvider?.accessToken}`,
            },
        });
        return resp?.data?.items;
    }
    async getTracks(userId, limit) {
        const authProvider = await AuthProviders.query().where('user_id', userId).first();
        const resp = await axios.get(`${BASE_PATH}/me/top/tracks?time_range=medium_term&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${authProvider?.accessToken}`,
            },
        });
        return resp?.data?.items;
    }
    async getAlbums(userId, limit) {
        const authProvider = await AuthProviders.query().where('user_id', userId).first();
        const resp = await axios.get(`${BASE_PATH}/me/top/tracks?time_range=medium_term&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${authProvider?.accessToken}`,
            },
        });
        return resp?.data?.items;
    }
}
//# sourceMappingURL=spotify.service.js.map