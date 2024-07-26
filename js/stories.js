"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, isOwnStory = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //Adding logic for logged in user to have favorite/unfavorite star displayed next to story
  const showStar = Boolean(currentUser);
  const showTrash = Boolean(currentUser && isOwnStory)

  return $(`
      <li id="${story.storyId}">

        <div>
        ${showStar ? getStarHTML(story, currentUser) : ""}
        ${showTrash ? getDeleteButtonHTML(currentUser) : ""}

        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>        
        <small class="story-user">posted by ${story.username}</small> 
        
        <div>
      </li>
      
    `);
}


/** Generates star fpr favoriting/unfavoriting a story */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fa-solid" : "fa-regular";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>         
      </span>`;
}

/* Generates a trash icon for deleting a story */

function getDeleteButtonHTML(){
  return`
    <span class = "trash-icon">
      <i class = "fa-regular fa-trash-can"></i>
      </span>
  `
}



/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function addNewStory(evt) {
  console.debug("addNewStory");
  evt.preventDefault();

  //get data from form
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();
  //hardcoding username for now
  const username = 'Test';
  const storyData = {author, title, url, username};

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  //hide and reset the form
  $addStoryForm.hide();
  $addStoryForm.trigger("reset");


}

$addStoryForm.on("submit", addNewStory);

/* Handles deleting a story */

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putUserStoriesOnPage();
}

$userStoriesList.on("click", ".trash-icon", deleteStory);

/* Showing list of users' own stories */

function putUserStoriesOnPage(){
  console.debug("putUserStoriesOnPage");

  $userStoriesList.empty();

  if (currentUser.ownStories.length === 0){
    $userStoriesList.append("<h4>No stories added by user yet! </h4>");
  }else {
    for (let story of currentUser.ownStories){
      let $story = generateStoryMarkup(story, true);
      $userStoriesList.append($story);
    }
  }

  $userStoriesList.show();


}


/* Put users' favorited stories list on page */

function putFavoritedStoriesListOnPage(){
  console.debug("putFavoritedStoriesListOnPage");

  $favoritedStoriesList.empty();

  if (currentUser.favorites.length === 0){
    $favoritedStoriesList.append("<h4>No favorites added! </h4>");
  }else {
    for (let story of currentUser.favorites){
      let $story = generateStoryMarkup(story);
      $favoritedStoriesList.append($story);
    }
  }

  $favoritedStoriesList.show();
}

/* Handling toggling favorite/unfavorite story */

//START HERE: NOT SURE IF TOGGLING LOGIC IS CORRECT

async function toggleFavoriteStory(evt){
  console.debug("toggleFavoriteStory");

  const $tgt = $(evt.target);
  console.log($tgt);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  /* check if item is already favorited */
  try {
    if ($tgt.hasClass("fa-regular")) {
      await currentUser.addFavorite(story);
      $tgt.removeClass("fa-regular").addClass("fa-solid");
    } else {
      await currentUser.removeFavorite(story);
      $tgt.removeClass("fa-solid").addClass("fa-regular");
    }
  } catch (err) {
    console.error("Error toggling favorite status:", err);
  } 
}

// $storiesLists.on("click", ".star", toggleFavoriteStory);

$allStoriesList.on("click", ".star", toggleFavoriteStory);
$userStoriesList.on("click", ".star", toggleFavoriteStory);
$favoritedStoriesList.on("click", ".star", toggleFavoriteStory);