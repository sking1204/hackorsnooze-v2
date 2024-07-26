"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $storiesContainer.show();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/* Show story submit form when user clicks on "submit" link */
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt); 
  hidePageComponents();
  $allStoriesList.show();  
  $addStoryForm.show();   
  
}
$navSubmitStoryForm.on("click", navSubmitClick);

/* Show users' own stories list when user clicks on "my stories" link */

function navMyStoriesSelect(evt) {
  console.debug("navMyStoriesSelect", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $userStoriesList.show();
}


$navShowUserStoriesList.on("click", navMyStoriesSelect);

/* Show favorite stories when "favorites" is clicked */
function navFavoritesClick(evt){
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritedStoriesListOnPage();
}

$navShowFavorites.on("click", navFavoritesClick);

//NEW 7/25
/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide()
}

$navLogin.on("click", navLoginClick);

/** Hide everything but profile on click on "profile" */

function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $storiesContainer.hide();
  $userProfile.show();
}

$navUserProfile.on("click", navProfileClick);

//END NEW 7/25


/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
