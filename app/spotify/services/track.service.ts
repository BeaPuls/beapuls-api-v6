import Profile from '#profile/models/profile'
import Track from '#profile/models/track'
import { inject } from '@adonisjs/fold'

@inject()
export default class TrackService {
  async saveTracks(profileId: Profile['id'], tracks: any[]) {
    for (let track of tracks) {
      const newTrack = new Track()
      newTrack.name = track.name
      newTrack.spotifyId = track.id
      newTrack.spotifyImage = track.album?.images[0].url
      newTrack.spotifyUri = track.uri
      newTrack.artistName = track.artists?.name
      newTrack.albumName = track.album?.name
      newTrack.profileId = profileId
      await newTrack.save()
    }
  }

  getTracksData(tracks: Track[]) {
    const mappdTracks = tracks?.map((track) => {
      return {
        // popularity: track.po,
        name: track.name,
        trackId: track.id,
        album: track?.albumName,
        artist: track?.artistName,
      }
    })

    return mappdTracks
  }

  async updateFavoriteTracks(profileId: Profile['id'], trackIds: Track['id'][]) {
    // TODO ??
    const markFavorite = await Track.query()
      .where('profile_id', profileId)
      .whereIn('spotify_id', trackIds)

    return {
      data: markFavorite,
    }
  }
}
