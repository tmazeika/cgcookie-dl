if (typeof window.cgcookiedl === 'undefined') {
  window.cgcookiedl = true;
  browser.runtime.onMessage.addListener(() => {
    const lessons = [...document.querySelectorAll('ul.content-list .content-lesson-link').values()]
    lessons.map(node => String(node.href)).forEach((href, i) => {
      fetch(href, {
        credentials: 'include',
      })
        .then(res => res.text())
        .then(htmlText => {
          const dom = new DOMParser().parseFromString(htmlText, 'text/html');
          return sendKey(i, dom);
        })
        .catch(console.error)
    });

    /**
     * @param {number} i
     * @param {Document} doc
     */
    function sendKey(i, doc) {
      const videoEl = doc.querySelector('div.content-media-unit.video > div.wistia_embed');
      if (videoEl === null) {
        return null;
      }
      const videoId = videoEl.dataset.videoId;
      return fetch(`https://fast.wistia.com/embed/medias/${videoId}.json`, {
        referrer: 'https://fast.wistia.net',
      })
        .then(res => res.text())
        .then(htmlText => {
          const key = /https:\/\/embed-ssl.wistia.com\/deliveries\/(.*?)\.bin/.exec(htmlText)[1];
          const title = doc.querySelector('#lesson-title > h2').textContent;
          return fetch(`http://localhost:5000?key=${key}&title=${title}&i=${i}`);
        })
        .catch(console.error)
    }
  })
}
