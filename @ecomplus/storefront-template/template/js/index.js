import { name, version } from './../../package.json'
import './lib/config'
import { events } from './lib/emitter'
import '@ecomplus/storefront-twbs'

import './lib/utils'
import './lib/lazy-load'
import './lib/glide-slides'
import './lib/menu'
import './lib/header'
import './lib/search'
import './lib/persist-utm'

import lozad from 'lozad'
import Vue from 'vue'
import * as cloneDeep from 'lodash.clonedeep'
import * as merge from 'lodash.merge'
import Glide from '@glidejs/glide'

import $ from './lib/$'
import $overlay from './lib/$overlay'

import './lib/load-widgets'

window.lozad = lozad
window.Vue = Vue
window._ = { cloneDeep, merge }
window.Glide = Glide
window.$ = $

Vue.config.productionTip = false

window.storefront = {
  $overlay,
  settings: window._settings,
  info: window._info,
  widgets: window._widgets,
  context: window._context,
  data: window._data,
  ...events
}

setTimeout(() => {
  import(/* webpackPreload: true */ './lib/fetch-info').catch(console.error)
}, 300)

if (window.pluginPhotoswipe) {
  import('./lib/photoswipe').catch(console.error)
}

const { hash } = window.location
if (hash.indexOf('_token=') !== -1 || hash.indexOf('error=access_denied') !== -1) {
  const $netlifyIdentityScript = document.createElement('script')
  $netlifyIdentityScript.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js'
  document.body.appendChild($netlifyIdentityScript)
}

console.log(`// TEMPLATE => ${name}@${version}`)
