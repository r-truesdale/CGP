// const fs = require('fs');
// const PNG = require('pngjs').PNG;
    
    const input = document.querySelector("input");
    const output = document.querySelector("output");
    
    let imagesArray = [];
    let currDate = new Date();
    let hoursMin = String(currDate.getHours()).padStart(2, '0') + ':' + String(currDate.getMinutes()).padStart(2, '0')+':'+String(currDate.getSeconds()).padStart(2, '0');
    let yrMonDay = currDate.getFullYear() + '-' + String(currDate.getMonth()+1).padStart(2, '0') + '-' +String(currDate.getDate()).padStart(2,"0");

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
            <p id="TU" hidden>${hoursMin}</p>
            <p id="DU" hidden>${yrMonDay}</p>
            <p id="TT" hidden></p>
            <p id="DT" hidden></p>
            <p id="LT" hidden></p>
            `

      })
      output.innerHTML = images;
        
        document.getElementById("imgUpload").hidden = true;
       
        if(isPNGFile(imagesArray[0]))
        {
          console.log("Uploaded a PNG");
          getExifPNG(imagesArray[0]);
        }
        else
        {
          if (imagesArray[0].type === "image/heic") {
            console.error("File is a HEIC image.");
            // Convert HEIC to JPEG
            heic2any({
              blob: file,
              toType: "image/jpeg",
              quality: 0.7
            }).then(function(jpegBlob) {
              file = jpegBlob; // overwrite the original file with the converted JPEG image
              // continue with metadata extraction using the new `file` variable
            }).catch(function(error) {
              console.error("Error converting HEIC to JPEG:", error);
            });
          }

            console.log("Uploaded jpeg");
          getExif();
            }
        

        

        
    }

    function getExifPNG(file)
    {
      // Load the file using the FileReader API
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        // Create a DataView object from the ArrayBuffer
        const dataView = new DataView(reader.result);

        // Check that the file is a PNG image
        if (dataView.getUint32(0) !== 0x89504e47 || dataView.getUint32(4) !== 0x0d0a1a0a) {
          console.error("File is not a PNG image.");
          return;
        }

        // Parse the PNG chunks to extract metadata
        let pos = 8;
        let dateTimeOriginal = null;
        let latitude = null;
        let longitude = null;

        while (pos < dataView.byteLength) {
          // Get the length and type of the chunk
          const length = dataView.getUint32(pos);
          const type = String.fromCharCode(dataView.getUint8(pos + 4), dataView.getUint8(pos + 5), dataView.getUint8(pos + 6), dataView.getUint8(pos + 7));

          // Check if the chunk contains metadata we're interested in
          if (type === "tEXt") {
            // Extract the date/time original information
            const text = new TextDecoder().decode(dataView.buffer.slice(pos + 8, pos + 8 + length));
            if (text.startsWith("Date Time Original:")) {
              dateTimeOriginal = text.slice(20);
            }
          }  
          if (type === "iCCP") {
            // Extract the location information
            const text = new TextDecoder().decode(dataView.buffer.slice(pos + 8, pos + 8 + length));
            const match = /GPSLatitude: ([\d\.]+) GPSLongitude: ([\d\.]+)/.exec(text);
            if (match) {
              latitude = match[1];
              longitude = match[2];
            }
          }
          if (type === "iTXt") {
            // Extract the date/time original information
            const text = new TextDecoder().decode(dataView.buffer.slice(pos + 8, pos + 8 + length));
            if (text.startsWith("Date Time Original:")) {
              dateTimeOriginal = text.slice(20);
            }
          }
          if (type === "gAMA") {
            // Extract the location information
            const text = new TextDecoder().decode(dataView.buffer.slice(pos + 8, pos + 8 + length));
            const match = /GPSLatitude: ([\d\.]+) GPSLongitude: ([\d\.]+)/.exec(text);
            if (match) {
              latitude = match[1];
              longitude = match[2];
            }
          }

          // Move to the next chunk
          pos += length + 12;
        }

        // Do something with the extracted metadata
        console.log("Date/time original:", dateTimeOriginal);
        console.log("Location:", latitude && longitude ? `${latitude}, ${longitude}` : null);
      
              timeTaken = dateTimeOriginal != null ? dateTimeOriginal : null;

              var dateString;
              var timeString;
              var locationNorth = latitude;
              var locationEast = longitude;

              if(latitude == null)
              {
                console.log("no Location metadata");
                const min1 = 51.52212253745709;
                const max1 = 51.52771291222913;

                const min2 = -0.039975680525528745;
                const max2 = -0.04455961576196161;

                const randomNum1 = Math.random() * (max1 - min1) + min1;
                const randomNum2 = Math.random() * (min2 - max2) + max2;
                locationNorth = randomNum1;
                locationEast =  randomNum2;
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
      
      };
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
            var location = {
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
                const min1 = 51.52212253745709;
                const max1 = 51.52771291222913;

                const min2 = -0.039975680525528745;
                const max2 = -0.04455961576196161;

                const randomNum1 = Math.random() * (max1 - min1) + min1;
                const randomNum2 = Math.random() * (min2 - max2) + max2;
                locationNorth = randomNum1;
                locationEast =  randomNum2;
              }
              else
              {
                location = convertToLatLong(location.latitude[0], location.latitude[1], location.latitude[2], location.longitude[0], location.longitude[1], location.longitude[2]);
                locationNorth = location.latitude;
                locationEast = location.longitude;
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
        console.log("Png Uploaded");
        return imageType === 'image/png';
      }

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

      function convertToLatLong(latitudeDegrees, latitudeMinutes, latitudeSeconds, longitudeDegrees, longitudeMinutes, longitudeSeconds)
      {
        // Convert degrees, minutes, and seconds to decimal degrees
        const latitudeDecimal = latitudeDegrees + (latitudeMinutes/60) + (latitudeSeconds/3600);
        const longitudeDecimal = -1 * (longitudeDegrees + (longitudeMinutes/60) + (longitudeSeconds/3600));

        // Create a latitude and longitude object
        const coordinates = {
          latitude: latitudeDecimal,
          longitude: longitudeDecimal
        };
        return coordinates;
      }

     