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
        // Read the file as a binary string

    const exifData = EXIF.readFromBinaryFile(getBinary(imagesArray[0]));
    console.log(exifData);

    const location = {
        latitude: exifData.GPSLatitude,
        longitude: exifData.GPSLongitude
      };
      const timestamp = exifData.DateTimeOriginal;

      // Do something with the location and time data
      console.log(location);
      console.log(timestamp);

      
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
    function B4() {  +
        alert("This is button 4");  
    }    
    function B5() {  
        alert("This is button 5");  
    }    

    // Convert a data URL to a binary string
function getBinary(dataUrl) {
    const BASE64_MARKER = ';base64,';
    const base64Index = dataUrl.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataUrl.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));
  
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
  
    return array;
  }