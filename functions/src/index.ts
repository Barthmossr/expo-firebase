import { setGlobalOptions } from 'firebase-functions/v2/options'
import { onRequest } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'

setGlobalOptions({ region: 'southamerica-east1', maxInstances: 10 })

export const health = onRequest({ cors: true }, (request, response) => {
  logger.info('healthcheck', { path: request.path })
  response
    .status(200)
    .json({ status: 'ok', timestamp: new Date().toISOString() })
})
