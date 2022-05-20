var assignment_id = window.location.href.split("/")[4];
var url1 = "https://edpuzzle.com/api/v3/assignments/"+assignment_id;

var request1 = new XMLHttpRequest();
request1.open("GET", url1, false);
request1.send();
var assignment = JSON.parse(request1.responseText);

var media_id = assignment.teacherAssignments[0].contentId;
var classroom_id = assignment.teacherAssignments[0].classroom.id;
var url2 = "https://edpuzzle.com/api/v3/assignments/classrooms/"+classroom_id+"/students/";

var request2 = new XMLHttpRequest();
request2.open("GET", url2, false);
request2.send();
var classroom = JSON.parse(request2.responseText);
var media;

for (let i=0; i<classroom.medias.length; i++) {
  media = classroom.medias[i];
  if (media._id == media_id) {
    break;
  }
  if (i == classroom.medias.length-1) {
    media = null;
  }
}

if (media == null) {
  alert("Could not get the media for this assignment.");
}
else {
  var questions = media.questions;
  var base_html = `
  <style>
    * {
      font-family: Arial;
      line-height: 100%;
    }
    li {
      font-size: 12px;
    }
    .header > * {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    .question > * {
      margin-top: 0px;
      margin-bottom: 0px;
      font-weight: bold;
      float: right;
    }
    .question {
      font-size: 14px;
      width: auto;
    }
    .timestamp_div {
      width: 36px;
      font-size: 14px;
    }
    .timestamp_div > * {
      margin-top: 0px;
      margin-bottom: 0px;
    }
  </style>
  <h2 style="margin-bottom: 0px">Answers for this assignment:</h2>
  <p style="font-size: 12px">Correct choices are <u>underlined</u>.</p>
  <hr>`;
  var popup = window.open("about:blank", "", "width=600, height=400");
  popup.document.write(base_html);
  var question;
  var counter = 0;
  
  for (let i=0; i<questions.length; i++) {
    question = questions[i];
    
    if (typeof question.choices != "undefined") {
      let min = Math.floor(question.time/60).toString();
      let secs = Math.floor(question.time%60).toString();
      if (secs.length == 1) {
        secs = "0"+secs;
      }
      let timestamp = min+":"+secs;
      let question_content;
      if (question.body[0].text != "") {
        question_content = `<p>${question.body[0].text}</p>`;
      }
      else {
        question_content = question.body[0].html;
      }
      let table = `
      <table>
        <tr class="header">
          <td class="timestamp_div">
            <p>[${timestamp}]</p>
          </td>
          <td class="question">
            ${question_content}
          </td>
        </tr>
      </table>
      `;
      popup.document.write(table);
      popup.document.write(`<ul style="margin-top: 0px;">`);
      
      
      for (let j=0; j<question.choices.length; j++) {
        let choice = question.choices[j];
        if (typeof choice.body != "undefined") {
          counter++;
          if (choice.body[0].text != "") {
            if (choice.isCorrect == true) {
              popup.document.write(`<li><u>${choice.body[0].text}</u></li>`);
            }
            else {
              popup.document.write(`<li>${choice.body[0].text}</li>`);
            }
          }
          else {
            if (choice.isCorrect == true) {
              popup.document.write(`<li><u>${choice.body[0].html}</u></li>`);
            }
            else {
              popup.document.write(`<li>${choice.body[0].html}</li>`);
            }
          }
        }
      }
      popup.document.write("</ul>");
      popup.document.write("<hr>");
    }
  }
  if (counter == 0) {
    popup.document.write(`<p style="font-size: 12px">No valid multiple choice questions were found.</u></p>`);
    popup.document.write("<hr>");
  }
  popup.document.write(`<p style="font-size: 12px">Source code: <a href="https://github.com/ading2210/edpuzzle-answers">https://github.com/ading2210/edpuzzle-answers</a></p>`);
}