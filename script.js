    const input = document.querySelector("input");
    const output = document.querySelector("output");
    
    let imagesArray = [];
    let currDate = new Date();
    let hoursMin = currDate.getHours().toString().padStart(2, '0') + ':' + currDate.getMinutes().toString().padStart(2, '0')+':'+currDate.getSeconds().toString().padStart(2, '0');
    let yrMonDay = currDate.getFullYear() + '-' + (currDate.getMonth()+1).toString().padStart(2, '0') + '-' + (currDate.getDay()).toString();

    let locationTaken;
    let timeTaken;

    //upload = document.getElementById(imgUpload);
    window.onload = function setup(){
        if(imagesArray.length > 0)
        {
            deleteImage();
            input.files = '';
        }
            
    }

    input.addEventListener("change", function() {
        const file = input.files;
        imagesArray.push(file[0]);
        displayImages();
        alert("Image added");
    });

    function resetImages()
    {
      let images = "";
        imagesArray.forEach((image, index) => {
          images += `<div class="image">
              <img src="${URL.createObjectURL(image)}" id="imgStar" alt="image"></img>
              
            </div>
            `

      })
      output.innerHTML = images;
    }

    function displayImages() {
        let images = "";
        imagesArray.forEach((image, index) => {
          images += `<div class="image">
              <img src="${URL.createObjectURL(image)}" id="imgStar" alt="image"></img>
              
            </div>
            <p id="TU">${hoursMin}</p>
            <p id="DU">${yrMonDay}</p>
            <p id="TT"></p>
            <p id="DT"></p>
            <p id="LT"></p>
            `

      })
      output.innerHTML = images;
        
        document.getElementById("imgUpload").hidden = true;
        
        if(isPNGFile(document.getElementById("imgUpload")))
        {
          console.log("Uploaded a PNG");
          getExifPNG(imagesArray[0]);
        }
        else
        {
          console.log("Uploaded else");
          getExif();
        }
        

        

        
    }

    function getExifPNG(image)
    {
      console.log("Getting EXIF Data");
       // get the EXIF metadata from the Image object
       const exifData = EXIF.getAllTags(image);
      
       // get the time metadata
       const time = exifData.DateTimeOriginal;
       
       // get the location metadata
       const lat = exifData.GPSLatitude;
       const latRef = exifData.GPSLatitudeRef;
       const lon = exifData.GPSLongitude;
       const lonRef = exifData.GPSLongitudeRef;

       console.log(time);
       
       // convert the latitude and longitude metadata to decimal degrees
       const latitude = (lat[0] + lat[1] / 60 + lat[2] / 3600) * (latRef === 'N' ? 1 : -1);
       const longitude = (lon[0] + lon[1] / 60 + lon[2] / 3600) * (lonRef === 'E' ? 1 : -1);
       
       // log the time and location metadata to the console
       console.log(`Time: ${time}`);
       console.log(`Location: (${latitude}, ${longitude})`);
    }

    function getExif() {
        const img = new Image();
        img.src = document.getElementById("imgStar").src;
        console.log(img);

        img.onload = function()
        {
            //img = convertToJPG(img);
            //Get Binary Function
            const cleanUrl = img.src.replace(/^blob:null\//, "");

            urlToBase64(img.src).then((base64Data) => {

            let commaIndex = base64Data.indexOf(",");
            if (commaIndex > -1) {
                base64Data = base64Data.substr(commaIndex + 1);
            }

            const raw = window.atob(base64Data);
            const rawLength = raw.length;

            const array = new Uint8Array(new ArrayBuffer(rawLength));
        
            for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
            }

            //End of get Binary// Rest of code here    
            const exifData = EXIF.readFromBinaryFile(array);

            console.log("Testing exif")
            console.log(exifData);


            //console.log("Location Start");
            const location = {
                latitude: exifData.GPSLatitude,
                longitude: exifData.GPSLongitude
              };

              console.log("Image Load End");
              console.log(location);

              timeTaken = exifData.DateTimeOriginal != null ? exifData.DateTimeOriginal : exifData.DateTime;
              locationTaken = location;

              var dateString;
              var timeString;
              var locationNorth;
              var locationEast;

              if(locationTaken.latitude == null)
              {
                console.log("no Location metadata");
                locationNorth = 51.5241;
                locationEast =  0.0404;
              }
              else
              {
                locationNorth = location.latitude[2];
                locationEast = location.longitude[2];
              }

              

              if(timeTaken == null)
              {
                console.log("no Time metadata");
                dateString = yrMonDay;
                timeString = hoursMin;
              }
              else
              {
                var datetimeArray = timeTaken.split(' ');
                dateString = datetimeArray[0].replace(/:/g, '-');
                timeString = datetimeArray[1];
              }

              

              document.getElementById("TT").innerHTML = timeString;
              document.getElementById("DT").innerHTML = dateString;
              document.getElementById("LT").innerHTML = locationNorth +","+locationEast;
            });    //Dont add any code past this point Will Cause erroes
        
    }
}

    function deleteImage(index) {
        imagesArray.splice(index, 1);
        resetImages();
        input.value = '';
        document.getElementById("imgUpload").hidden = false;
    }


    function deleteImage() {
        imagesArray = [];
        resetImages();
        input.value = '';
        document.getElementById("imgUpload").hidden = false;
    }

    function B1() {  
        deleteImage();
    }    

      function isBase64(str) {
        // regular expression to match base64 string
        const regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        return regex.test(str);
      }
      
      function isPNGFile(file) {
        const imageType = file.type;
        return imageType === 'image/png';
      }

      function convertToJPG (file) {
        var image = new Image();

        image.src = file.nativeURL;
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);

        image.onload = function(){
          //save to temp location??

          file.createWriter(function(fileWriter) {

            file.onWriteEnd = function(e) {
              console.log('Write completed.');
            };

            file.onError = function(e) {
              console.log('Write failed: ' + e.toString());
            };

            // Create a new Blob and write it to log.txt.
            var ui8a = convertDataURIToBinary(image);

            var blob = new Blob(ui8a.buffer, {type: "image/jpeg"});

            fileWriter.write(blob);

          }, errorHandler);
        };

        image.src = canvas.toDataURL("image/jpg");
        return image;
      };

      function urlToBase64(url) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            const reader = new FileReader();
            reader.onloadend = function() {
              resolve(reader.result);
            }
            reader.readAsDataURL(xhr.response);
          };
          xhr.onerror = function() {
            reject(new Error('Failed to load image'));
          }
          xhr.open('GET', url);
          xhr.responseType = 'blob';
          xhr.send();
        });
      }

     