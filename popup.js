// popup.js
let currentOrigin;
let currentTitle;
let saveButton = document.querySelector("button");

saveButton.addEventListener("click", function () {
  let origin = currentOrigin;
  let title = document.querySelector(".title").value;
  let enabled = document.querySelector(".enabled").checked;
  let parameter = document.querySelector(".parameter").value;

  saveButton.textContent = "Saving...";
  saveButton.disabled = true;

  chrome.storage.local.set(
    { [origin]: { title, enabled, parameter } },
    function () {
      if (chrome.runtime.lastError) {
        saveButton.textContent = "Failed";
      } else {
        saveButton.textContent = "Success";
      }
      setTimeout(function () {
        saveButton.textContent = "Save";
        saveButton.disabled = false;
      }, 2000);
    }
  );
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let tab = tabs[0];
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: function () {
        let title = document.title;
        let origin = new URL(window.location.href).origin;
        return { title, origin };
      },
    },
    (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        let result = results[0].result;
        currentTitle = result.title;
        currentOrigin = result.origin;
        document.querySelector(".title").value = currentTitle;
        document.querySelector(".origin").innerHTML = currentOrigin;

        setTimeout(function () {
          chrome.storage.local.get([currentOrigin], function (result) {
            let settings = result[currentOrigin];
            console.log(settings);
            if (settings) {
              document.querySelector(".enabled").checked = settings.enabled;
              document.querySelector(".parameter").value = settings.parameter;
            }
          });
        }, 200);
      }
    }
  );
});
