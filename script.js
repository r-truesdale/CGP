    // import inatjs from "inaturalistjs-main\build\inaturalistjs.js";
    // inatjs.observations.search({ taxon_id: 4 }).then( rsp => { });

    const input = document.querySelector("input");
    const output = document.querySelector("output");
    
    let imagesArray = [];
    let currDate = new Date();
    let hoursMin = currDate.getHours() + ':' + currDate.getMinutes();

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

    function displayImages() {
        let images = "";
        imagesArray.forEach((image, index) => {
            images += `<div class="image">
                <img src="${URL.createObjectURL(image)}" id="imgStar" alt="image"></img>
                
              </div>
              <h1 id="b1">Time uploaded-${hoursMin}</h1>
              `

        })
        output.innerHTML = images;
        console.log(imagesArray[0].lastModifiedDate);
        document.getElementById("imgUpload").hidden = true;
        getExif();
    }

    function getExif() {
        const img = new Image();
        img.src = document.getElementById("imgStar").src;
        console.log(img);

        img.onload = function()
        {
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

              var meta = document.getElementById("meta");
                meta.innerHTML = `${exifData != "false" ? "Meta Data Below" : "No metadata"}`;

                var timestamp = document.getElementById("dateTime");
                timestamp.innerHTML = `${exifData.DateTimeOriginal != null ? exifData.DateTimeOriginal : exifData.DateTime}`;

                var descriptionText = document.getElementById("desc");
                descriptionText.innerHTML = `${exifData.ImageDescription}`;

                var make = document.getElementById("make");
                make.innerHTML = `${exifData.Make}`;
                var model = document.getElementById("model");
                model.innerHTML = `${exifData.Model}`;
                
                var dsd = document.getElementById("dsd");
                dsd.innerHTML = `${exifData.DeviceSettingDescription}`;

                var gps = document.getElementById("GPS");
                gps.innerHTML = `${exifData.GPSInfoIFDPointer}}`;

                var locationText = document.getElementById("loc");
                locationText.innerHTML = `${location}}`;

                var software = document.getElementById("software");
                software.innerHTML = `${exifData.Software}`;

                var artist = document.getElementById("meta");
                artist.innerHTML = `${exifData.Artist}`;
            });    //Dont add any code past this point Will Cause erroes
        
    }
}

    function deleteImage(index) {
        imagesArray.splice(index, 1);
        displayImages();
        input.value = '';
        document.getElementById("imgUpload").hidden = false;
    }

    function deleteImage() {
        imagesArray = '';
        displayImages();
        input.value = '';
        document.getElementById("imgUpload").hidden = false;
    }

    function uploadEntry(){
        alert("Upload Complete");  
    }

    function B1() {  
        deleteImage();
        alert("This is button 1");  
    }    
    function B2() {  
        alert("This is button 2");  
    }    
    function B3() {  
        alert("This is button 3");  
    }    
    function B4() {  
        alert("This is button 4");  
    }    
    function B5() {  
        alert("This is button 5");  
    }    

      function isBase64(str) {
        // regular expression to match base64 string
        const regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        return regex.test(str);
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