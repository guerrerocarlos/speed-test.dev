

  let i = 0
  myPeer.cdnPeers = []
  let cdns = [
    { name: "CloudFront", url: "https://cloudfront.speed-test.dev" },
    { name: "CloudFlare", url: "https://static.speed-test.dev" }
  ]
  cdns.forEach((cdn) => {
    for (var ii = 0; ii < 4; ii++) {
      let peer = {
        nick: cdn.name,
        latency: "CDN",
        uiUpdateInterval: generalUIUpdateInterval,
        cdnDownload: 0,
        cdnUpload: 0,
        cdn: true,
        downloadIndex: 1,
        downloadTotalBytes: 0,
        uploadTotalBytes: 0,
        getStatuses: [],
      }

      myPeer.cdnPeers.push(peer)
      peer.html = newPeer(peer)

      peer.startDownloadFromCDN = () => {
        peer.getStatuses.push({ loaded: 0, total: 0 })
        cdnPeersSending++
        // if (peer.downloadIndex === 0) {
        //   peer.downloadIndex += 1
        // }
        get(`${cdn.url}/230MB.zip?part=` + ii, 'get', speedEngine(peer, myPeer, peer.getStatuses.length - 1), function() {
          cdnPeersSending--
          if(cdnPeersSending === 0) {
            myPeer.html.render()
            testCompleted()
          }
        })
      }
    }
  })
  // for (; ii < 10; ii++) {
  //   get("https://static.speed-test.dev/24MB.zip?part="+ii, 'get', ii)
  // }
  // for (; ii < 80; ii++) {
  //   get("https://speed-test-eu-west-3.s3-website.eu-west-3.amazonaws.com/230MB.zip?part="+ii, 'get', ii)
  // }

  function speedEngine(peer, myPeer, ii) {
    return {
      update: (i, value, loaded, total) => {
        // console.log("⏰ UPDATE:", i, value)
        peer.cdnUpload = value
        if (loaded > 0) {
          peer.getStatuses[ii].loaded = loaded
        }
        peer.downloadLoadedBytes = peer.getStatuses.reduce((acc, status) => acc + status.loaded, 0) / 1024 / 1024
        if (total > 0) {
          peer.getStatuses[ii].total = total
        }
        peer.downloadTotalBytes = peer.getStatuses.reduce((acc, status) => acc + status.total, 0) / 1024 / 1024

        // peer.html.render()
        // myPeer.html.render()
      }
    }
  }
