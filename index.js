//TODO - user case of mixed EDD types in one input file
//TODO - Clean up error catching mechanism
//TODO - Fetch more jobInfo to track each step of processing

function removeTask(rowID) {
  var row = document.getElementById(rowID);
  if (row) {
    row.remove();
    inputCount--;
  }
}

//Run button's onclick event
//TODO - for batch task running: once the run button is hit, it will run the tasks from top to bottom

//Run button function
// export function runFunc() {
//import library
require(["esri/tasks/Geoprocessor", "esri/rest/support/JobInfo"], (
  Geoprocessor,
  JobInfo
) => {
  //console.log("before gp def");
  window.runFunc = async function () {
    console.log("the run button is clicked");
    console.log("number of tasks: ", inputCount + 1);

    //fade the run button
    var runButton = document.getElementById("runButtonID");
    runButton.style.background = "grey";
    runButton.style.border = "grey";

    var gp = new Geoprocessor(
      "https://mygis.engeo.com/server/rest/services/APIs/eddconvertor2/GPServer/EDD%20Converter"
    );

    //TODO - use a for loop to run the GP service for all tasks, need to make sure second task won't start until first one is done or errorred.
    //Tests show that GP services CANNOT be run in parallel, but has to run one after another!
    //for (let i = 0; i < inputCount + 1; i++) {
    for (let i = 0; i < inputCount + 1; i++) {
      console.log("running task for #", i);
      //check the task exists
      var taskRow = document.getElementById("inputRowContainerID" + i);
      if (taskRow) {
        ///NO NEED TO CHECK!! TODO - consolidate all the individual checks into one check

        //if task row exists
        var params = {
          Type_of_EDD: window["UploadedEDDType" + i],
          // Type_of_EDD: window["EDDType" + i],
          EDD_Table: window["inputfileString" + i],
        };

        console.log("input params for #" + i + ":", params);

        if (
          params.EDD_Table &&
          params.Type_of_EDD &&
          ["Soil", "Groundwater", "Soil Gas and IA"].indexOf(
            params.Type_of_EDD
          ) != -1
        ) {
          //TODO - alternatively, can use async and wait to make sure each iteration is completed before going on to the next one
          //run the individual task
          // await submitGPJob(params, i); //this will cause the error of "runFunc() is NOT defined"
          await submitGPJob(params, gp, i); //todo - this need to wait for completion

          console.log("GP service job submitted for # ", i);
        } else if (!params.EDD_Table) {
          alert("Please upload an input Excel file.");
        } else {
          //Show empty input file message
          var noInputDiv = document.createElement("div");
          noInputDiv.setAttribute("id", "noInputText" + i);
          noInputDiv.innerText = "No file uploaded or wrong EDD type in file";
          noInputDiv.style.margin = "5px 15px 5px";
          noInputDiv.style.fontSize = "1.0em";
          noInputDiv.style.fontWeight = "bold";
          noInputDiv.style.color = "#d7301f";
          noInputDiv.style.textAlign = "center";
          document
            .getElementById("inputRowContainerID" + i)
            .appendChild(noInputDiv);
        }
      } else {
        continue;
      }
    }
  };
});

//expose to global scope
// window.runFunc() = runFunc();
//);
//}
//}

//Define an async function
// export async function submitGPJob(params, gp, i) {
async function submitGPJob(params, gp, i) {
  //take the parameter and the index of this task

  return new Promise((resolve, reject) => {
    try {
      console.log("submit this job now: ", i);

      gp.submitJob(params)
        .then(function (jobInfo) {
          console.log("after submit job - job info: ", jobInfo);

          var progressDiv = document.getElementById("fileInfo" + i); //get the text div for the progress text to be placed in
          progressDiv.innerText = "Task is running ... ";
          progressDiv.style.margin = "5px 15px 5px";
          progressDiv.style.fontSize = "1.0em";
          progressDiv.style.fontWeight = "bold";
          progressDiv.style.color = "#fe9929";
          progressDiv.style.textAlign = "center";

          // console.log("mid submit - job info: ", jobInfo);

          const options = {
            interval: 50, //wait for 0.05 sec
            statusCallback: (j) => {
              console.log("Job Status: ", j.jobStatus); //actually this keeps running!
            },
          };

          // console.log("after options and before waitforjob complete");

          // wait for the job to complete - produces generic error
          jobInfo
            .waitForJobCompletion(options)
            .then(() => {
              console.log("job completed");
              if (progressDiv) {
                progressDiv.innerText =
                  "Task is complete. Click Download to get the output.";
                progressDiv.style.color = "#1a9850";
                // progressDiv.remove();
              }

              jobInfo
                .fetchResultData(
                  "output2" //this is output variable name
                )
                .then(function (result) {
                  result_dict[i] = result.value; //add to the result dict
                  // result_dict.push({
                  //   key: i,
                  //   value: result,
                  // });
                  //prevCompleted = true; //mark the previous job is completed.
                  console.log("this job is completed # ", i);
                  console.log("job result:", result.value);

                  // var downloadButton = document.getElementById(
                  //   "downloadID" + i
                  // );

                  //Activate download button when the job is completed
                  //TODO - add logic to only run the tasks that are NOT run yet. Mark a starting index till the inputCount limit
                  // downloadButton.style.background = "#0054A4";
                  // downloadButton.style.border = "#0054A4";
                  //click the button to generate and download the output excel file
                  //ref - Convert json string to excel - https://stackoverflow.com/questions/28892885/javascript-json-to-excel-file-download

                  //TODO - the GP service will always return the latest excel as URL. I need to save the excel output to the button for download
                  //TODO - hide the download button by default, and creat them on the fly
                  //option 1: TODO - use fetch() and blob() - why no reaction?
                  //ref: https://stackoverflow.com/questions/51444927/fetch-blob-from-url-and-write-to-file
                  fetch(result.value)
                    .then((response) => response.blob())
                    .then((blob) => {
                      const blobURL = URL.createObjectURL(blob);
                      console.log("blob url: ", blobURL);
                      //create a new button
                      // <button id="downloadID0" type="button" class="btn btn-primary" style="background-color:grey; border-color:grey;">Download</button>
                      const downloadButtonNew = document.createElement("a");
                      downloadButtonNew.className = "btn btn-primary";
                      downloadButtonNew.type = "button";
                      downloadButtonNew.style.backgroundColor = "#0054A4";
                      downloadButtonNew.style.borderColor = "#0054A4";
                      downloadButtonNew.href = blobURL;
                      console.log("param type", params.Type_of_EDD);
                      downloadButtonNew.download =
                        "Output #" + i + "-" + params.Type_of_EDD + ".xlsx";
                      downloadButtonNew.textContent = `Download #${i}`;
                      document
                        .getElementById("inputRowContainerID" + i)
                        .appendChild(downloadButtonNew);
                    })
                    .catch((error) =>
                      console.error("Error fetching the Excel file:", error)
                    );

                  //option 2: use onclick function
                  // downloadButton.onclick = function () {
                  //   console.log("download clicked");
                  //   window.open(
                  //     // result.value,
                  //     result_dict[i],
                  //     "_blank",
                  //     "location=yes,height=570,width=520,scrollbars=yes,status=yes"
                  //   );
                  // };

                  console.log("result dict: ", result_dict);

                  resolve(result);
                });
            })
            .catch((error) => {
              //prevCompleted = true; //mark the previous job is completed.
              console.log("this job is completed but has error# ", i);
              console.log("error: ", error);
              console.log(
                "error during execution during task #" + i,
                JSON.stringify(error)
              );

              //Show error message
              var errorDiv = document.createElement("div");
              errorDiv.setAttribute("id", "errorText" + i);
              errorDiv.innerText = "Oops, there's an error: " + error;
              errorDiv.style.margin = "5px 15px 5px";
              errorDiv.style.fontSize = "1.0em";
              errorDiv.style.fontWeight = "bold";
              errorDiv.style.color = "#d7301f";
              errorDiv.style.textAlign = "center";
              document
                .getElementById("inputRowContainerID" + i)
                .appendChild(errorDiv);
            });

          // catch error
        })
        .catch(function (e) {
          console.log("GP job failed", e);
        });

      // resolve(); //resolve the promise
    } catch (error) {
      console.error(`Error with job submission or completion: ${error}`);
      // Depending on your error handling strategy, you might want to re-throw, handle the error, or simply log it
      reject(error);
      throw error; // Optional: Re-throw if you want to handle it further up, such as skipping the current job and continuing with the next
    }
  });
}
