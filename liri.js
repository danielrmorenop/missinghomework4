var dotenv = require("dotenv").config();
var keys = require("./keys");
var axios = require("axios")
var Spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require("fs");


var spotify = new Spotify(keys.spotify)

function addText(value) {
    fs.appendFile("log.txt", value, function(err) {
      if (err) {
        return console.log(err);
      }
    });
    console.log("entered " + value + ".");
  }

switch(process.argv[2]){
    case "concert-this":
        var artist = process.argv.slice(3).join(" ");
        axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function(response){
        response.data.forEach(place => {
            console.log(place.venue.name)
            var city = place.venue.city + ", " + place.venue.country + "."
            var date = moment(place.datetime).format("dddd, MMMM Do YYYY, h:mm:ss a")
            console.log(place.venue.city + ", " + place.venue.country + ".")
            console.log(moment(place.datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"));
            console.log("--------------------");
            var value = `Artist: ${artist} \nVenue: ${place.venue.name}\nPlace: ${city}\nDate: ${date}\n\n`;
            addText(value);
        });
    })
    break;

    case "spotify-this-song":
    var song = process.argv.slice(3).join(" ");
    if(process.argv[3] == null){
        song = "The Sign";
    }
    spotifyfunction(song);
    function spotifyfunction(song){
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       data.tracks.items.forEach(function(artist){
        console.log("Artist: " + artist.artists[0].name);
        console.log("Song: " + artist.name); 
        console.log("Album: " + artist.album.name);
        console.log("Spotify URL: " + artist.external_urls.spotify);
        console.log("----------------------");
        var value = `Artist: ${artist.artists[0].name} \nSong: ${artist.name}\nAlbum: ${artist.album.name}\nSpotify URL: ${artist.external_urls.spotify}\n\n`;
        addText(value);
       })
       
      });
    }
    break;

    case "movie-this":
    var movies = process.argv.slice(3).join(" ");
    if(process.argv[3] == null){
        movies = "Mr.Nobody"
    }
    axios.get("http://www.omdbapi.com/?t="+movies+"&y=&plot=short&apikey=trilogy").then(
    function(response) {
    console.log("title: "+response.data.Title);
    console.log("Year: "+response.data.Year);
    console.log("Rated: "+ response.data.Rated);
    console.log(response.data.Ratings[1].Source + " scores: "+ response.data.Ratings[1].Value);
    console.log("Country: " + response.data.Country);
    console.log("Language: "+ response.data.Language)
    console.log("Actors: "+response.data.Actors)
    console.log("Plot: "+response.data.Plot)
    var value = `Movie title: ${response.data.Title}\nYear released: ${response.data.Year}\nRated: ${response.data.Rated}\n${response.data.Ratings[1].Source} score: ${response.data.Ratings[1].Value}\nCountry filmed: ${response.data.Country}\nLanguages available: ${response.data.Language}\nCast: ${response.data.Actors}\nPlot: ${response.data.Plot}\n\n`;
    addText(value);
    }
    );
    break;

    case "do-what-it-says":
    fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    dataArr = data.split(",");
    console.log(dataArr[1]);
    spotifyfunction(dataArr[1]);
    addText();
    });
    break;
}


