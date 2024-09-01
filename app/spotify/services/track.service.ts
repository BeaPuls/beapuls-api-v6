import Profile from '#profile/models/profile'
import Track from '#profile/models/track'
import { inject } from '@adonisjs/fold'

@inject()
export default class TrackService {
  async saveTracks(profileId: Profile['id'], tracks: any[]) {
    for (let track of tracks) {
      const newTrack = new Track()
      newTrack.name = track.name
      newTrack.providerItemId = track.id
      newTrack.providerItemImage =
        track?.album?.images && track?.album?.images.length ? track?.album?.images[0]?.url : null
      newTrack.providerItemUri = track.uri
      newTrack.artistName =
        track?.artists && track?.artists.length
          ? track?.artists.map((artist: any) => artist.name).join(', ')
          : null
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

  async updateFavoriteTracks(profileId: Profile['id'], tracks: any[]) {
    const deletedTracks = await Track.query().where('profile_id', profileId).delete()

    for (const track of tracks) {
      await Track.updateOrCreate(
        { profileId, providerItemId: track.id },
        {
          name: track.name,
          providerItemImage: track.album?.images?.[0]?.url || null,
          providerItemUri: track.uri,
          artistName: track.artists?.map((artist: any) => artist.name).join(', ') || null,
          albumName: track.album?.name,
        }
      )
    }
  }
}
