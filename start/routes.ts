import { middleware } from '#start/kernel'
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#auth/controllers/auth.controller')
const ProfileController = () => import('#profile/controllers/profile.controller')
const AuthSpotifyController = () => import('#auth/controllers/auth_spotify.controller')
const SpotifyController = () => import('#spotify/controllers/spotify.controller')
const AlbumController = () => import('#album/controllers/album.controller')
const ArtistController = () => import('#artist/controllers/artist.controller')
const TrackController = () => import('#track/controllers/track.controller')
const TrackCommentController = () => import('#comment/track/controllers/track_comment.controller')
const AlbumCommentController = () => import('#comment/album/controllers/album_comment.controller')
const ArtistCommentController = () =>
  import('#comment/artist/controllers/artist_comment.controller')
const SearchController = () => import('#search/controllers/search.controller')
const CommentController = () => import('#comment/controllers/comment.controller')

router.get('/', async ({ response }: HttpContext) =>
  response.ok({ uptime: Math.round(process.uptime()) })
)

router.get('/health', async ({ response }: HttpContext) => {
  response.noContent()
})

router
  .group(() => {
    router
      .group(() => {
        // Unlogged
        // Auth - User
        router.post('login', [AuthController, 'login'])
        router.post('register', [AuthController, 'register'])

        // Auth - Spotify
        router.get('spotify', [AuthSpotifyController, 'authorize'])
        router.get('spotify/callback', [AuthSpotifyController, 'callback'])

        // Others
        router.get('success', [AuthController, 'success'])

        // Logged
        router
          .group((): void => {
            router.post('logout', [AuthController, 'logout'])
          })
          .use(
            middleware.auth({
              guards: ['api'],
            })
          )
      })
      .prefix('auth')

    router
      .group(() => {
        router
          .group(() => {
            router.get('profile', [ProfileController, 'getUserProfile'])
            router.post('profile', [ProfileController, 'createUserProfile'])
            router.get('profile/avatar', [ProfileController, 'getUserAvatar'])
            router.post('profile/avatar', [ProfileController, 'uploadUserAvatar'])
          })
          .prefix('user')

        router
          .group(() => {
            router.get('search', [SpotifyController, 'search'])
          })
          .prefix('spotify')

        router.group(() => {
          router.get('search', [SearchController, 'search'])
        })

        router.group(() => {
          router.get('albums', [AlbumController, 'findAll'])
          router.post('albums/:id', [AlbumController, 'findOne'])
          router.post('albums', [AlbumController, 'create']).use(middleware.role(['Admin']))
          router.put('albums/:id', [AlbumController, 'update']).use(middleware.role(['Admin']))
          router.delete('albums/:id', [AlbumController, 'remove']).use(middleware.role(['Admin']))
          // router.get('albums/search', [AlbumController, 'findBySearch'])
          router.get('albums/provider/:providerId', [AlbumController, 'findOneByProviderId'])
          router
            .post('albums/:id/vote/:voteType', [AlbumController, 'toggleVote'])
            .use(middleware.role(['Admin', 'User']))
        })

        router.group(() => {
          router.get('artists', [ArtistController, 'findAll'])
          router.post('artists/:id', [ArtistController, 'findOne'])
          router.post('artists', [ArtistController, 'create']).use(middleware.role(['Admin']))
          router.put('artists/:id', [ArtistController, 'update']).use(middleware.role(['Admin']))
          router.delete('artists/:id', [ArtistController, 'remove']).use(middleware.role(['Admin']))
          // router.get('artists/search', [ArtistController, 'findBySearch'])
          router.get('artists/provider/:providerId', [ArtistController, 'findOneByProviderId'])
          router
            .post('artists/:id/vote/:voteType', [ArtistController, 'toggleVote'])
            .use(middleware.role(['Admin', 'User']))
        })

        router.group(() => {
          router.get('tracks', [TrackController, 'findAll'])
          router.post('tracks/:id', [TrackController, 'findOne'])
          router.post('tracks', [TrackController, 'create']).use(middleware.role(['Admin']))
          router.put('tracks/:id', [TrackController, 'update']).use(middleware.role(['Admin']))
          router.delete('tracks/:id', [TrackController, 'remove']).use(middleware.role(['Admin']))
          // router.get('tracks/search', [TrackController, 'findBySearch'])
          router.get('tracks/provider/:providerId', [TrackController, 'findOneByProviderId'])
          router
            .post('tracks/:id/vote/:voteType', [TrackController, 'toggleVote'])
            .use(middleware.role(['Admin', 'User']))
        })

        router
          .group(() => {
            router.get('user/last-comments', [CommentController, 'getLastUserComments'])

            router.group(() => {
              router.get('track', [TrackCommentController, 'findAll'])
              router.get('track/:id', [TrackCommentController, 'findOne'])
              router
                .post('tracks/track/:trackId', [TrackCommentController, 'create'])
                .use(middleware.role(['Admin', 'User']))
              router
                .put('track/:id', [TrackCommentController, 'update'])
                .use(middleware.role(['Admin', 'User']))
              router
                .delete('track/:id', [TrackCommentController, 'remove'])
                .use(middleware.role(['Admin', 'User']))
              router
                .post('track/:id/vote/:voteType', [TrackCommentController, 'toggleVote'])
                .use(middleware.role(['Admin', 'User']))
            })
            router.group(() => {
              router.get('album', [AlbumCommentController, 'findAll'])
              router.get('album/:id', [AlbumCommentController, 'findOne'])
              router
                .post('albums/album/:albumId', [AlbumCommentController, 'create'])
                .use(middleware.role(['Admin', 'User']))
              router
                .put('album/:id', [AlbumCommentController, 'update'])
                .use(middleware.role(['Admin', 'User']))
              router
                .delete('album/:id', [AlbumCommentController, 'remove'])
                .use(middleware.role(['Admin', 'User']))
              router
                .post('album/:id/vote/:voteType', [AlbumCommentController, 'toggleVote'])
                .use(middleware.role(['Admin', 'User']))
            })
            router.group(() => {
              router.get('artist', [ArtistCommentController, 'findAll'])
              router.get('artist/:id', [ArtistCommentController, 'findOne'])
              router
                .post('artists/artist/:artistId', [ArtistCommentController, 'create'])
                .use(middleware.role(['Admin', 'User']))
              router
                .put('artist/:id', [ArtistCommentController, 'update'])
                .use(middleware.role(['Admin', 'User']))
              router
                .delete('artist/:id', [ArtistCommentController, 'remove'])
                .use(middleware.role(['Admin', 'User']))
              router
                .post('artist/:id/vote/:voteType', [ArtistCommentController, 'toggleVote'])
                .use(middleware.role(['Admin', 'User']))
            })
          })
          .prefix('comments')
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .prefix('api')
