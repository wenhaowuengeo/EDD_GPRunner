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
