var tag = document.createElement("script");
var firstScriptTag = document.getElementsByTagName("script")[0];

let videoIdInput = document.getElementById("videoIdInput");
var player;
var repeatCount = 1000;
let section = document.querySelectorAll(".section");
let liElmnts = document.querySelectorAll("body .container .tabBar ul li");
let pasteBtn = document.getElementById("pasteBtn");
var repeatedTimes;
var repeatCountInput = document.getElementById("repeatCountInput");
var infinityButton = document.getElementById("infinityButton");
var repeatFromInput = document.getElementById("repeatFromInput");
var repeatToInput = document.getElementById("repeatToInput");
var skipFromInput = document.getElementById("skipFromInput");
var skipToInput = document.getElementById("skipToInput");

tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
if (localStorage.getItem("savedVideosFromLocalStorage") == null) {
  var savedVideos = [];
} else {
  var savedVideos = JSON.parse(
    localStorage.getItem("savedVideosFromLocalStorage")
  );

  savedVideos.reverse().forEach((SavedVideo) => {
    crel(
      document.querySelector(".SavedVideos"),
      crel(
        "div",
        {
          class: "videoBox",
          onclick: "playthisvideo(" + "'" + SavedVideo.id + "'" + ")",
        },
        crel("img", {
          src: thumbnailPathFromId(SavedVideo.id),
        }),
        crel("h2", SavedVideo.title),
        crel("span", SavedVideo.videoLength)
      )
    );
  });
}

document.getElementById("tryBtn").addEventListener("click", function () {
  liElmnts[2].onclick();
});

document.getElementById("configureBtn").addEventListener("click", function () {
  liElmnts[4].onclick();
});

function thumbnailPathFromId(id) {
  return "https://img.youtube.com/vi/" + id + "/0.jpg";
}

// minutes and secondes to secondes
// time to secondes
function timeToSeconds(time) {
  time = time + "";
  if (time == "") {
    return "";
  }

  let timeArray = time.split(":");
  let minutes = timeArray[0];
  let seconds = timeArray[1];

  return time.includes(":")
    ? parseInt(minutes) * 60 + parseInt(seconds)
    : parseInt(time);
}

function secondsToMinutes(time) {
  let minutes = Math.floor(time / 60);
  let seconds =
    (time - minutes * 60).toString().length < 2
      ? "0" + (time - minutes * 60)
      : time - minutes * 60;

  return minutes + ":" + seconds;
}

function onYouTubeIframeAPIReady(
  id = localStorage.getItem("lastSetVideoId") == null
    ? "7FJgd7QN1zI"
    : localStorage.getItem("lastSetVideoId").toString()
) {
  player = new YT.Player("player", {
    height: "390",
    width: "640",
    videoId: id,
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: checkifbookmarked,
      onStateChange: onPlayerStateChange,
    },
  });
}

function checkifbookmarked() {
  if (
    savedVideos.find(
      (SavedVideo) => SavedVideo.id == player.getVideoData().video_id
    )
  ) {
    document
      .getElementById("bookmarkButton")
      .classList.add("activeiInfinityButton");
  } else {
    document
      .getElementById("bookmarkButton")
      .classList.remove("activeiInfinityButton");
  }
}
//
repeatCountInput.oninput = function () {
  if (repeatCountInput.value == "") {
    infinityButton.classList.add("activeiInfinityButton");
  } else {
    infinityButton.classList.remove("activeiInfinityButton");
  }
};

infinityButton.onclick = function () {
  repeatCountInput.value = "";
  this.classList.add("activeiInfinityButton");
  repeatedTimes = 0;

  player.seekTo(timeToSeconds(repeatFromInput.value));
};
function onPlayerStateChange(e) {
  var videoState = e.data;
  // check if video is unstarted at all
  if (videoState == -1) {
    // reset repeat times to 0
    repeatedTimes = 0;
  }
  if (repeatCountInput.value == "") {
    if (videoState == YT.PlayerState.ENDED) {
      // if video is ended repeat it forever until user stop it
      player.seekTo(0);
    }

    //if video is playing and repeat count is set
  } else if (repeatCountInput.value != "") {
    //when video is ended increase repeat times by 1
    if (videoState == YT.PlayerState.ENDED) {
      repeatedTimes++;

      //when it reaches repeat count stop it
      if (repeatedTimes == repeatCountInput.value) {
        player.stopVideo();
        // but when it's not ended yet repeat it (think of it like a recursion function)
        // hope when you read this you get better at coding that you transform it to recusion function simply and without problems
      } else {
        player.seekTo(0);
      }
    }
  }
  // there is other bugs to solve hear !
  checkifbookmarked();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setVideoId(id) {
  // change the iframe src id to the passed one in this function
  player.loadVideoById(id);
}

videoIdInput.oninput = function () {
  // to string
  var videoIdInputValue = this.value + "";

  function isYoutubeVideolink(url) {
    // before any check set the input style to regular
    videoIdInput.classList.remove("errorInput");

    if (typeof url === "string" && url != "") {
      // regExp don't even try to waste your time on it I just search it LOL
      var res = url.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      // this can be done only with regExp but i just choosed to do it with thinking and solving it, it took me a while
      return (
        (res != null && (url.includes("=") || url.includes("/"))) ||
        url.includes("youtube.com") ||
        url.includes("watch?v=") ||
        url.startsWith("youtu.be") ||
        url.includes("youtube.com/watch?v=")
      );
    }
  }

  // check if the input is a youtube video link
  if (isYoutubeVideolink(videoIdInputValue)) {
    //extract id from link (11 is regulat youtube ids length)

    var extractedId = videoIdInputValue
      .split(/[=&?/\s]/)
      .find((val) => val.length == 11);
    // now update iframe id and show new video
    setVideoId(extractedId);
  } else if (
    // in case someone pasted a youtube video id directly
    // honestly i didn't find a way to check if the id is valid or not, if it's not it will not work
    videoIdInputValue.length == 11 &&
    !isYoutubeVideolink(videoIdInputValue)
  ) {
    setVideoId(videoIdInputValue);
  } else {
    // in case of error just change the input style
    videoIdInput.classList.add("errorInput");
  }

  localStorage.removeItem("lastSetVideoId");
  localStorage.setItem("lastSetVideoId", extractedId);
};
///////////////////////////////////////////////////////////////////////////////////////////////////
// paste link in videoIdInput function
pasteBtn.onclick = () => {
  // paste from clipboard
  navigator.clipboard.readText().then((text) => {
    videoIdInput.value = text;
    // execute the oninput function so the video will be loaded directly
    videoIdInput.oninput();
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// give tabBar items number indications
for (let i = 0; i < liElmnts.length; i++) {
  liElmnts[i].setAttribute("data-order-list", i);
}

function playthisvideo(id) {
  document.getElementById("videoButton").onclick();
  setVideoId(id);
  player.playVideo();
  localStorage.removeItem("lastSetVideoId");
  localStorage.setItem("lastSetVideoId", id);
  checkifbookmarked();
}
function activeLi(elmnt) {
  // remove active class from all tabBar elements
  liElmnts.forEach((li) => {
    li.classList.remove("active");
  });
  // hide all sections
  section.forEach((sec) => {
    sec.style.display = "none";
  });
  // here elmnt which is passed from argument will get active (elmnt is this expression in this function when calling it, check html code)
  elmnt.classList.add("active");
  // we have 5 tabBar items and 5 sections so when we click on one of them we want to show the corresponding section that have the same order as the clicked tabBar item
  section[elmnt.getAttribute("data-order-list")].style.display = "block";
  // the position graphical indication that move when we click on one of the tabBar items is done here not css (this is suggested by copilot, LOL idk how tf he know the exact offset)
  document.getElementById("indicator").style.left =
    elmnt.offsetWidth / 2 + elmnt.offsetLeft + "px";
}
///////////////////////////////////////////////////////////////////////////////////////////////
//function to reset all setting input to nothing
function resetSettings() {
  repeatCountInput.value = "";
  repeatedTimes = 0;
  infinityButton.classList.add("activeiInfinityButton");
  repeatFromInput.value = "";
  repeatToInput.value = "";
  skipFromInput.value = "";
  skipToInput.value = "";
}
document.getElementById("resetButton").addEventListener("click", resetSettings);
document
  .getElementById("bookmarkButton")
  .addEventListener("click", addtoBookmarks);
// they r bugs here to solve !
////////////////////////////////////////////////////////////////////////////////////
// function to add video to bookmarks
var filtered = [];
function addtoBookmarks() {
  var parent = document.getElementById("SavedVideos");
  //delete all bookmarks from it's section
  // while (parent.lastChild) {
  //   parent.removeChild(parent.lastChild);
  // }
  this.classList.add("activeiInfinityButton");
  if (
    savedVideos.every((video) => video.id != player.getVideoData()["video_id"])
  ) {
    this.classList.add("activeiInfinityButton");

    savedVideos.unshift({
      title: player.getVideoData().title,
      id: player.getVideoData()["video_id"],

      videoLength: secondsToMinutes(
        Math.floor(player.getDuration())
      ).toString(),
    });

    crel(
      document.querySelector(".SavedVideos"),
      crel(
        "div",
        {
          class: "videoBox",
          onclick: "playthisvideo(" + "'" + savedVideos[0].id + "'" + ")",
        },
        crel("img", {
          src: thumbnailPathFromId(savedVideos[0].id),
        }),
        crel("h2", savedVideos[0].title),
        crel("span", savedVideos[0].videoLength)
      )
    );
  }

  // generate html for new bookmarks in bookmarks section
  // crel is a tiny library to create html  likr this
  for (var i = 0; i < savedVideos.length; i++) {}

  // save the bookmarks array to local storage in JSON format

  localStorage.setItem(
    "savedVideosFromLocalStorage",
    JSON.stringify(savedVideos)
  );
}

document.getElementById("videoButton").addEventListener("click", function () {
  if (timeToSeconds(repeatToInput.value) != "") {
    // play video from value of repeatFromInput
    player.playVideo();

    player.seekTo(timeToSeconds(repeatFromInput.value));
    player.playVideo();
    // reset repeated times to 0
    repeatedTimes = 0;

    // set interval to check every 500ms if the video is at the value of repeatToInput
    // i choosed 500ms because the player.getCurrentTime() return the time very accuratly
    var repeatInterval = setInterval(function () {
      if (
        timeToSeconds(repeatToInput.value) ==
        Math.floor(player.getCurrentTime())
      ) {
        // play video from value of repeatFromInput and increment repeatedTimes by 1
        player.seekTo(timeToSeconds(repeatFromInput.value));
        repeatedTimes++;

        // check if repeatedTimed is equal to repeatCountInput value
        if (repeatedTimes == repeatCountInput.value) {
          repeatedTimes = 0;

          // set the video to the start again and stop it
          // there is difference between stopVideo() and pauseVideo() !
          player.seekTo(0);
          player.stopVideo();
          // reset repeatedTimes to 0 to start from the beginning so we can do the operation again
          repeatedTimes = 0;

          // stop the whole interval
          clearInterval(repeatInterval);
        }
      }
    }, 500);
  } else {
    clearInterval(repeatInterval);
  }
  // skipToInput.value is more important than skipFromInput.value because even if it's empty we can set it to default so it restart from 0 in video
  // i guess if you read the previous things this will be clear
  if (timeToSeconds(skipToInput.value) != "") {
    if (timeToSeconds(skipFromInput.value) != "") {
      var skipInterval = setInterval(() => {
        if (
          timeToSeconds(skipFromInput.value) ==
          Math.floor(player.getCurrentTime())
        ) {
          player.seekTo(timeToSeconds(skipToInput.value));
          if (repeatedTimes == repeatCountInput.value) {
            clearInterval(skipInterval);
          }
        }
      }, 500);
    }
  } else {
    clearInterval(skipInterval);
  }
});

document
  .getElementById("exportVideosButton")
  .addEventListener("click", function () {
    // export savedVideo json as file
    var json = JSON.stringify(savedVideos);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "Bookmarks.json";
    document.body.appendChild(a);
    a.click();
  });

document
  .getElementById("fullScreenButton")
  .addEventListener("click", function () {
    // toggle fullscreen page
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  });

const items = document.querySelectorAll(".accordion button");

function toggleAccordion() {
  const itemToggle = this.getAttribute("aria-expanded");

  for (i = 0; i < items.length; i++) {
    items[i].setAttribute("aria-expanded", "false");
  }

  if (itemToggle == "false") {
    this.setAttribute("aria-expanded", "true");
  }
}

items.forEach((item) => item.addEventListener("click", toggleAccordion));



