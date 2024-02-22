/**
 *
 * @export
 * @interface TrackObject
 */
export interface TrackObject {
  /**
   *
   * @type {SimplifiedAlbumObject}
   * @memberof TrackObject
   */
  album?: SimplifiedAlbumObject
  /**
   * The artists who performed the track. Each artist object includes a link in `href` to more detailed information about the artist.
   * @type {Array<ArtistObject>}
   * @memberof TrackObject
   */
  artists?: Array<ArtistObject>
  /**
   * A list of the countries in which the track can be played, identified by their [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code.
   * @type {Array<string>}
   * @memberof TrackObject
   */
  available_markets?: Array<string>
  /**
   * The disc number (usually `1` unless the album consists of more than one disc).
   * @type {number}
   * @memberof TrackObject
   */
  disc_number?: number
  /**
   * The track length in milliseconds.
   * @type {number}
   * @memberof TrackObject
   */
  duration_ms?: number
  /**
   * Whether or not the track has explicit lyrics ( `true` = yes it does; `false` = no it does not OR unknown).
   * @type {boolean}
   * @memberof TrackObject
   */
  explicit?: boolean
  /**
   *
   * @type {ExternalIdObject}
   * @memberof TrackObject
   */
  external_ids?: ExternalIdObject
  /**
   *
   * @type {ExternalUrlObject}
   * @memberof TrackObject
   */
  external_urls?: ExternalUrlObject
  /**
   * A link to the Web API endpoint providing full details of the track.
   * @type {string}
   * @memberof TrackObject
   */
  href?: string
  /**
   * The [Spotify ID](/documentation/web-api/concepts/spotify-uris-ids) for the track.
   * @type {string}
   * @memberof TrackObject
   */
  id?: string
  /**
   * Part of the response when [Track Relinking](/documentation/web-api/concepts/track-relinking) is applied. If `true`, the track is playable in the given market. Otherwise `false`.
   * @type {boolean}
   * @memberof TrackObject
   */
  is_playable?: boolean
  /**
   * Part of the response when [Track Relinking](/documentation/web-api/concepts/track-relinking) is applied, and the requested track has been replaced with different track. The track in the `linked_from` object contains information about the originally requested track.
   * @type {object}
   * @memberof TrackObject
   */
  linked_from?: object
  /**
   *
   * @type {TrackRestrictionObject}
   * @memberof TrackObject
   */
  restrictions?: TrackRestrictionObject
  /**
   * The name of the track.
   * @type {string}
   * @memberof TrackObject
   */
  name?: string
  /**
   * The popularity of the track. The value will be between 0 and 100, with 100 being the most popular.<br/>The popularity of a track is a value between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.<br/>Generally speaking, songs that are being played a lot now will have a higher popularity than songs that were played a lot in the past. Duplicate tracks (e.g. the same track from a single and an album) are rated independently. Artist and album popularity is derived mathematically from track popularity. _**Note**: the popularity value may lag actual popularity by a few days: the value is not updated in real time._
   * @type {number}
   * @memberof TrackObject
   */
  popularity?: number
  /**
   * A link to a 30 second preview (MP3 format) of the track. Can be `null`
   * @type {string}
   * @memberof TrackObject
   */
  preview_url?: string | null
  /**
   * The number of the track. If an album has several discs, the track number is the number on the specified disc.
   * @type {number}
   * @memberof TrackObject
   */
  track_number?: number
  /**
   * The object type: \"track\".
   * @type {string}
   * @memberof TrackObject
   */
  type?: TrackObjectTypeEnum
  /**
   * The [Spotify URI](/documentation/web-api/concepts/spotify-uris-ids) for the track.
   * @type {string}
   * @memberof TrackObject
   */
  uri?: string
  /**
   * Whether or not the track is from a local file.
   * @type {boolean}
   * @memberof TrackObject
   */
  is_local?: boolean
}
