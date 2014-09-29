
var insertTestData = function(){
  var  userInfo= {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'
      };

  var pageDir = [
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      dirInfo: {
        name: "myDir",
        path: "/"
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      dirInfo: {
        name: "myDir2",
        path: "/"
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      dirInfo: {
        name: "childDir1",
        path: "/myDir/"
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      dirInfo: {
        name: "myDir3",
        path: "/"
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      dirInfo: {
        name: "myDir4",
        path: "/"
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      dirInfo: {
        name: "childDir2",
        path: "/myDir/"
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      dirInfo: {
        name: "childDir3",
        path: "/myDir2/"
      }
    }
  ];

  var testEntryData = [
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      pageInfo: {
        title: "google",
        path: "/",
        content: "google page",
        url: "http://www.google.co.kr",
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      pageInfo: {
        title: "naver",
        path: "/",
        content: "naver page",
        url: "http://www.naver.com",
      }
    },
    {
      userInfo: {
        email: "widianpear@gmail.com",
        name: '배병욱',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      },
      pageInfo: {
        title: "daum",
        path: "/myDir/",
        content: "daum page",
        url: "http://www.daum.net",
      }
    }
  ];

  mongodb_handler.insert_user(userInfo,function(){
    var i;
    for(i in testDirData){
      mongodb_handler.insert_pageDir(testDirData[i],function(err, data){
        var result = dbResult_handler(err, data);
        // console.log(i,'insert Dir',result);
      });
    }
  });
  //   for(i in testEntryData){
  //     mongodb_handler.insert_pageEntry(testEntryData[i],function(err, data){
  //       var result = dbResult_handler(err, data);
  //       // console.log(i,'insert Entry',result);
  //     });
  //   }
  // });
}
// insertTestData();
