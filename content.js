document.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return;
    }
  
    chrome.storage.local.get([window.location.origin], function (result) {
      let settings = result[window.location.origin];
      if (settings && settings.enabled) {
        const url = new URL(window.location.href);
        const parameter = settings.parameter;
        switch (event.key) {
          case "ArrowLeft":
            const prevPage = Number(url.searchParams.get(parameter)) - 1;
            url.searchParams.set(parameter, prevPage > 0 ? prevPage : 1);
            window.location.href = url.href;
            break;
          case "ArrowRight":
            url.searchParams.set(parameter, Number(url.searchParams.get(parameter)) + 1);
            window.location.href = url.href;
            break;
          case "ArrowUp":
            window.scrollTo(0, 0);
            break;
          case "ArrowDown":
            window.scrollTo(0, document.body.scrollHeight);
            break;
        }
        event.preventDefault();
      }
    });
  }, true);