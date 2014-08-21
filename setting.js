var oauth = {
  "google": {
    "GOOGLE_APP_ID": null,
    "GOOGLE_APP_SECRET": null,
    "callbackURL": null
  }
}

switch(process.NODE_ENV){
  case "dev":
    console.log("Node mode : dev");
    oauth.google = {
      "GOOGLE_APP_ID": "994714572327-7vm56ecmedqdgeelem26ci9vu6ji76hg.apps.googleusercontent.com",
      "GOOGLE_APP_SECRET": "30Ujwwh_R5AO2hopwolneBs5",
      "callbackURL": "http://localhost:4000/auth/google/callback"
    }
    break;
  case "pro":
    console.log("Node mode : pro");
    oauth.google = {
      "GOOGLE_APP_ID": "994714572327-1rt0im4unhkai7brfp5mk904llu1kd3p.apps.googleusercontent.com",
      "GOOGLE_APP_SECRET": "uA6A1WKOksw63OgKP-kYY29Q",
      "callbackURL": "http://aedilis5.vps.phps.kr:4000/auth/google/callback"
    }
    break;
  case "test":
  default:
    console.log("Node mode : default");
    oauth.google = {
      "GOOGLE_APP_ID": "994714572327-7vm56ecmedqdgeelem26ci9vu6ji76hg.apps.googleusercontent.com",
      "GOOGLE_APP_SECRET": "30Ujwwh_R5AO2hopwolneBs5",
      "callbackURL": "http://localhost:4000/auth/google/callback"
    }
}

exports.oauth = oauth;
