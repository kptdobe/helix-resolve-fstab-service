/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const { wrap } = require('@adobe/openwhisk-action-utils');
const { logger } = require('@adobe/openwhisk-action-logger');
const { wrap: status } = require('@adobe/helix-status');
const { MountConfig } = require('@adobe/helix-shared');

const { openWhiskWrapper } = require('epsagon');

const fetch = require('./fetch-fstab');

/**
 * This is the main function
 * @param {string} name name of the person to greet
 * @returns {object} a greeting
 */
async function main(params) {
  // Log params..
  const { __ow_logger: log } = params;

  const {
    owner, repo, ref, path
  } = params;

  log.info(`Params: ${JSON.stringify(params)}`);

  fstabContent = await fetch(params);
  log.info(`fstabContent: ${JSON.stringify(fstabContent)}`);

  mountFromjson = await new MountConfig().withJSON(fstabContent).init();

  return {
    body: `Fstab: ${JSON.stringify(fstabContent)} and mountFromjson: ${JSON.stringify(mountFromjson)}`
  };

  

  /*
  fstabContent.then(function (body) {
        // POST succeeded...
        return {
          body: `Fstab ${body}`,
        };
    })
    .catch(function (err) {
        // POST failed...
        return {
          body: `FAIL ${err}`,
        };
    });*/


}

module.exports.main = wrap(main)
  .with(openWhiskWrapper, {
    token_param: 'EPSAGON_TOKEN',
    appName: 'Helix Services',
    metadataOnly: false,
    ignoredKeys: [/^[A-Z0-9_]+$/, 'token'],
    urlPatternsToIgnore: ['api.coralogix.com'],
  })
  .with(status)
  .with(logger.trace)
  .with(logger);
