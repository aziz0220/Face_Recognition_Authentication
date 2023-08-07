const formOpenBtn = document.querySelector("#form-open"),
RegisterOpenBtn = document.querySelector("#reg-open"),
section1 = document.querySelector(".section1"),
webcamContainer = document.querySelector(".webcam_container"),
webcamContainer1 = document.querySelector(".webcam_container1"),
formContainer = document.querySelector(".form_container"),
formContainer1 = document.querySelector(".form_container1"),
formCloseBtn = document.querySelector(".form_close1"),
formCloseBtn1 = document.querySelector(".form_close2"),
CamCloseBtn = document.querySelector(".cam_close"),
CamCloseBtn1 = document.querySelector(".cam_close1"),
signupBtn = document.querySelector("#signup"),
loginBtn1 = document.querySelector("#login1"),
loginBtn = document.querySelector("#login"),
registerBtn = document.querySelector("#register"),
CamOpenBtn = document.querySelector("#webcam-button-1"),
CamOpenBtn1 = document.querySelector("#webcam-button-2"),
pwShowHide = document.querySelectorAll(".pw_hide");


CamOpenBtn.addEventListener("click", () => {
    formContainer.classList.add("deactivate");
    webcamContainer.classList.remove("deactivate");
    webcamContainer.classList.add("show");
    }
);

CamCloseBtn.addEventListener("click", () => {
    webcamContainer.classList.remove("show");
    webcamContainer.classList.add("deactivate");
    formContainer.classList.remove("deactivate");
    }
);




formOpenBtn.addEventListener("click", () => {
    section1.classList.add("show");
    formContainer1.classList.remove("activate");
    formContainer1.classList.add("deactivate");;
    formContainer.classList.remove("deactivate");
    formContainer.classList.add("active");}
);
formCloseBtn.addEventListener("click", () => {
    section1.classList.remove("show");
    formContainer.classList.remove("deactivate");
    formContainer.classList.remove("activate");
});
RegisterOpenBtn.addEventListener("click", (e) => {
    e.preventDefault();
    section1.classList.add("show");
    formContainer1.classList.add("activate");
    formContainer.classList.add("deactivate");
    });
formCloseBtn1.addEventListener("click", () => {
    section1.classList.remove("show");
    formContainer1.classList.remove("activate");} );

pwShowHide.forEach((icon) => {
icon.addEventListener("click", () => {
  let getPwInput = icon.parentElement.querySelector("input");
  if (getPwInput.type === "password") {
    getPwInput.type = "text";
    icon.classList.replace("uil-eye-slash", "uil-eye");
  } else {
    getPwInput.type = "password";
    icon.classList.replace("uil-eye", "uil-eye-slash");
  }
});
});

signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.add("active");
    formContainer.classList.remove("deactivate");
    formContainer1.classList.remove("activate");
    formContainer1.classList.add("deactivate");
});
registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.remove("active");
    formContainer.classList.add("deactivate");
    formContainer1.classList.remove("deactivate");
    formContainer1.classList.add("activate");
});
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.add("active");
    formContainer.classList.remove("deactivate");
    formContainer1.classList.remove("activate");
    formContainer1.classList.add("deactivate");
    });

loginBtn1.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.remove("active");
    formContainer.classList.add("deactivate");
    formContainer1.classList.remove("deactivate");
    formContainer1.classList.add("activate");
    });


    // JavaScript to handle the toggle button's value
    const faceAuthToggle = document.getElementById('face-auth-toggle');

    faceAuthToggle.addEventListener('change', () => {
        const isFaceAuthEnabled = faceAuthToggle.checked;
        // You can now use the value of 'isFaceAuthEnabled' (true or false) to handle the user's choice.
        // For example, you can show/hide relevant elements based on this value or send the value to the server during registration.
    });

    
let video;
let captureButton;
let saveButton;
let deleteButton;
let isWebcamOpen = false;
let isCaptured = false;
let video1;
let captureButton1;
let authButton;
let deleteButton1;
let isWebcamOpen1 = false;
let isCaptured1 = false;
let faceGuideline;
let faceDetectionInterval;
let faceDetectionInterval1;

function toggleWebcam() {
    video = document.getElementById('video-stream');
    captureButton = document.getElementById('capture-button');
    saveButton = document.getElementById('save-button');
    deleteButton = document.getElementById('delete-button');
    faceGuideline1 = document.querySelector('.face-guideline1');
    if (isWebcamOpen) {
        video.src = '';
        captureButton.disabled = true;
        saveButton.disabled = true;
        deleteButton.disabled = true;
        captureButton.innerHTML = 'Take A Shot';
        isWebcamOpen = false;
        isCaptured = false;
        clearInterval(faceDetectionInterval1);
        faceGuideline1.classList.add("remove");
    } else {
        video.src = '/video_feed';
        faceGuideline1.classList.remove("remove");
        captureButton.disabled = false;
        captureButton.innerHTML = 'Take A Shot';
        saveButton.disabled = true;
        deleteButton.disabled = true;
        isWebcamOpen = true;
        isCaptured = false;
        faceDetectionInterval1 = setInterval(async () => {
            // Fetch the face detection result from the server
            const response = await fetch('/is_face_detected');
            const isFaceDetected = await response.json();

            // Update the face guideline color based on the detection result
            faceGuideline1.classList.remove('active', 'inactive');
            faceGuideline1.classList.add(isFaceDetected ? 'active' : 'inactive');

            // Enable the capture button if a face is detected
            captureButton.disabled = !isFaceDetected;
        }, 500);
    }
}


function openWebcam() {
    video1 = document.getElementById('video-stream-1');
    captureButton1 = document.getElementById('capture-button-1');
    deleteButton1 = document.getElementById('delete-button-1');
    faceGuideline = document.querySelector('.face-guideline');
    authButton=document.getElementById('auth-button');
    if (isWebcamOpen1) {
        video1.src = '';
        faceGuideline.classList.add("remove");
        captureButton1.disabled = true;
        deleteButton1.disabled = true;
        isWebcamOpen1 = false;
        isCaptured1 = false;
        clearInterval(faceDetectionInterval);
    } else {
        video1.src = '/video_feed';
        deleteButton1.disabled = true;
        faceGuideline.classList.remove("remove");
        isWebcamOpen1 = true;
        isCaptured1 = false;
        faceDetectionInterval = setInterval(async () => {
            // Fetch the face detection result from the server
            const response = await fetch('/is_face_detected');
            const isFaceDetected = await response.json();

            // Update the face guideline color based on the detection result
            faceGuideline.classList.remove('active', 'inactive');
            faceGuideline.classList.add(isFaceDetected ? 'active' : 'inactive');

            // Enable the capture button if a face is detected
            captureButton1.disabled = !isFaceDetected;
        }, 500); // Adjust the interval (in milliseconds) for face detection updates
            }
}





function login() {
    fetch('/login')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to dashboard on successful login
                window.location.href = '/dashboard';
            } else {
                // Show the error message in the message container
                showMessage(data.message, 'error');
            }
        })
        .catch(error => {
            // Show the error message in the message container
            showMessage('Error occurred during login', 'error');
            console.error('Error during login:', error);
        });
}

function captureShot() {
    if (isWebcamOpen && !isCaptured) {
        saveButton.disabled = false;
        deleteButton.disabled = false;
        isCaptured = true;
    }
}


function saveShot() {
    fetch('/save_shot')
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Failed to save image.');
            }
        })
        .then(message => {
            // Show the success message in the message container
            showMessage(message, 'success');
            toggleWebcam();
        })
        .catch(error => {
            // Show the error message in the message container
            showMessage(error.message, 'error');
            console.error('Error saving image:', error);
        });
}

function showMessage(message, messageType) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = message;
    if (messageType === 'success') {
        messageContainer.style.backgroundColor = 'green';
    } else if (messageType === 'error') {
        messageContainer.style.backgroundColor = 'red';
    }
    messageContainer.style.display = 'block';

    // Hide the message after a few seconds (e.g., 3 seconds)
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
}


function showMessage1(message, messageType) {
    const messageContainer = document.getElementById('message-container1');
    messageContainer.innerHTML = message;
    if (messageType === 'success') {
        messageContainer.style.backgroundColor = 'green';
    } else if (messageType === 'error') {
        messageContainer.style.backgroundColor = 'red';
    }
    messageContainer.style.display = 'block';

    // Hide the message after a few seconds (e.g., 3 seconds)
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
}


  
function deleteShot() {
    fetch('/delete')
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Failed to delete image.');
            }
        })
        .then(message => {
            showMessage(message, 'success');
            console.log(message);
            toggleWebcam();
        })
        .catch(error => {
            showMessage(error.message, 'error');
            console.error('Error deleting image:', error);
        });
}


function AnalyseShot() {
    if (isWebcamOpen1 && !isCaptured1) {
        captureButton1.disabled = true;
        deleteButton1.disabled = false;
        authButton.disabled = false;
        isCaptured1 = true;
        fetch('/analyse_shot')
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Failed to analyse image.');
            }
        })
        .then(message => {
            showMessage(message, 'success');
            console.log(message);
            openWebcam();
        })
        .catch(error => {
            showMessage(error.message, 'error');
            console.error('Error analysing image:', error);
        });
    }
}


function resetShot() {
    if (isWebcamOpen1 && isCaptured1) {
        captureButton1.disabled = false;
        deleteButton1.disabled = true;
        authButton.disabled = true;
        isCaptured1 = false;
    fetch('/reset')
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Failed to reset image.');
            }
        })
        .then(message => {
            showMessage(message, 'success');
            console.log(message);
            openWebcam();
        })
        .catch(error => {
            showMessage(error.message, 'error');
            console.error('Error resetting image:', error);
        });
}
}

