    //Piexifjs
    // Modules required for most of these exercises
    var fs = require('fs');
    var piexifjs = require('piexifjs');
    
    import { readFileSync } from 'fs';
    import { load } from 'piexifjs';

    // Handy utility functions
    const getBase64DataFromJpegFile = filename => readFileSync(filename).toString('binary');
    const getExifFromJpegFile = filename => load(getBase64DataFromJpegFile(filename));

    //const palm1Exif = getExifFromJpegFile("./images/palm tree 1.jpg");
    
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
    var palm1Exif = getExifFromJpegFile(imagesArray[0]);
    console.log(palm1Exif);
    /*    
    var img1 = document.getElementById("imgStar");
    console.log("Attempting to retireve Metadata");
    EXIF.getData(img1, function () {
      var MetaData = EXIF.getAllTags(this);
      console.log(JSON.stringify(MetaData, null, "\t"));
    });
    */
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