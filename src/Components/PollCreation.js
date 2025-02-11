//Modules
import { useState } from "react";
import { auth } from "../utils/firebase.js";
import { ref, push } from "firebase/database";
import Swal from "sweetalert2";
//Components
import PollConfirmation from "./PollConfirmation";
import PollOptionField from "./PollOptionField";


const PollCreation = () => {
  //defining State
  const [pollQuestion, setPollQuestion] = useState("");
  const [newPollId, setNewPollId] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pollOptionData, setPollOptionData] = useState([])
  const [previousState, setPreviousState] = useState(true)

  const getFormValues = (formValues, e) => {
    e.preventDefault();
    formValues.map((formValue) => {
      formValue.votes = 0
    })
    setPollOptionData(formValues);
  };

  const isDone = (moreOptions) => {
    setPreviousState(moreOptions)
  }

  const addPoll = (e) => {
    e.preventDefault()

    const pollObject = {
      pollQuestion: pollQuestion,
      pollOptions: [...pollOptionData],
    };

    const dbRef = ref(auth);

    if (!pollQuestion == "") {
      push(dbRef, pollObject)
        .then((newPollRef) => {
          const pollRef = newPollRef.key
          setNewPollId(pollRef);
        }
        );
      setIsSubmitted(true);
    } else {
      Swal.fire({
        text: "You cannot have an empty question",
      });
    };


    pollOptionData.forEach((pollOption) => {
      if (pollOption.pollOption == "") {
        Swal.fire({
          text: "Please fill all fields or remove any empty fields to continue"
        });
        setIsSubmitted(false);
      }
    })
  };

  const handleQuestionChange = (e) => {
    setPollQuestion(e.target.value);
  };

  const changeBackground = (e) => {
    e.target.style.background = '#0043bf';
  }

  const revertBackground = (e) => {
    e.target.style.background = '#0057fc';
  }

  return (
    <section className="create-poll-container">
      {isSubmitted ?
        <PollConfirmation pollId={newPollId} /> :
        <div>
          {
            <>
              <h2>Create Your Poll</h2>
              <form className="create-poll-form">
                <h3>What's your question?</h3>
                <input
                  type="text"
                  maxLength={80}
                  className="poll-input poll-question"
                  name="poll-question"
                  placeholder="Poll Question"
                  value={pollQuestion}
                  onChange={handleQuestionChange}
                  aria-label="Poll Question"
                />

                <h3>Enter polling options:</h3>

                <PollOptionField getFormValues={getFormValues} isDone={isDone} />
                {previousState ?
                  <div></div> :
                  <>
                    <div className="create-buttons">
                      <button
                        className="button primary"
                        aria-label="create poll"
                        onMouseOver={changeBackground}
                        onMouseLeave={revertBackground}
                        onClick={addPoll}>
                        Submit</button>
                    </div>
                  </>
                }
              </form>
            </>
          }
        </div>
      }
    </section>
  );
};

export default PollCreation;