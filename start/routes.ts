/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// import HealthCheck from 'Adonis/Core/HealthCheck'

router.get('/', async ({response}) => response.ok({uptime: Math.round(process.uptime())}))


router.get('health', async ({ response }) => {
    // const report = await HealthCheck.getReport()
  
    // return report.healthy
    //   ? response.ok(report)
    //   : response.badRequest(report)
    response.noContent()
  })
  