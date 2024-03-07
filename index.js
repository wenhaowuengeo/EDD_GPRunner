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

    //TODO - integrate the converting logic here
  }
}

//Run button's onclick event
function runFunc() {
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

  console.log("run button is clicked");

  //trigger GP service
  require(["esri/tasks/Geoprocessor", "esri/rest/support/JobInfo"], (
    Geoprocessor,
    JobInfo
  ) => {
    // console.log("before gp def");
    var gp = new Geoprocessor(
      //TODO - replace this with the EDD GP service
      // "https://mygis.engeo.com/server/rest/services/CAF_23777/siteacessemailto/GPServer/siteacessemailto/" //for the "site access mail to" GP task
      "https://mygis.engeo.com/server/rest/services/APIs/eddconvertor2/GPServer/EDD%20Converter"
    );

    //TODO - parse the input parameters from the file upload

    ////TODO - Debugging! Why???
    // TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
    // at Function.invokeGetter (<anonymous>:3:28)

    //define the input parameters
    if (inputfileString) {
      console.log("input file str is not null: ", inputfileString);
      var params = {
        EDD_Table: inputfileString, //hardcode for debugging
        // EDD_Table:
        //   "[{'LABSAMPID':'2312932-001A','LABCODE':'MAI','SAMPID':'Clarifier #4-1'','PROJNAME':'Sunnyvale Rehab','SAMPDATE':'12/13/2023','RECEIVEDATE':'12/13/2023','PREPDATE':'12/18/2023','MATRIX':'Soil','TESTCODE':'8081PCB_ESL_LL_S','TESTNO':'SW8081B','BATCHID':'284330','ANALDATE':'12/19/2023','ANALYTE':'Heptachlor epoxide','CAS':'1024-57-3','ANALYTETYPE':'A','SAMPTYPE':'SAMP','FINALVAL':'ND','DILFAC':'1','MDL':'0.000031','PQL':'0.00011','UNITS':'mg/kg-dry','ANALYST':'CN'},{'LABSAMPID':'2312932-001A','LABCODE':'MAI','SAMPID':'Clarifier #4-1'','PROJNAME':'Sunnyvale Rehab','SAMPDATE':'12/13/2023','RECEIVEDATE':'12/13/2023','PREPDATE':'12/18/2023','MATRIX':'Soil','TESTCODE':'8081PCB_ESL_LL_S','TESTNO':'SW8081B','BATCHID':'284330','ANALDATE':'12/19/2023','ANALYTE':'Endosulfan sulfate','CAS':'1031-07-8','ANALYTETYPE':'A','SAMPTYPE':'SAMP','FINALVAL':'ND','DILFAC':'1','MDL':'0.000038','PQL':'0.00011','UNITS':'mg/kg-dry','ANALYST':'CN'},{'LABSAMPID':'2312932-001A','LABCODE':'MAI','SAMPID':'Clarifier #4-1'','PROJNAME':'Sunnyvale Rehab','SAMPDATE':'12/13/2023','RECEIVEDATE':'12/13/2023','PREPDATE':'12/18/2023','MATRIX':'Soil','TESTCODE':'8081PCB_ESL_LL_S','TESTNO':'SW8081B','BATCHID':'284330','ANALDATE':'12/19/2023','ANALYTE':'b-BHC','CAS':'319-85-7','ANALYTETYPE':'A','SAMPTYPE':'SAMP','FINALVAL':'ND','DILFAC':'1','MDL':'0.000041','PQL':'0.00011','UNITS':'mg/kg-dry','ANALYST':'CN'}]",
        //TODO - create a dropdown for three options
        Type_of_EDD: "Soil Gas and IA",
        // Type_of_EDD: "Soil",
      };

      console.log("input params: ", params);

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

      //TODO - ORIGINAL
      //IMPORTANT - [params] is INCORRECT! problematic!!! https://enterprise.arcgis.com/en/server/10.8/publish-services/windows/using-geoprocessing-tasks-in-web-applications.htm
      gp.submitJob(params)
        .then(function (jobInfo) {
          console.log("after submit job - job info: ", jobInfo);

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

          // console.log("mid submit - job info: ", jobInfo);

          const options = {
            interval: 50, //wait for 0.05 sec
            statusCallback: (j) => {
              console.log("Job Status: ", j.jobStatus); //actually this keeps running!
            },
          };

          // console.log("after options and before waitforjob complete");

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

          // wait for the job to complete - produces generic error
          jobInfo
            .waitForJobCompletion(options)
            .then(() => {
              console.log("job completed");
              if (progressDiv) {
                progressDiv.remove();
              }
              // //show the emails
              jobInfo
                .fetchResultData(
                  "output2" //this is output variable name
                )
                .then(function (result) {
                  console.log("job result:", result.value);

                  runButton.innerText = "Download";
                  runButton.style.background = "#0054A4";
                  runButton.style.border = "#0054A4";
                  //click the button to generate and download the output excel file
                  //TODO - Convert json string to excel - https://stackoverflow.com/questions/28892885/javascript-json-to-excel-file-download
                  runButton.onclick = function () {
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
              console.log("error during execution: ", error);
              console.log(
                "error during execution stringify: ",
                JSON.stringify(error)
              );
            });

          // catch error
        })
        .catch(function (e) {
          console.log("GP job failed", e);
        });

      console.log("GP service job submitted");
    }
  });
}
