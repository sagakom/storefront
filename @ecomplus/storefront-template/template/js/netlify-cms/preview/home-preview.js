import virtualDoc from './virtual-doc'
import displayWidget from './display-widget'
import fetchPage from './fetch-page'

export default class HomePreview extends window.React.Component {
  constructor () {
    super()
    this.state = {
      vDoc: '',
      html: ''
    }
  }

  componentDidMount () {
    this.fetchPage()
  }

  async fetchPage () {
    fetchPage('/index.html')
      .then(html => {
        const vDoc = virtualDoc(html)
        this.setState({ html, vDoc })
      })
      .catch(err => {
        console.log('Failed to fetch page:', err)
      })
  }

  render () {
    /* global h */
    const { vDoc } = this.state
    let newDoc = vDoc
    let html
    if (vDoc) {
      const { entry } = this.props
      const data = JSON.parse(entry.getIn(['raw']))

      // showcase
      if (!data.showcase || !data.showcase.length) {
        const $showcase = vDoc.querySelectorAll('[data-cms-if="home.showcase"]')
        $showcase[0].style.display = 'none'
      }

      if (!entry.getIn(['data', 'slider', 'slides', 0, 'img'])) {
        const $slider = vDoc.querySelectorAll('.glide')
        $slider[0].style.display = 'none'
      }

      // fix slider imagens
      this.props.widgetsFor('slider')
        .getIn(['data', 'slides'])
        .map(function (slider, index) {
          // set last img has preview for slider
          const img = slider.getIn(['img'])
          const $slider = vDoc.querySelectorAll('.glide')
          if (img) {
            $slider[0].classList.add(...['glide--ltr', 'glide--slider', 'glide--swipeable'])
            const $imgs = vDoc.querySelectorAll('.banner-slider img')
            for (let i = 0; i < $imgs.length; i++) {
              const $img = $imgs[i]
              $img.classList.remove()
              $img.classList.add(...['lozad', 'fade', 'img-fluid', 'show'])
              $img.setAttribute('src', img)
              $img.setAttribute('data-loaded', true)
            }
            $slider[0].style.display = 'block'
          } else {
            $slider[0].style.display = 'none'
          }
        })

      // fix carousel
      const $caroulse = vDoc.querySelectorAll('.products-carousel ul')
      if ($caroulse.length) {
        const $ul = $caroulse[0]
        $ul.classList.add(...['glide__slides', 'products-carousel__list'])
        const $glide = vDoc.querySelectorAll('.products-carousel .glide')
        if ($glide.length) {
          $glide[0].classList.add(...['glide--ltr', 'glide--slider', 'glide--swipeable'])
        }
        const childrens = $ul.children
        for (let i = 0; i < childrens.length; i++) {
          const child = childrens[i]
          child.style.width = '270px'
          child.style.marginRight = '5px'
          const $elImg = child.querySelectorAll('img')
          if ($elImg.length) {
            $elImg[0].classList.add('show')
            $elImg[0].setAttribute('src', $elImg[0].dataset.src)
            $elImg[0].setAttribute('data-loaded', true)
          }

          const $cardInfo = child.querySelectorAll('.product-card__info')[0]
          if ($cardInfo) {
            $cardInfo.parentNode.removeChild($cardInfo)
          }
        }
      }

      for (const key in data) {
        const objCurr = entry.getIn(['data', key])
        newDoc = displayWidget('home', key, objCurr, vDoc)
      }
    }

    if (newDoc.childNodes && newDoc.childNodes.length) {
      html = newDoc.childNodes[1].innerHTML
    }
    return h('div', { dangerouslySetInnerHTML: { __html: html } })
  }
}
