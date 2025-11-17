const fileInput = document.getElementById("upload-avatar");
const fileLabel = document.getElementById("upload-avatar-label");
const filePreview = document.getElementById("file-preview");
const uploadText = document.getElementById("upload-avatar-subtext");
const displayMessage = document.getElementById("display-message");
const displayText = document.getElementById("avatar-upload-display-text");
const displayIcon = document.getElementById("avatar-upload-favicon");
const displayMessageColor = getComputedStyle(document.body).getPropertyValue(
  "--neutral-gray-300"
);
const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const githubUserName = document.getElementById("github-username");
const mainForm = document.getElementById("form");
const formSubmitValidationArray = [fullName, email, githubUserName];
const DEFAULT_MSG = "Upload your photo (JPEG or PNG, max size: 500KB).";
const ERROR_MSG_OVERSIZED =
  "File too large. Please upload a photo under 500KB.";
const ERROR_MSG_WRONG_FILE_TYPE = "Please upload files that are JPEG only.";
const ERROR_MSG_COLOR = "#FF7276";

const maxFileSize = 500 * 1024; // 500 KB

const blockLabelDefault = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

// Helper Functions *****

const showAvatarButtons = () => {
  uploadText.innerHTML = `
    <div class="avatar-buttons">
      <button type="button" id="change-avatar">Change image</button>
      <button type="button" id="remove-avatar">Remove image</button>
    </div>
  `;

  const changeBtn = document.getElementById("change-avatar");
  const removeBtn = document.getElementById("remove-avatar");

  ["mousedown", "click"].forEach((evt) => {
    changeBtn.addEventListener(evt, blockLabelDefault);
    removeBtn.addEventListener(evt, blockLabelDefault);
  });

  changeBtn.addEventListener("click", (e) => {
    e.stopPropagation(); 
    fileInput.click(); 
  });

  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.value = "";
    filePreview.src = "./assets/images/icon-upload.svg";
    uploadText.textContent = "Drag and drop or click to upload";
  });
};

const setDisplayState = (message, color, isError = false) => {
  displayText.textContent = message;
  displayText.style.color = color;
  if (isError) {
    displayIcon.classList.add("error");
  } else {
    displayIcon.classList.remove("error");
  }
};
// Main Functions *****
const previewPhoto = () => {
  const file = fileInput.files[0];
  console.log(file.type);

  if (!file) return;

  if (file.type !== "image/jpeg") {
    filePreview.setAttribute("src", "./assets/images/icon-upload.svg");
    setDisplayState(ERROR_MSG_WRONG_FILE_TYPE, ERROR_MSG_COLOR, true);
  } else if (file.size > maxFileSize) {
    filePreview.setAttribute("src", "./assets/images/icon-upload.svg");
    setDisplayState(ERROR_MSG_OVERSIZED, ERROR_MSG_COLOR, true);
  } else {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      filePreview.setAttribute("src", event.target.result);
    };
    showAvatarButtons();
    fileReader.readAsDataURL(file);
    setDisplayState(DEFAULT_MSG, displayMessageColor);
  }
};

// Event Listeners *****

mainForm.addEventListener("submit", (e) => {
 formSubmitValidationArray.forEach((input) => {
    const errorDiv = input.nextElementSibling; 
    let errorMessage = "";

    if (input.value.trim() === "") {
      errorMessage = "Please enter an email address";
    } else if (input.id === "email" && !input.value.includes("@")) {
      errorMessage = "Please enter a valid email address.";
    }


    if (input.id === "full-name" && errorMessage) {
      errorMessage = "Please enter your full name.";
    } else if (input.id === "github-username" && errorMessage) {
      errorMessage = "Please enter your GitHub username.";
    }

    if (errorMessage) {
      input.classList.add("error");
      if (errorDiv) errorDiv.textContent = errorMessage;
    } else {
      input.classList.remove("error");
      if (errorDiv) errorDiv.textContent = "";
    }
  });
  e.preventDefault();
});
formSubmitValidationArray.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      input.classList.remove("error");

      const errorDiv = input.nextElementSibling;
      if (errorDiv) errorDiv.textContent = "";
    }
  });
});

fileLabel.addEventListener("click", (e) => {
  if (document.querySelector(".avatar-buttons")) {
    const isButtonClick = e.target.closest("button");
    if (isButtonClick) {
      e.stopPropagation();
      return;
    }

    e.preventDefault();
  }
});

fileInput.addEventListener("change", previewPhoto);
