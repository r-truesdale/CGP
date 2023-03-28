import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAnalytics }  from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js";

// Initialize Firebase with your project credentials
var firebaseConfig = {
    // your Firebase configuration here
    apiKey: "AIzaSyA_kojUp7JbkEhVopquwm1iEZ726dbpnNA",
    authDomain: "qm-habitapp.firebaseapp.com",
    databaseURL: "https://qm-habitapp-default-rtdb.firebaseio.com",
    projectId: "qm-habitapp",
    storageBucket: "qm-habitapp.appspot.com",
    messagingSenderId: "560401229086",
    appId: "1:560401229086:web:4217b16f9678ffd811d50f",
    measurementId: "G-LL3PSHXV7Z"
  };
  //firebase.initializeApp(firebaseConfig);

  // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
  
  // Get a reference to the Firebase database
  var database = app.database();
  
  // Handle the form submission
  function handleSubmit(event) {
    event.preventDefault();
  
    // Get the input values from the form
    var imageFile = event.target.elements.imageFile.files[0];
    var textVariable1 = event.target.elements.textVariable1.value;
    var textVariable2 = event.target.elements.textVariable2.value;
  
    // Upload the image file to Firebase Storage
    var storageRef = app.storage().ref();
    var imageRef = storageRef.child(imageFile.name);
    imageRef.put(imageFile)
      .then(function(snapshot) {
        // Get the download URL for the image file
        imageRef.getDownloadURL()
          .then(function(downloadURL) {
            // Write the data to the Firebase database
            database.ref('items').push({
              image: downloadURL,
              textVariable1: textVariable1,
              textVariable2: textVariable2
            })
            .then(function() {
              // Redirect the user to a confirmation page or display a success message
              window.location.href = 'confirmation.html';
            });
          });
      });
  }
  
  // Attach the handleSubmit function to the form's submit event
  var form = document.getElementById('imgUpload');
  form.addEventListener('submit', handleSubmit);
  