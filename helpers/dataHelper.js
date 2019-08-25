//Define dependencies
const axios = require('axios');
const similarity = require('string-similarity');
const forbiddenWords = ['game', 'launch', 'book', 'reveal'];

module.exports = {
    /**
     * Gets the query parameter and returns an object that contains movie infos and movie's youtube video ID
     *
     * @param {String} query - String that required to be searched
     * @return {Object} Final object that contains movie infos
     *
     */
    getSearchResult: function (query) {
        try {
            var finalObject = [];
            //Define URl
            var url = 'http://www.omdbapi.com/?apikey=' + process.env.OMDB_API_KEY + '&type=movie&s=' + query.split(' ').join('+');

            //Make request to defined URL and return the result
            return axios.get(url).then(async response => {
                var result = response.data.Search;

                //Handle no result
                if (!result) {
                    return {
                        Message: "There is no result for your search."
                    }
                }

                const promisesToAwait = [];

                //Make promise for video call and push movie informations to finalObject 
                for (var i = 0; i < result.length; i++) {
                    promisesToAwait.push(getVideoInfo(result[i].Title, result[i].Year));

                    finalObject.push({
                        name: result[i].Title,
                        year: result[i].Year,
                        imdbID: result[i].imdbID,
                        image: result[i].Poster !== 'N/A' ? result[i].Poster : null
                    });
                }

                //Make symmetric calls for all promised
                const responses = await Promise.all(promisesToAwait);

                //Assign Youtube video ID's to related movie object
                for (var j = 0; j < finalObject.length; j++) {
                    finalObject[j].youtubeID = responses[j];
                }

                return finalObject;
            });
        } catch (e) {
            //Log error
            console.log(e);
        }
    }
}

/**
 * Gets video infos for required movie
 *
 * @param {String} movieName - Required movie's name
 * @param {String} movieYear - Required movie's year
 * @return {String} Movie's Youtube ID
 *
 */
function getVideoInfo(movieName, movieYear) {
    //Define proper URL for call
    var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=' + movieName.replace(/[^A-Za-z0-9\s!?-]/g, "").replace(/ /g, "+").toLowerCase() + '+trailer+official+' + movieYear +'&type=video&key=' + process.env.YOUTUBE_API_KEY + '&fields=items/id/videoId,items/snippet/title'
    console.log(url);
    //Make the call for specified URL and return specific result
    return axios.get(url).then(response => {

        var videoID = null;
        var result = 0;
        var tempSimilarityResult = 0;
        var compareString = movieName + ' trailer official';
        var isForbiddenTitle;

        for (var i = 0; i < response.data.items.length; i++) {
            isForbiddenTitle = false;

            //TODO: Get rid of nested loops for best practice
            for (var j = 0; j < forbiddenWords.length; j++) {
                if (movieName.toLowerCase().indexOf(forbiddenWords[j]) === -1  && response.data.items[i].snippet.title.toLowerCase().indexOf(forbiddenWords[j]) !== -1) {
                    isForbiddenTitle = true;
                    break;
                }
            }

            if (isForbiddenTitle) {
                continue;
            }

            tempSimilarityResult = similarity.compareTwoStrings(compareString.toLowerCase(), response.data.items[i].snippet.title.toLowerCase());
            console.log(movieName + ' trailer ' + movieYear + ' - ' + response.data.items[i].snippet.title);
            console.log(tempSimilarityResult);
            console.log(' ');
            if (tempSimilarityResult > 0.6 && tempSimilarityResult > result) {
                result = tempSimilarityResult;
                videoID = response.data.items[i].id.videoId;
            }
        }
        return videoID;
    });
}