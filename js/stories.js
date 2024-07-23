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

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //Adding logic for logged in user to have favorite/unfavorite star displayed next to story
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">

        <div>
        ${showStar ? getStarHTML(story, currentUser) : ""}

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

//Code to add star to page:
/* code from sb solution */
/** Make favorite/not-favorite star for story */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fa-solid" : "fa-regular";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>         
      </span>`;
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
  if ($tgt.hasClass("fa-star")){
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fa-solid")
    
  }else{
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fa-regular");
  } 
}

$allStoriesList.on("click", ".star", toggleFavoriteStory);