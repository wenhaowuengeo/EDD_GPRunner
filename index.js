var htmlStr = "";
//onclick event

function runFunc() {
  console.log("run button is clicked");

  //trigger GP service
  require(["esri/tasks/Geoprocessor", "esri/rest/support/JobInfo"], (
    Geoprocessor,
    JobInfo
  ) => {
    // console.log("before gp def");
    var gp = new Geoprocessor(
      "https://mygis.engeo.com/server/rest/services/CAF_23777/siteacessemailto/GPServer/siteacessemailto/"
    );

    //define the input parameters for the EDD GP service task
    // var params = {
    //   "Input_Feature": "",
    // };

    //submit the gp service
    // console.log("before gp submission");

    gp.submitJob() //specify the input parameter here
      .then(function (jobInfo) {
        // gp.execute().then(function(jobInfo){ //CANNOT use execute() since the GP service job itself is defined as submitJob() operation
        // const jobid = jobInfo.jobId;
        // console.log("job id: ", jobid);

        // document.getElementById("progressBar").style.display = "block";

        var progressDiv = document.createElement("div");
        progressDiv.setAttribute("id", "progressText");
        progressDiv.innerText = "Task is running ... ";
        progressDiv.style.margin = "20px 25px 20px";
        progressDiv.style.fontSize = "1.2em";
        progressDiv.style.textAlign = "center";
        document.getElementsByTagName("body")[0].appendChild(progressDiv);

        const options = {
          interval: 100, //wait for 0.1 sec
          statusCallback: (j) => {
            console.log("Job Status: ", j.jobStatus);
          },
        };

        jobInfo.waitForJobCompletion(options).then(() => {
          //change the progress text
          progressDiv.innerText =
            "Task is complete! Please click the Send Emails button.";

          // document.getElementById("progressBar").style.display = "none";

          // alert("Task is complete! Please click the Send Emails button.");

          jobInfo.fetchResultData("Send_Email").then(function (result) {
            console.log("job result:", result.value);
            htmlStr = result.value;
          });
        });
      })
      .catch(function (e) {
        console.log("GP job failed", e);
      });
    console.log("GP service job submitted");
  });
}

var emailBtnCounter = 0;

function emailFunc() {
  //clear the progress text
  if (document.getElementById("progressText")) {
    document.getElementById("progressText").remove();
  }

  emailBtnCounter++;
  console.log("email button is clicked");
  // document.getElementById("emailButtonID").style.color = 'blue';

  var emailDiv = document.createElement("div");
  emailDiv.style.textAlign = "center";

  if (htmlStr) {
    emailDiv.innerHTML = String(htmlStr);
  }

  if (emailBtnCounter == 1) {
    // document.getElementsByTagName('body')[0].appendChild(document.createElement('br'))
    document.getElementsByTagName("body")[0].appendChild(emailDiv);
  }
}
