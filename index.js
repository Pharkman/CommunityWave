const postInputBtn = document.getElementById("post-text");
const modalOverlay = document.getElementById("post-overlay");
const closeModal = document.getElementById("close-modal");
const form = document.getElementById("form");
const postInputText = document.getElementById("post-input");
const whoToSeeMyPost = document.getElementById("who-to-see-post");
const mainPostContainer = document.getElementById("main-post-container");

const selectImageContainer = document.getElementById("select-image-container");
const selectImage = document.getElementById("select-image");

selectImageContainer.addEventListener("click", clickOnSelectImage);
function clickOnSelectImage() {
    selectImage.click();
}

selectImage.addEventListener("change", displayImageInside);
function displayImageInside() {
    if (selectImage.files && selectImage.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageIcon = selectImageContainer.querySelector('.image-icon');
            const selectImageText = selectImageContainer.querySelector('.select-image-text');

            if (imageIcon) {
                imageIcon.style.display = 'none';
            }
            if (selectImageText) {
                selectImageText.style.display = 'none';
            }

            const selectedImagePreview = document.createElement('img');
            selectedImagePreview.setAttribute('src', e.target.result);
            selectedImagePreview.classList.add('selected-image-preview');

            const existingPreview = selectImageContainer.querySelector('.selected-image-preview');
            if (existingPreview) {
                existingPreview.remove();
            }

            selectImageContainer.appendChild(selectedImagePreview);
        };
        reader.readAsDataURL(selectImage.files[0]);
    }
}

postInputBtn.addEventListener("click", displayModalOverlay);
function displayModalOverlay() {
    modalOverlay.classList.add("post-overlay-visible");
    modalOverlay.classList.remove("post-overlay");
}

closeModal.addEventListener("click", closeModalOverlay);
function closeModalOverlay() {
    if (modalOverlay.classList.contains("post-overlay-visible")) {
        modalOverlay.classList.remove("post-overlay-visible");
        modalOverlay.classList.add("post-overlay");
    }

    const selectedImagePreview = selectImageContainer.querySelector('.selected-image-preview');
    if (selectedImagePreview) {
        selectedImagePreview.remove();
    }

    const imageIcon = selectImageContainer.querySelector('.image-icon');
    const selectImageText = selectImageContainer.querySelector('.select-image-text');
    if (imageIcon) {
        imageIcon.style.display = 'flex';
    }
    if (selectImageText) {
        selectImageText.style.display = 'flex';
    }
}

let postDataArray = [];

form.addEventListener("submit", handlePost);
function handlePost(e) {
    e.preventDefault();

    let userTextPost = postInputText.value;
    let userImagePost = selectImage.files[0];
    let whoToSee = whoToSeeMyPost.value;
    let currentTime = new Date().toISOString();

    const postData = {
        UserTEXTPost: userTextPost,
        UserIMAGEPost: userImagePost ? URL.createObjectURL(userImagePost) : "",
        WHOToSee: whoToSee,
        timePosted: currentTime
    };

    form.reset();
    postInputText.focus();
    postDataArray.unshift(postData);
    localStorage.setItem("postedData", JSON.stringify(postDataArray));
    fetchData();
    closeModalOverlay()
    displayPostOnInterface();
}

function fetchData() {
    if (localStorage.getItem("postedData")) {
        postDataArray = JSON.parse(localStorage.getItem("postedData"));
    }
}
fetchData();

function getRelativeTime(postTime) {
    const now = new Date();
    const postDate = new Date(postTime);
    const diff = now - postDate;

    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
}

function displayPostOnInterface() {
    mainPostContainer.innerHTML = ''; // Clear existing posts

    postDataArray.forEach(function(item) {
        let userTEXTPOST = item.UserTEXTPost;
        let userIMAGEPOST = item.UserIMAGEPost;
        let userWHOTOSEEPOST = item.WHOToSee;
        let postTime = item.timePosted;

        // Create a new container for each post
        let postContainer = document.createElement("div");
        postContainer.classList.add("post-container-cont");

        let userProfileAndMoreIcon = document.createElement("div");
        userProfileAndMoreIcon.classList.add("user-profile-and-moreIcon");

        let userProfile = document.createElement("div");
        userProfile.classList.add("user-profile");

        let profilePicture = document.createElement("div");
        profilePicture.classList.add("profile-picture");

        let userProfileImage = document.createElement("img");
        userProfileImage.setAttribute("src", "images/profile2.jpg");

        profilePicture.append(userProfileImage);

        let profileNameAndTimePosted = document.createElement("div");
        profileNameAndTimePosted.classList.add("profile-name-and-timePosted");

        let profileNameContainer = document.createElement("div");
        profileNameContainer.classList.add("profile-name");

        let profileName = document.createElement("p");
        profileName.textContent = `Pharkmenlee`;

        profileNameContainer.append(profileName);

        let timeOfPostContainer = document.createElement("div");
        timeOfPostContainer.classList.add("time-of-post");

        let POSTEDtime = document.createElement("div");
        POSTEDtime.classList.add("time-posted");

        let timePOSTED = document.createElement("p");
        timePOSTED.textContent = getRelativeTime(postTime);
        POSTEDtime.append(timePOSTED);

        let dividerContainer = document.createElement("div");
        dividerContainer.classList.add("time-and-who-to-divider");

        let WHOToSEEContainer = document.createElement("div");
        WHOToSEEContainer.classList.add("who-to-see");

        let whoTOSEE = document.createElement("p");
        whoTOSEE.textContent = userWHOTOSEEPOST;

        WHOToSEEContainer.append(whoTOSEE);

        timeOfPostContainer.append(POSTEDtime, dividerContainer, WHOToSEEContainer);

        profileNameAndTimePosted.append(profileNameContainer, timeOfPostContainer);

        userProfile.append(profilePicture, profileNameAndTimePosted);

        let moreIconContainer = document.createElement("div");
        moreIconContainer.classList.add("more-icon");

        let moreICON = document.createElement("i");
        moreICON.classList.add("bx", "bx-dots-horizontal-rounded");
        moreIconContainer.append(moreICON);

        userProfileAndMoreIcon.append(userProfile, moreIconContainer);

        let postContent = document.createElement("div");
        postContent.classList.add("post-content");

        let postTextContainer = document.createElement("div");
        postTextContainer.classList.add("post-text");

        let postTEXTContent = document.createElement("p");
        postTEXTContent.textContent = userTEXTPOST;

        postTextContainer.append(postTEXTContent);

        let postImageCONTAINER = document.createElement("div");
        postImageCONTAINER.classList.add("post-image");

        if (userIMAGEPOST) {
            let postIMAGEContent = document.createElement("img");
            postIMAGEContent.setAttribute("src", userIMAGEPOST);
            postImageCONTAINER.append(postIMAGEContent);
        }

        postContent.append(postTextContainer, postImageCONTAINER);

        let reactionS = document.createElement("div");
        reactionS.classList.add("reactions");

        let likeS = document.createElement("div");
        likeS.classList.add("likes");

        let likeIcon = document.createElement("i");
        likeIcon.classList.add("bx", "bx-heart");

        let likeCounts = document.createElement("p");
        likeCounts.textContent = 100;

        likeS.append(likeIcon, likeCounts);

        let commentS = document.createElement("div");
        commentS.classList.add("comments");

        let commentICon = document.createElement("i");
        commentICon.classList.add("bx", "bx-message-dots");

        let commentCount = document.createElement("p");
        commentCount.textContent = 100;

        commentS.append(commentICon, commentCount);

        let shareS = document.createElement("div");
        shareS.classList.add("shares");

        let shareIcon = document.createElement("i");
        shareIcon.classList.add("bx", "bx-share-alt");

        let shareCount = document.createElement("p");
        shareCount.textContent = 100;

        shareS.append(shareIcon, shareCount);

        reactionS.append(likeS, commentS, shareS);

        postContainer.append(userProfileAndMoreIcon, postContent, reactionS);

        mainPostContainer.append(postContainer);
    });
}

displayPostOnInterface();

