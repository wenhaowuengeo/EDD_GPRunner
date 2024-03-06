//upload input file
function uploadFile() {
  console.log("file uploaded!");
  var file = document.getElementById("customFile").files[0];
  if (file) {
    console.log("file is uploaded");
    //if a file is uploaded
    var fileInfoDiv = document.getElementById("fileInfo");
    fileInfoDiv.innerHTML =
      "<p>You've uploaded this file: " + file.name + "</p>";
    // fileInfoDiv.innerText = "file name: ${file.name}";

    //Not working:
    // readXlsxFile(file).then(function(rows){
    //   console.log(rows);
    // })

    console.log("file", file);
    console.log("type of file", typeof file);
    console.log("json file", JSON.stringify(file));

    // //fileReader
    // var fileReader = new FileReader();
    // fileReader.onload = function (event) {
    //   var data = event.target.result;

    //   var workbook = XLSX.read(data, {
    //     type: "binary",
    //   });
    //   workbook.SheetNames.forEach((sheet) => {
    //     let rowObject = XLSX.utils.sheet_to_row_object_array(
    //       workbook.Sheets[sheet]
    //     );
    //     let jsonObject = JSON.stringify(rowObject);
    //     document.getElementById("jsonData").innerHTML = jsonObject;
    //     console.log("read file obj", jsonObject);
    //   });
    // };
    // fileReader.readAsBinaryString(file);
    
  }
}

var htmlStr = "";

//onclick event
function runFunc() {
  //import Geoprocessor from "@arcgis/core/rest/geoprocessor";
  console.log("run button is clicked");

  //trigger GP service
  require(["esri/tasks/Geoprocessor", "esri/rest/support/JobInfo"], (
    Geoprocessor,
    JobInfo
  ) => {
    // console.log("before gp def");
    var gp = new Geoprocessor(
      //TODO - replace this with the EDD GP service
      // "https://mygis.engeo.com/server/rest/services/CAF_23777/siteacessemailto/GPServer/siteacessemailto/"
      "https://mygis.engeo.com/server/rest/services/APIs/eddconvertor2/GPServer/EDD%20Converter"
    );

    //TODO - parse the input parameters frm the file upload
    //define the input parameters
    // var params = {
    //   "Input_Feature": "",
    // };

    //submit the gp service
    // console.log("before gp submission");

    gp.submitJob()
      .then(function (jobInfo) {
        // gp.execute().then(function(jobInfo){ //CANNOT use execute() since the GP service job itself is defined as submitJob() operation
        // const jobid = jobInfo.jobId;
        // console.log("job id: ", jobid);

        var progressDiv = document.createElement("div");
        progressDiv.setAttribute("id", "progressText");
        progressDiv.innerText = "Task is running ... ";
        progressDiv.style.margin = "5px 15px 5px";
        progressDiv.style.fontSize = "1.0em";
        progressDiv.style.textAlign = "center";
        document.getElementsByTagName("div")[0].appendChild(progressDiv);

        var runButton = document.getElementById("runButtonID");
        runButton.style.background = "grey";
        runButton.style.border = "grey";
        // runButton.insertAdjacentElement("afterend", progressDiv);

        const options = {
          interval: 50, //wait for 0.05 sec
          statusCallback: (j) => {
            console.log("Job Status: ", j.jobStatus);
          },
        };

        //TODO - download output file
        jobInfo.waitForJobCompletion(options).then(() => {
          if (progressDiv) {
            // runButton.remove();
            progressDiv.remove();
          }
          //show the emails
          jobInfo.fetchResultData(
            // "Send_Email"
            ).then(function (result) {
            console.log("job result:", result.value);
            // htmlStr =
            //   "Task is complete! Please send emails below." + result.value;

            runButton.innerText = "Download";
            runButton.style.background = "#0054A4";
            runButton.style.border = "#0054A4";
            //click the button to download the output file
            runButton.onclick = function () {
              console.log("download clicked");
            };
          });
        });
      })
      .catch(function (e) {
        console.log("GP job failed", e);
      });
    console.log("GP service job submitted");
  });
}
