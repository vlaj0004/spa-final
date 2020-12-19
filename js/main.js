//app is for general control over the application
//and connections between the other components
const APP = {
  init: () => {
      document.querySelector('#btnSearch').addEventListener('click', SEARCH.searchFunc);
      location.hash = '';
  },
};

const SEARCH = {
  results:[],
  searchFunc(ev){
    //FETCH ELEMENTS
    ev.preventDefault();
    const APP_KEY = '5b5a2dc2d24b2a07b59e957580e1c0c1';
    const query = document.getElementById('search').value;
    let baseURL = `https://api.themoviedb.org/3/search/person?api_key=${APP_KEY}&query=${query}`;
    //FETCH
    fetch(baseURL)
    .then(function(response){
      if(response.ok){
        return response.json();
      }else{
        throw new Error(`${response.status} ${response.statusText}`);
      }
    })
    .then(function(data){
      SEARCH.results = data.results;
      console.log('dog', SEARCH.results);
      ACTORS.actorFunc();
      // APP.STORAGE.storageFunc();
      location.hash = '';
      location.hash = query;
      document.getElementById('instructions').classList.remove('active');
      document.getElementById('actors').classList.add('active');
      document.querySelector('#media').innerHTML = '';
    })
    .catch(function (err) {
      console.error(err);
    });
  }
};


const ACTORS = {
  actorFunc(){
    //ACTOR SETUP
      let actorContent = document.querySelector('section#actors div.content');
      let df = document.createDocumentFragment();
      
      actorContent.innerHTML = '';
      //FOR EACH
      SEARCH.results.forEach((results) => {
        let cardDiv = document.createElement('div');
        let imgDiv = document.createElement('div');
        imgDiv.setAttribute('class', 'avatar');
        cardDiv.setAttribute('data-actors', results.id);

        //ACTOR IMG
        let actorImg = document.createElement('img');
        actorImg.src = `https://image.tmdb.org/t/p/w185${results.profile_path}`;
        
        if(results.profile_path === null){
          actorImg.classList.add('hidden');
          let noImg = document.createElement('p');
          noImg.textContent = 'No image to display';
          noImg.setAttribute('class', 'invalid');
          imgDiv.append(noImg);
        }
        
        //ACTOR NAME
        let actorName = document.createElement('h1');
        actorName.setAttribute('class', 'name');
        actorName.textContent = results.name;

        if(actorName === null){
          actorName.classList.add('hidden');
        }

        //ACTOR POPULARITY
        let actorRate = document.createElement('h3');
        actorRate.setAttribute('class', 'subInfo');
        popularity = results.popularity.toFixed(0);
        
        if(popularity >= 9){
          actorRate.textContent = '⭐ ⭐ ⭐ ⭐ ⭐';
        }else if(popularity >= 7){
          actorRate.textContent = '⭐ ⭐ ⭐ ⭐';
        }else if(popularity >= 5){
          actorRate.textContent = '⭐ ⭐ ⭐';
        }else if(popularity >= 3){
          actorRate.textContent = '⭐ ⭐';
        }else if(popularity >= 0){
          actorRate.textContent = '⭐';
        }

        if(actorRate === null){
          actorRate.classList.add('hidden');
        }
        
        //APPEND
        imgDiv.append(actorImg);
        df.append(imgDiv);
        df.append(actorName);
        df.append(actorRate);
        cardDiv.append(df);
        actorContent.append(cardDiv);

        cardDiv.setAttribute('class', 'card');
        cardDiv.addEventListener('click', MEDIA.mediaFunc);
        cardDiv.addEventListener('click', STORAGE.storageFunc);
      });
  }
};


const MEDIA = {
  mediaFunc(ev){
    ev.preventDefault();
    let actorInfo = SEARCH.results.filter(actorResult => actorResult.id == ev.currentTarget.getAttribute('data-actors'));

    location.hash = '';
    location.hash = SEARCH.results.id;
    console.log(location.hash);

    //MEDIA SETUP
    // let mediaContent2 = document.querySelector('section#actors div.content');
    let df = document.createDocumentFragment();
    // mediaContent2.innerHTML = '';
    console.log(actorInfo[0]);

    //H2
    let h2 = document.createElement('h2');
    h2.textContent = 'Media';
    
    //SWITCH PAGE
    let mediaContent = document.getElementById('media');
    mediaContent.classList.add('active');
    let actorsPage = document.getElementById('actors');
    actorsPage.classList.remove('active');

    let cardDiv = document.createElement('div');
    
    //FOR EACH
    actorInfo[0].known_for.forEach(movie => {
      let eachCard = document.createElement('div');
      eachCard.setAttribute('data-media', movie.id);
      console.log(movie.backdrop_path);
      console.log(cardDiv);
      let imgDiv = document.createElement('div');
      imgDiv.setAttribute('class', 'avatar');

      //MEDIA IMG
      let mediaImg = document.createElement('img');
      mediaImg.src = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;

      if(movie.poster_path === null){
        mediaImg.classList.add('hidden');
        let noImg = document.createElement('p');
        noImg.textContent = 'No image to display';
        noImg.setAttribute('class', 'invalid');
        imgDiv.append(noImg);
      }

      //MEDIA NAME
      let mediaName = document.createElement('h1');
      mediaName.setAttribute('class', 'name');

      if(movie.title){
        mediaName.textContent = movie.title
      }else if(movie.name){
        mediaName.textContent = movie.name;
      }else{
        mediaName.textContent = 'No name to be found';
        mediaName.setAttribute('class', 'invalid');
      }

      //MEDIA YEAR
      let mediaYear = document.createElement('h3');
      mediaYear.setAttribute('class', 'subInfo');

      if(movie.release_date){
        let year = new Date(movie.release_date);
        mediaYear.textContent = `(${year.getFullYear()})`;
      }else{
        let year = new Date(movie.first_air_date);
        mediaYear.textContent = `(${year.getFullYear()})`;
      }

      if(mediaYear === null){
        movieYear.classList.add('hidden');
      }

      eachCard.setAttribute('class', 'card');
      cardDiv.setAttribute('class', 'apiContent');

      //APPEND
      imgDiv.append(mediaImg);
      df.append(imgDiv);
      df.append(mediaName);
      df.append(mediaYear);
      eachCard.append(df)
      cardDiv.append(eachCard);

    });

    //BUTTON
    let backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.setAttribute('id', 'btnBack');

    mediaContent.append(h2);
    cardDiv.append(backButton);
    mediaContent.append(cardDiv);
    
    backButton.addEventListener('click', BACK.goBack);
  }
};

const BACK = {
  goBack(ev){
    ev.preventDefault();
    let mediaContent = document.getElementById('media');
    mediaContent.classList.remove('active');
    mediaContent.innerHTML = '';

    let actorsPage = document.getElementById('actors');
    actorsPage.classList.add('active');
  }
}

//storage is for working with localstorage
const STORAGE = {
  storageFunc(){
    let firstName = document.getElementById('search').value;
    // console.log(firstName);

    localStorage.setItem('name', firstName);
  }
};

//nav is for anything connected to the history api and location
const NAV = {
  switchPage(page){
    //hide all pages except the one with the id `page`
    
  }
};

//Start everything running

// APP.init();
document.addEventListener('DOMContentLoaded', APP.init);