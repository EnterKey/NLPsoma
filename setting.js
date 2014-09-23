var oauth = {
  "google": {
    "GOOGLE_APP_ID": null,
    "GOOGLE_APP_SECRET": null,
    "callbackURL": null
  }
}

var data = {
  hashkey : "2YV33p2HKhirqYWb" // Random String length : 16
}

switch(process.env.NODE_ENV){
  case "dev":
    console.log("Node mode : dev");
    oauth.google = {
      "GOOGLE_APP_ID": "371816793466-s68muv1k5gob0gq7pn0blv6lb97l9i9c.apps.googleusercontent.com",
      "GOOGLE_APP_SECRET": "YtakTTgVw21lNnjWU3GHJIep",
      "callbackURL": "http://localhost:4000/auth/google/callback"
    }
    break;
  case "pro":
    console.log("Node mode : pro");
    oauth.google = {
      "GOOGLE_APP_ID": "371816793466-arbhv87h7rljd6grcgrena0d42tdgiuq.apps.googleusercontent.com",
      "GOOGLE_APP_SECRET": "DMdx3ZPzeqZq8MBW_Fmwwnz-",
      "callbackURL": "http://aedilis5.vps.phps.kr:4000/auth/google/callback"
    }
    break;
  case "test":
  default:
    console.log("Node mode : default");
    oauth.google = {
      "GOOGLE_APP_ID": "371816793466-s68muv1k5gob0gq7pn0blv6lb97l9i9c.apps.googleusercontent.com",
      "GOOGLE_APP_SECRET": "YtakTTgVw21lNnjWU3GHJIep",
      "callbackURL": "http://localhost:4000/auth/google/callback"
    }
}

exports.oauth = oauth;
exports.data = data;
