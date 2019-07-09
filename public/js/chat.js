const socket = io();
// server (emit) => client (receive) --acknowledgment --> server

// client (emit) => server (receive) --acknowledgment --> client

// Elements
const $messageForm = document.querySelector("#forms");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const urlTemplate = document.querySelector("#url-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// OPTIONS
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// console.log(Qs.parse(location.search));

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  //How far have I scrolled?
  const scrollOffset = Math.ceil($messages.scrollTop + visibleHeight);

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("message", welcome => {
  console.log("cleint has been updated ", welcome);
  const html = Mustache.render(messageTemplate, {
    clientName: welcome.username,
    mustacheMessage: welcome.text,
    createdAt: moment(welcome.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", url => {
  console.log(url);
  const html = Mustache.render(urlTemplate, {
    username: url.username,
    urlMessage: url.url,
    createdTime: moment(url.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  // console.log(room);
  // console.log(users);
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });

  document.querySelector("#sidebar").innerHTML = html;
});
// ################ events for forms  ###################
$messageForm.addEventListener("submit", e => {
  e.preventDefault();

  // disable
  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;
  // OR const message = document.querySelector("input").value;

  socket.emit("sendMessage", message, error => {
    // enable
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }

    console.log("The message has succed!");
  });
});

// ################ events for button  ###################

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("geolocation is not supported by your browser");
  }

  // disable
  $sendLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(position => {
    // console.log(position);
    const place = {
      lat: position.coords.latitude,
      long: position.coords.longitude
    };
    socket.emit("sendLocation", place, () => {
      $sendLocationButton.removeAttribute("disabled");
      console.log("location shared");
    });
  });
});

// socket.on("countUpdated", count => {
//   console.log("The count has been updated!", count);
// });

// document.querySelector("#increment").addEventListener("click", () => {
//   console.log("clicked");
//   socket.emit("increment");
// });
