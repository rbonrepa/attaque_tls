const toggleAttribute = (e: HTMLElement, name: string) => {
  if (e.hasAttribute(name)) {
    e.removeAttribute(name)
  } else {
    e.setAttribute(name, true)
  }
}

window.addEventListener('load', e => {
  // Polyfill for IE and Edge
  if (!('HTMLDetailsElement' in window)) {
    for (const summary of document.querySelectorAll('summary')) {
      summary.addEventListener('click', e => {
        toggleAttribute(summary.parentNode, 'open')
      })
      summary.addEventListener('keypress', e => {
        if (e.keyCode === 32 || e.keyCode === 13) {
          toggleAttribute(summary.parentNode, 'open')
        }
      })
    }
  }

  // Progressive enhancement: better handling of mobile viewports
  const $navigationToggle: HTMLDetailsElement = document.querySelector('.navigation-toggle')
  const $mainContent: HTMLElement = document.querySelector('.page-content')
  const scrollState = {
    top: 0,
    left: 0
  }
  let updateScrollState = true
  const scrollHandler = () => {
    if (updateScrollState) {
      scrollState.top = window.scrollY
      scrollState.left = window.scrollX
    }
  }
  scrollHandler()
  window.addEventListener('scroll', e => scrollHandler(), { passive: true })

  const toggleHandler = (e: Event) => {
    if (document.body.classList.contains('_menu-closing')) {
      return
    }
    if (document.body.classList.contains('_menu-open')) {
      // Close the menu
      document.body.classList.add('_menu-closing')
      document.body.classList.remove('_menu-open')
      $mainContent.addEventListener('transitionend', e => {
        document.body.classList.remove('_menu-closing')
        document.documentElement.style.setProperty('scroll-behavior', 'auto')
        window.scroll(scrollState.left, scrollState.top)
        document.documentElement.style.removeProperty('scroll-behavior')
        updateScrollState = true
      }, { once: true })
    } else {
      // Open the menu
      updateScrollState = false
      $navigationToggle.style.setProperty('--offset', (window.innerWidth - document.body.offsetWidth).toString() + 'px')
      document.body.classList.add('_menu-open')
      document.body.scrollTop = 0
      $mainContent.scrollTop = scrollState.top
      $mainContent.scrollLeft = scrollState.left
    }
  }
  $navigationToggle.addEventListener('toggle', toggleHandler, { passive: false })

  window.addEventListener('mousewheel', e => {
    if (document.body.classList.contains('_menu-open')) {
      toggleHandler({})
    }
  }, { passive: true })

  // Progressive enhancement: close the menu when focus is lost
  document.querySelector('.page-content').addEventListener('focusin', e => {
    $navigationToggle.removeAttribute('open')
  }, { passive: true })
  document.querySelector('.navigation-toggle > .toggle').addEventListener('touchstart', e => {
    if (e.touches[0].clientY > window.innerHeight / 2) {
      $navigationToggle.removeAttribute('open')
    }
  }, { passive: true })
})

document.documentElement.classList.remove('_nojs')

const scrollHandler = () => {
  requestAnimationFrame(() =>
    document.body.style.setProperty(
      '--parallax',
      (window.scrollY / window.innerHeight).toString()
    ), 0
  )
}
scrollHandler()

const computeOffsetTop = () => {
  for (const $el of document.querySelectorAll('._parallax')) {
    let offset = $el.offsetTop - window.innerHeight / 2 + $el.offsetHeight / 2
    let $parent = $el.offsetParent
    while ($parent && 'offsetParent' in $parent) {
      offset += $parent.offsetTop
      $parent = $parent.offsetParent
    }
    $el.style.setProperty(
      '--offset',
      (offset / window.innerHeight).toString()
    )
  }
}
computeOffsetTop()

window.addEventListener('scroll', e => scrollHandler(), { passive: true })
window.addEventListener('resize', e => { computeOffsetTop(); scrollHandler() }, { passive: true })
new ResizeObserver(computeOffsetTop).observe(document.body)

const mouseHandler = (e: MouseEvent | TouchEvent) => {
  const w = window.innerWidth
  const h = window.innerHeight
  const cursor = 'touches' in e ? e.touches[0] : e
  const x = 2 * cursor.clientX / w - 1
  const y = 2 * cursor.clientY / h - 1
  document.body.style.setProperty('--x', x)
  document.body.style.setProperty('--y', y)
}

document.addEventListener('mousemove', mouseHandler, { passive: true })
document.addEventListener('touchmove', mouseHandler, { passive: true })
