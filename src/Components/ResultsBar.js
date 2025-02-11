//Modules
import { auth } from "../utils/firebase";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const ResultsBar = () => {
  const { boothID } = useParams();

  //defining State
  const [pollQuestion, setPollQuestion] = useState("");
  const [totalVotes, setTotalVotes] = useState(0);
  const [pollOptions, setPollOptions] = useState([]);


  useEffect(() => {
    getDatabase().then((snapshot) => {
      const voteValues = [];
      let newArray = [];
      setPollQuestion(snapshot.val().pollQuestion);
      newArray.push(snapshot.val().pollOptions);
      if (newArray[0]) {
        newArray[0].map((poll) => {
          voteValues.push(poll.votes);
          poll.percentage = 0;
        })
        let sum = 0;
        voteValues.forEach((vote) => {
          sum += vote;
        })
        voteValues.forEach((vote, index) => {
          if (vote > 0) {
            newArray[0][index].percentage = Math.floor((vote / sum) * 100);
          }
        })
        if (sum === 0) {
          Swal.fire("No votes yet!");
        }
        setTotalVotes(sum);
        setPollOptions(newArray[0])
      }
    })
  }, [totalVotes]);

  async function getDatabase() {
    const dbRef = ref(auth, `/${boothID}`);
    const snapshot = await get(dbRef);
    return snapshot;
  }

  return (
    <>
      <div className="results-container">
        <div className="question-container">
          <h4>Question:</h4>
          <h2>{pollQuestion}</h2>
        </div>

        <section className="progress-bars-container">
          {pollOptions &&
            pollOptions.map((poll) => {
              return (
                <>
                  <div className="single-result-container">
                    <h3>{poll.pollOption}</h3>
                    <ProgressBar completed={poll.percentage} bgColor="#FF1F25" />
                    <p>Votes: {poll.votes}</p>
                  </div>
                </>
              )
            })
          }
        </section>

        <h4>Total Votes: {totalVotes}</h4>
      </div>
    </>
  );
};

export default ResultsBar;

// Progress bar courtesy of
// https://dev.to/ramonak/react-how-to-create-a-custom-progress-bar-component-in-5-minutes-2lcl