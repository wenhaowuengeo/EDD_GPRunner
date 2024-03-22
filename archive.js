//CODE FOR 2024/03/20
//Run button's onclick event
//TODO - for batch task running: once the run button is hit, it will run the tasks from top to bottom

async function submitGPJob(params, i) {
  //take the parameter and the index of this task
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
        progressDiv.style.color = "#0054A4";
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
                "Task is complete. Refresh the page to run another task";
              // progressDiv.remove();
            }

            jobInfo
              .fetchResultData(
                "output2" //this is output variable name
              )
              .then(function (result) {
                //prevCompleted = true; //mark the previous job is completed.
                console.log("this job is completed # ", i);
                console.log("job result:", result.value);

                var downloadButton = document.getElementById("downloadID" + i);

                //Activate download button when the job is completed
                //TODO - add logic to only run the tasks that are NOT run yet. Mark a starting index till the inputCount limit
                downloadButton.style.background = "#0054A4";
                downloadButton.style.border = "#0054A4";
                //click the button to generate and download the output excel file
                //TODO - Convert json string to excel - https://stackoverflow.com/questions/28892885/javascript-json-to-excel-file-download
                downloadButton.onclick = function () {
                  console.log("download clicked");
                  window.open(
                    result.value,
                    "_blank",
                    "location=yes,height=570,width=520,scrollbars=yes,status=yes"
                  );
                };
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
  } catch (error) {
    console.error(`Error with job submission or completion: ${error}`);
    // Depending on your error handling strategy, you might want to re-throw, handle the error, or simply log it
    throw error; // Optional: Re-throw if you want to handle it further up, such as skipping the current job and continuing with the next
  }
}

//Run button function
async function runFunc() {
  console.log("the run button is clicked");
  console.log("number of tasks: ", inputCount + 1);

  //fade the run button
  var runButton = document.getElementById("runButtonID");
  runButton.style.background = "grey";
  runButton.style.border = "grey";

  //TODO - use a for loop to run the GP service for all tasks, need to make sure second task won't start until first one is done or errorred.
  //Tests show that GP services CANNOT be run in parallel, but has to run one after another!
  //for (let i = 0; i < inputCount + 1; i++) {

  //var prevCompleted = false;

  for (let i = 0; i < inputCount + 1; i++) {
    //trigger GP service
    console.log("enter for loop: ", i);
    require(["esri/tasks/Geoprocessor", "esri/rest/support/JobInfo"], async (
      Geoprocessor,
      JobInfo
    ) => {
      // console.log("before gp def");
      var gp = new Geoprocessor(
        // "https://mygis.engeo.com/server/rest/services/CAF_23777/siteacessemailto/GPServer/siteacessemailto/" //for the "site access mail to" GP task
        "https://mygis.engeo.com/server/rest/services/APIs/eddconvertor2/GPServer/EDD%20Converter"
      );
      console.log("running task for #", i);
      //TODO - use if else condition to check for previous iteration is completed? not really working...
      //TODO - alternatively, can use async and wait to make sure each iteration is completed before going on to the next one

      var params = {
        Type_of_EDD: window["EDDType" + i],
        EDD_Table: window["inputfileString" + i],
      };

      console.log("input params for #" + i + ":", params);

      if (EDD_Table && Type_of_EDD) {
        //run the individual task
        await submitGPJob(params, i);

        console.log("GP service job submitted for # ", i);
      } else {
        //Show empty input file message
        var noInputDiv = document.createElement("div");
        noInputDiv.setAttribute("id", "noInputText" + i);
        noInputDiv.innerText = "No file uploaded";
        noInputDiv.style.margin = "5px 15px 5px";
        noInputDiv.style.fontSize = "1.0em";
        noInputDiv.style.fontWeight = "bold";
        noInputDiv.style.color = "#d7301f";
        noInputDiv.style.textAlign = "center";
        document
          .getElementById("inputRowContainerID" + i)
          .appendChild(noInputDiv);
      }
    });
  }
  //}
}

//submit the gp service
// console.log("before gp submission");

//this is not reporting error
// gp.submitJob([params]).catch((error) => console.error(error.message));

// console.log("after catcherror: ");
//Use standard doc's implementation: https://developers.arcgis.com/arcgis-rest-js/api-reference/arcgis-rest-request/Job/
// gp.submitJob([params])
//   .then((job) => {
//     return job.getAllResults();
//   })
//   .then((allResults) => {
//     console.log(allResults);
//   })
//   .catch((e) => {
//     if (e.name === "ArcGISJobError") {
//       console.log(
//         "Something went wrong while running the job",
//         e.jobInfo
//       );
//     }
//   });

// gp.submitJob(params)
//   .then((job) => {
//     return job.waitForCompletion();
//   })
//   .then((jobInfo) => {
//     console.log("job finished", e.jobInfo);
//   })
//   .catch((e) => {
//     if (e.name === "ArcGISJobError") {
//       console.log(
//         "Something went wrong while running the job",
//         e.jobInfo
//       );
//     }
//   });

// TODO - Debug - check while executing
// if (jobInfo.jobStatus !== JobInfo.STATUS_SUCCEEDED) {
//   console.log(
//     "Job did not complete successfully. Inspecting messages..."
//   );

// //use getJobInfo() - not a function!
// var thisJobId = jobInfo.jobId;
// console.log("this jobid: ", thisJobId);
// gp.getJobInfo(thisJobId).then(function (jobInfo) {
//   if (jobInfo.jobStatus === "esriJobFailed") {
//     console.log("Job failed:", jobInfo.messages);
//   }
// });

// //use checkJobStatus() - undefined method!
// gp.checkJobStatus(thisJobId).then(function (status) {
//   if (
//     status.jobStatus === "esriJobFailed" ||
//     status.jobStatus === "esriJobCancelled"
//   ) {
//     console.log("Job failed or was cancelled");
//     fetchJobMessages(gp, thisJobId); // Fetch error messages
//   } else if (status.jobStatus === "esriJobSucceeded") {
//     console.log("Job succeeded");
//     // Proceed to fetch results
//   } else {
//     // If job is still running, check again after some delay
//     setTimeout(() => checkJobStatus(gp, thisJobId), 2000);
//   }
// });

// This was never run - result can be incomplete yet
// gp.getResultData(jobInfo.jobId, "messages", function (messages) {
//   messages.value.forEach(function (message) {
//     // Check for error messages
//     if (message.type === GPMessage.TYPE_ERROR) {
//       console.log("GP Error Message: ", message.description);
//     } else {
//       console.log("GP message", message);
//     }
//   });
// }).catch((error) => {
//   console.log("error during execution: ", error);
//   console.log(
//     "error during execution stringify: ",
//     JSON.stringify(error)
//   );
// });
// }

//DEBUG - config is not the reason!
// require(["esri/config"], (esriConfig) => {
//   esriConfig.request.interceptors?.push({
//     before(params) {
//       if (params.url.includes("query")) {
//         params.requestOptions.query.f = "json";
//       }
//     },
//   });
// });
