import { useState } from 'react'


const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>


const AnecdoteOfDay = ({ anecdote, votes, onVoteClick, onNextAnedoteClick }) => {
  return (
    <>
      <h1>Anecdote of the day</h1>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
      <Button onClick={onVoteClick} text='vote' />
      <Button onClick={onNextAnedoteClick} text='next anecdote' />
    </>
  )
}

const AnecdoteMostVotes = ({ anecdote }) => {
  return (
    <>
      <h1>Anecdote with most votes</h1>
      <p>{anecdote}</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]


  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const handleNextAnecdoteClick = () => {
    const nextRandomAnecdotesIndex = Math.floor(Math.random() * anecdotes.length)
    console.log('random number:', nextRandomAnecdotesIndex)
    setSelected(nextRandomAnecdotesIndex)
  }

  const handleVotesClick = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)
  }

  const indexAnecdoteMostVotes = () => {
    let maxIndex = 0

    for (let i = 1; i < votes.length; i++) {
      if (votes[i] > votes[maxIndex]) {
        maxIndex = i
      }
    }

    console.log('maxIndex', maxIndex)

    return maxIndex
  }


  return (
    <div>
      <AnecdoteOfDay anecdote={anecdotes[selected]} votes={votes[selected]} onVoteClick={handleVotesClick} onNextAnedoteClick={handleNextAnecdoteClick} />
      <AnecdoteMostVotes anecdote={anecdotes[indexAnecdoteMostVotes()]} />
    </div>
  )
}

export default App
