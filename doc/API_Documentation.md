#API Documentation

* **GET Movie**
    Search for a movie's information using its imdb id
    * **URL**
        /api/movie/:id
    * **Method:**
        `GET`
    *  **URL Params**
        **Required:**
        `id=[string]`
    * **Success Response:**
        **Code:** 200 SUCCESS
        **Content:** `{title: "The Ballad of Buster Scruggs", overview: "Vignettes weaving together the stories of six individuals in the old West at the end of the Civil War. Following the tales of a sharp-shooting songster, a wannabe bank robber, two weary traveling performers, a lone gold prospector, a woman traveling the West to an uncertain future, and a motley crew of strangers undertaking a carriage ride.", released: "2018-11-09", runtime: 132, trailer: "http://youtube.com/watch?v=_2PyxzSH1HM"}`
    * **Error Response:**
        **Code:** 500 INTERNAL SERVER ERROR
        **Content:** `{ error : error message }`
    * **Sample Call:**
        [http://localhost/api/movie/tt6412452](http://localhost/api/movie/tt6412452)

<br/>

* **GET Movie From Mood**
    Search for a movie based on a mood
    * **URL**
        /api/movie/mood/:mood
    * **Method:**
       `GET` 
    *  **URL Params**
        **Required:**
        `mood=[string]`
    * **Success Response:**
        **Code:** 200 SUCCESS
        **Content:** `{ id : tt6412452, name : "The Ballad of Buster Scruggs"  }`
    * **Error Response:**
        **Code:** 500 INTERNAL SERVER ERROR
        **Content:** `{ error : error message }`
    * **Sample Call:**
        [http://localhost/api/movie/mood/happy](http://localhost/api/movie/mood/happy)

<br/>

* **GET Movie From Genre**
    Search for a movie based on a genre
    * **URL**
        /api/movie/genre/:genre
    * **Method:**
        `GET` 
    *  **URL Params** 
    **Required:**
        `genre=[string]`
    * **Success Response:**
        **Code:** 200 SUCCESS
        **Content:** `{ id : tt6412452, name : "The Ballad of Buster Scruggs"  }`
    * **Error Response:**
        **Code:** 500 INTERNAL SERVER ERROR
        **Content:** `{ error : error message }`
    * **Sample Call:**
        [http://localhost/api/movie/genre/comedy](http://localhost/api/movie/genre/comedy)

<br/>

* **GET Genre List**
    Return a list of all available genres
    * **URL**
        /api/movie/genrelist
    * **Method:**
        `GET` 
    * **Success Response:**
        **Code:** 200 SUCCESS
        **Content:** `{genrelist: ["action","adventure","comedy","crime","documentary","drama","fantasy","horror","historical","musical","romance","sci_fi","war","western"]}`
    * **Error Response:**
        **Code:** 500 INTERNAL SERVER ERROR
        **Content:** `{ error : error message }`
    * **Sample Call:**
        [http://localhost/api/genrelist](http://localhost/api/genrelist)

<br/>

* **GET Mood List**
    Return a list of all available moods
    * **URL**
        /api/moodlist
    * **Method:**
        `GET` 
    * **Success Response:**
        **Code:** 200 SUCCESS
        **Content:** `{ moodlist: ["happy","sad","lonely","romantic","fearless","demotivated","curious"]}`
    * **Error Response:**
        **Code:** 500 INTERNAL SERVER ERROR
        **Content:** `{ error : error message }`
    * **Sample Call:**
        [http://localhost/api/moodlist](http://localhost/api/moodlist)